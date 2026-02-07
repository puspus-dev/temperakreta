# TemperaNapló

Ez egy egyszerű, demo változat a "TemperaNapló" realtime napló rendszerből. A cél egy modern, áttekinthető és felhasználóbarát napló, realtime frissítésekkel.

Gyors futtatás (helyi fejlesztés):

1. Telepítsd a függőségeket:

```bash
npm install
```

2. Indítsd el a szervert (dev):

```bash
npm run dev
```

3. Nyisd meg a böngészőt: http://localhost:3000

Admin token:

- Alapértelmezett token: `devtoken` (fejlesztési célokra). Egy éles telepítésnél állítsd be az `ADMIN_TOKEN` környezeti változót.

API dokumentáció: lásd `openapi.yaml` a gyökérben.

Megjegyzés:

Ez a repo egy teljesen működő, futtatható demo, amely bemutatja a TemperaNapló főbb funkcióit.

Fő jellemzők (demo):

- Realtime frissítések Socket.IO-val.
- Egyszerű REST API `GET/POST/PATCH/DELETE /api/entries` végpontokkal.
- Admin autentikáció egyszerű `X-Admin-Token` fejlécen keresztül (fejlesztési token: `devtoken`).
- Minimális, modern és áttekinthető statikus frontend demo (no build rendszer).
- OpenAPI dokumentáció: `openapi.yaml`.
- Dockerfile a gyors konténeres futtatáshoz.

Fejlesztés / terjesztés:

- Lokálisan futtatás: lásd fent.
Dockerben futtatás (egyszerű):

```bash
docker build -t temperanaplo:stable .
docker run -p 3000:3000 --env JWT_SECRET=securetoken --env DATABASE_URL=postgres://postgres:postgres@db:5432/temperanaplo temperanaplo:stable
```

Dev/production javasolt (Docker Compose, Postgres):

```bash
docker compose up --build
```

Fejlesztési jegyzetek:

- Jelen demo nem használ perzisztens adatbázist; újraindításnál az adatok elvesznek.
- Ajánlott továbbfejlesztések: perzisztencia (Postgres/Mongo), felhasználói fiókok, RBAC, HTTPS és JWT alapú auth.
 - Ajánlott továbbfejlesztések: RBAC kibővítése, input validáció, audit logok, HTTPS és CI/CD.

Fájlok:

- [openapi.yaml](openapi.yaml) — API dokumentáció.
- [server.js](server.js) — szerver logika.
- [public/index.html](public/index.html) — egyszerű frontend demo.
- [Dockerfile](Dockerfile) — konténer build.
- [test_smoke.sh](test_smoke.sh) — alap smoke teszt a helyi szolgáltatáshoz.

Iskola választó:

- A frontendben található egy legördülő lista az elérhető iskolákkal. Válaszd ki az iskolát, majd küldd a bejegyzéseket az adott iskolához.
- API végpontok: `GET /api/schools`, `POST /api/schools` (admin).

Használat (quick):

1. Indítsd el a szolgáltatást (lokálisan vagy Docker Compose):

```bash
npm install
npm run dev
# vagy docker compose up --build
```

2. Ha első indítás: töltsd ki a regisztrációt a `POST /api/auth/register` végponton (csak ha még nincs felhasználó). Ez ad egy admin JWT-t.

3. Jelentkezz be a `POST /api/auth/login` végponton, kapott tokennel írd be a frontend `Admin token` mezőjébe (Bearer token formátum helyett csak a token string). A frontend a `Authorization: Bearer <token>` fejlécet állítja be automatikusan.

Ha szeretnéd, folytatom a fejlesztést: React/TypeScript frontend, perzisztens DB és teljes jogosultságkezelés bevezetése.