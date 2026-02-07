const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || null;
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/temperanaplo';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

const pool = new Pool({ connectionString: DATABASE_URL });

async function initDb(){
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at BIGINT NOT NULL DEFAULT (extract(epoch from now())::bigint)
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS schools (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at BIGINT NOT NULL DEFAULT (extract(epoch from now())::bigint)
  )`);

  await pool.query(`CREATE TABLE IF NOT EXISTS entries (
    id SERIAL PRIMARY KEY,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    school_id INTEGER REFERENCES schools(id) ON DELETE SET NULL,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
  )`);

  // seed a default school if none exists
  const s = await pool.query('SELECT COUNT(*)::int AS cnt FROM schools');
  if(s.rows[0].cnt === 0){
    await pool.query('INSERT INTO schools(name) VALUES($1)', ['Default School']);
  }
}

function makeToken(user){
  return jwt.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

async function requireAuth(req, res, next){
  const h = req.headers['authorization'];
  if(!h || !h.startsWith('Bearer ')) return res.status(401).json({ error: 'missing token' });
  const token = h.substring(7);
  try{
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  }catch(e){
    return res.status(401).json({ error: 'invalid token' });
  }
}

function requireAdmin(req, res, next){
  if(req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ error: 'admin required' });
}

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/entries', async (req, res) => {
  const schoolId = req.query.schoolId ? Number(req.query.schoolId) : null;
  let q = 'SELECT id, author, content, school_id AS "schoolId", created_at AS "createdAt", updated_at AS "updatedAt" FROM entries';
  const params = [];
  if(schoolId){ q += ' WHERE school_id=$1'; params.push(schoolId); }
  q += ' ORDER BY created_at DESC';
  const r = await pool.query(q, params);
  res.json(r.rows.map(row => ({ id: row.id, author: row.author, content: row.content, schoolId: row.schoolId ? Number(row.schoolId) : null, createdAt: Number(row.createdAt), updatedAt: Number(row.updatedAt) })));
});

app.post('/api/entries', requireAuth, requireAdmin, async (req, res) => {
  const { author = req.user.username || 'Admin', content, schoolId = null } = req.body;
  if (!content) return res.status(400).json({ error: 'content required' });
  const now = Date.now();
  const r = await pool.query('INSERT INTO entries(author,content,school_id,created_at,updated_at) VALUES($1,$2,$3,$4,$5) RETURNING id', [author, content, schoolId, now, now]);
  const entry = { id: r.rows[0].id, author, content, createdAt: now, updatedAt: now };
  io.emit('entry_created', entry);
  res.status(201).json(entry);
});

app.patch('/api/entries/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { content } = req.body;
  const now = Date.now();
  const r = await pool.query('UPDATE entries SET content=$1, updated_at=$2 WHERE id=$3 RETURNING id, author, content, created_at AS "createdAt", updated_at AS "updatedAt"', [content, now, id]);
  if(r.rowCount === 0) return res.status(404).json({ error: 'not found' });
  const row = r.rows[0];
  const entry = { id: row.id, author: row.author, content: row.content, createdAt: Number(row.createdAt), updatedAt: Number(row.updatedAt) };
  io.emit('entry_updated', entry);
  res.json(entry);
});

app.delete('/api/entries/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const r = await pool.query('DELETE FROM entries WHERE id=$1 RETURNING id', [id]);
  if(r.rowCount === 0) return res.status(404).json({ error: 'not found' });
  io.emit('entry_deleted', { id });
  res.json({ ok: true });
});

// Schools
app.get('/api/schools', async (req, res) => {
  const r = await pool.query('SELECT id, name, created_at AS "createdAt" FROM schools ORDER BY id');
  res.json(r.rows.map(rw=>({ id: rw.id, name: rw.name, createdAt: Number(rw.createdAt) })));
});

app.post('/api/schools', requireAuth, requireAdmin, async (req, res) => {
  const { name } = req.body || {};
  if(!name) return res.status(400).json({ error: 'name required' });
  const r = await pool.query('INSERT INTO schools(name) VALUES($1) RETURNING id, name, created_at AS "createdAt"', [name]);
  const school = r.rows[0];
  io.emit('school_created', { id: school.id, name: school.name });
  res.status(201).json({ id: school.id, name: school.name, createdAt: Number(school.createdAt) });
});

// Auth
app.post('/api/auth/register', async (req, res) => {
  const { username, password, role = 'admin' } = req.body || {};
  if(!username || !password) return res.status(400).json({ error: 'username and password required' });
  // allow registration only if no users exist
  const u = await pool.query('SELECT COUNT(*)::int AS cnt FROM users');
  if(u.rows[0].cnt > 0) return res.status(403).json({ error: 'registration disabled' });
  const hash = await bcrypt.hash(password, 10);
  const r = await pool.query('INSERT INTO users(username,password_hash,role) VALUES($1,$2,$3) RETURNING id, username, role', [username, hash, role]);
  const user = r.rows[0];
  const token = makeToken(user);
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  if(!username || !password) return res.status(400).json({ error: 'username and password required' });
  const r = await pool.query('SELECT id, username, password_hash, role FROM users WHERE username=$1', [username]);
  if(r.rowCount === 0) return res.status(401).json({ error: 'invalid credentials' });
  const user = r.rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if(!ok) return res.status(401).json({ error: 'invalid credentials' });
  const token = makeToken(user);
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

io.on('connection', socket => {
  console.log('socket connected', socket.id);
  socket.on('disconnect', () => console.log('socket disconnected', socket.id));
});

const PORT = process.env.PORT || 3000;
initDb().then(()=>{
  server.listen(PORT, () => console.log(`TemperaNapló server listening on ${PORT}`));
}).catch(err=>{
  console.error('DB init failed', err);
  process.exit(1);
});
