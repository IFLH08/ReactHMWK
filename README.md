# ReactHMWK

Aplicacion full-stack con backend en `API/` (Express + MongoDB + JWT) y frontend en `react/` (React + Vite).

## Estructura

- `API/`: servidor Express, autenticacion, CRUD de usuarios, scripts de mantenimiento y conexion a MongoDB.
- `react/`: cliente React con login, persistencia de sesion, detalle de usuario y panel admin.

## Variables de entorno

### Backend (`API/.env`)

Usa `API/.env.example` como base.

```env
PORT=8000
URI=mongodb://127.0.0.1:27017/reacthmwk
JWT_SECRET=replace-with-a-secure-secret
PEPPER=replace-with-a-secure-pepper
CLIENT_URL=http://localhost:5173
ROOT_NAME=Admin Principal
ROOT_USERNAME=admin
ROOT_PASSWORD=change-this-password
ROOT_ROLE=admin
```

Notas:

- El backend acepta `JWT_SECRET` como variable principal y `JWT` como fallback.
- `CLIENT_URL` debe apuntar al frontend permitido por CORS.
- `PEPPER` es obligatorio para login, seed y migracion de passwords.

### Frontend (`react/.env`)

Usa `react/.env.example` como base.

```env
VITE_API_URL=http://localhost:8000
```

Importante:

- `VITE_API_URL` no debe terminar con `/`.
- En produccion para Vercel usa `VITE_API_URL=https://reacthmwk-production.up.railway.app`.

## Correr localmente

### 1. Backend

```bash
cd API
npm install
cp .env.example .env
npm run dev
```

Tambien puedes usar:

```bash
npm start
```

### 2. Frontend

```bash
cd react
npm install
cp .env.example .env
npm run dev
```

El frontend local esperado queda en:

- `http://localhost:5173`
- `http://localhost:5174`

Ambos puertos ya estan permitidos por CORS en el backend.

## Usuario admin inicial

Configura estas variables en `API/.env`:

```env
ROOT_NAME=Admin Principal
ROOT_USERNAME=admin
ROOT_PASSWORD=change-this-password
ROOT_ROLE=admin
```

Luego ejecuta:

```bash
cd API
npm run seed:root
```

Ese script crea o actualiza el usuario admin usando variables de entorno, sin credenciales hardcodeadas.

## Seguridad y autenticacion

- El frontend envia `Authorization: Bearer <token>`.
- El backend acepta `Bearer <token>` y tambien token plano como fallback.
- El JWT incluye `id`, `username` y `role`.
- Las rutas sensibles de usuarios (`GET /users`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id`) requieren rol `admin`.
- `GET /users/:id` permite al propio usuario ver su registro y a admin ver cualquier usuario.
- La sesion del frontend se restaura con `localStorage`.

## CRUD de usuarios

El panel admin permite:

- Crear usuarios con `name`, `username`, `password` y `role`.
- Editar `name`, `username`, `role` y opcionalmente `password`.
- Eliminar usuarios.
- Abrir una vista de detalle en `/users/:id`.

## Scripts utiles del backend

Desde `API/`:

```bash
npm run seed:root
npm run migrate:passwords
npm run hash:demo
```

- `seed:root`: crea o actualiza el admin inicial desde variables de entorno.
- `migrate:passwords`: rehace passwords con `salt` + `pepper` y completa roles faltantes.
- `hash:demo`: demo simple del helper de hash.

## Deploy en Railway

Variables recomendadas en Railway:

```env
PORT=8000
URI=<tu-mongodb-uri>
JWT_SECRET=<tu-secret>
PEPPER=<tu-pepper>
CLIENT_URL=https://react-hmwk.vercel.app
ROOT_NAME=Admin Principal
ROOT_USERNAME=<tu-admin>
ROOT_PASSWORD=<tu-password>
ROOT_ROLE=admin
```

Pasos:

1. Sube el proyecto o conecta el repo a Railway.
2. Configura las variables de entorno anteriores.
3. Asegurate de que el servicio apunte a la carpeta `API/`.
4. Haz redeploy del servicio.

## Deploy en Vercel

Variable recomendada en Vercel:

```env
VITE_API_URL=https://reacthmwk-production.up.railway.app
```

Pasos:

1. Conecta el proyecto `react/` a Vercel.
2. Configura `VITE_API_URL` sin slash final.
3. Ejecuta un redeploy del frontend.

## Valores de produccion pedidos

- Railway: `CLIENT_URL=https://react-hmwk.vercel.app`
- Vercel: `VITE_API_URL=https://reacthmwk-production.up.railway.app`

## Verificaciones realizadas

Frontend:

- `npm run lint`
- `npm run build`

Backend:

- Carga de modulos principales con Node para validar imports y rutas.

Si quieres probar el backend completo, levanta MongoDB, configura `API/.env` y luego ejecuta `npm run dev`.
