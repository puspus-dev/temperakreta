const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
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

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'devtoken';

let nextId = 1;
const entries = [];

function isAdmin(req) {
  const token = req.headers['x-admin-token'];
  return token && token === ADMIN_TOKEN;
}

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/entries', (req, res) => {
  const sorted = [...entries].sort((a, b) => b.createdAt - a.createdAt);
  res.json(sorted);
});

app.post('/api/entries', (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'admin required' });
  const { author = 'Admin', content } = req.body;
  if (!content) return res.status(400).json({ error: 'content required' });
  const entry = { id: nextId++, author, content, createdAt: Date.now(), updatedAt: Date.now() };
  entries.push(entry);
  io.emit('entry_created', entry);
  res.status(201).json(entry);
});

app.patch('/api/entries/:id', (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'admin required' });
  const id = Number(req.params.id);
  const entry = entries.find(e => e.id === id);
  if (!entry) return res.status(404).json({ error: 'not found' });
  const { content } = req.body;
  if (content) entry.content = content;
  entry.updatedAt = Date.now();
  io.emit('entry_updated', entry);
  res.json(entry);
});

app.delete('/api/entries/:id', (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'admin required' });
  const id = Number(req.params.id);
  const idx = entries.findIndex(e => e.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  const [deleted] = entries.splice(idx, 1);
  io.emit('entry_deleted', { id: deleted.id });
  res.json({ ok: true });
});

io.on('connection', socket => {
  console.log('socket connected', socket.id);
  socket.on('disconnect', () => console.log('socket disconnected', socket.id));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`TemperaNapló server listening on ${PORT}`));
