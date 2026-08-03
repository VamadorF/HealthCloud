# HealthCloud

Plataforma integral de gestión de servicios de salud que conecta **organizaciones médicas**, **especialistas** y **pacientes** bajo un entorno administrado centralmente.

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend / Backend | Next.js 15, TypeScript, Tailwind CSS |
| Base de datos | PostgreSQL + Prisma ORM |
| Autenticación | Supabase Auth |
| Storage | Supabase Storage (avatares privados) |
| Emails | Resend |
| Monitoreo | Sentry |
| Despliegue | Render |

## Roles de la plataforma

| Rol | Acceso | Ruta base |
|-----|--------|-----------|
| Administrador | Invitar/bloquear organizaciones, reportes de uso | `/admin` |
| Organización | Perfil corporativo, gestión de especialistas | `/organization` |
| Especialista | Agenda, consultas clínicas, pacientes | `/specialist` |
| Paciente | Solicitar horas, registrar síntomas, historial | `/patient` |

Tras iniciar sesión, `/dashboard` redirige automáticamente al panel según el rol del usuario.

---

## Explorar la interfaz (sin configurar nada)

Puedes ver la plataforma completa sin Supabase ni base de datos:

```bash
npm install
npm run dev
```

Abre **http://localhost:3000** y usa **Explorar plataforma**, o entra directo a cada rol:

| Rol | URL |
|-----|-----|
| Administrador | http://localhost:3000/demo/admin |
| Organización | http://localhost:3000/demo/organization |
| Especialista | http://localhost:3000/demo/specialist |
| Paciente | http://localhost:3000/demo/patient |

Las rutas `/demo/*` son interfaces estáticas con datos realistas. Las rutas `/admin`, `/organization`, etc. requieren autenticación y Prisma.

---



### URLs que funcionan sin configuración

| Página | URL en producción |
|--------|-------------------|
| Landing | `https://tu-proyecto.vercel.app/` |
| Admin | `https://tu-proyecto.vercel.app/demo/admin` |
| Organización | `https://tu-proyecto.vercel.app/demo/organization` |
| Especialista | `https://tu-proyecto.vercel.app/demo/specialist` |
| Paciente | `https://tu-proyecto.vercel.app/demo/patient` |

### Variables opcionales

Solo necesarias si más adelante activas login y rutas reales (`/admin`, `/patient`, etc.):

| Variable | Cuándo |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Auth |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth |
| `DATABASE_URL` | Prisma / rutas reales |
| `NEXT_PUBLIC_APP_URL` | URL de producción (ej. `https://tu-proyecto.vercel.app`) |

Sin estas variables, las rutas protegidas redirigen al inicio (`/`) en lugar de fallar.

---

## Requisitos previos

- **Node.js 18+** y **npm**
- Cuenta en [Supabase](https://supabase.com/) (Auth + Storage)
- Base de datos **PostgreSQL** (puede ser la de Supabase o la de Render)
- *(Opcional para desarrollo)* Cuentas en Sentry y Resend

---

## Ejecución local — paso a paso

### 1. Clonar e instalar

```bash
git clone https://github.com/VamadorF/HealthCloud.git
cd HealthCloud
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores:

```env
# ─── OBLIGATORIAS para que la app funcione ───

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...tu-anon-key

# PostgreSQL (Prisma)
DATABASE_URL=postgresql://usuario:password@host:5432/healthcloud

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ─── OPCIONALES (la app arranca sin estas) ───

SUPABASE_SERVICE_ROLE_KEY=eyJ...tu-service-role-key
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@tudominio.com
```

**¿Dónde obtener `DATABASE_URL`?**

- **Supabase:** Settings → Database → Connection string (URI, modo *Session*)
- **Render:** se crea automáticamente al usar `render.yaml` (ver sección Despliegue)

### 3. Configurar Supabase

#### a) Crear proyecto

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Copia **Project URL** y **anon key** a `.env.local`

#### b) Ejecutar migración SQL (perfiles + storage)

En **SQL Editor** de Supabase, ejecuta el contenido completo de:

```
supabase/migrations/001_initial_schema.sql
```

Esto crea la tabla `profiles`, políticas RLS y el bucket privado `avatars`.

#### c) Configurar URLs de autenticación

En **Authentication → URL Configuration**:

| Campo | Valor (desarrollo) |
|-------|-------------------|
| Site URL | `http://localhost:3000` |
| Redirect URLs | `http://localhost:3000/auth/callback` |

### 4. Crear tablas de Prisma

```bash
npm run db:push
```

Esto sincroniza el esquema de `prisma/schema.prisma` con tu PostgreSQL (usuarios, organizaciones, citas, consultas, etc.).

### 5. Cargar datos de demostración *(opcional)*

```bash
npm run db:seed
```

Crea usuarios demo en la base de datos Prisma:

| Email | Rol |
|-------|-----|
| `admin@healthcloud.demo` | Administrador |
| `org@healthcloud.demo` | Organización |
| `especialista@healthcloud.demo` | Especialista |
| `paciente@healthcloud.demo` | Paciente |

> **Importante:** para iniciar sesión con estos usuarios también debes crearlos en **Supabase → Authentication → Users** con el mismo email y contraseña. Al hacer login, Prisma los vincula automáticamente.

### 6. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre **http://localhost:3000**

### 7. Probar la aplicación

1. Ve a **http://localhost:3000/signup** y crea una cuenta *(rol Paciente por defecto)*
2. Confirma el email si tienes confirmaciones habilitadas en Supabase
3. Inicia sesión en **http://localhost:3000/login**
4. Serás redirigido a `/dashboard` → `/patient` (u otro panel según tu rol)
5. Explora los módulos desde la barra de navegación superior

**Flujo rápido con usuarios demo:**

```text
1. Crear usuarios en Supabase Auth con los emails del seed
2. npm run db:seed
3. npm run dev
4. Login → cada rol ve solo sus módulos
```

---

## Scripts disponibles

```bash
npm run dev          # Servidor de desarrollo (puerto 3000)
npm run build        # Compilar para producción
npm run start        # Servidor de producción
npm run lint         # ESLint
npm run type-check   # Verificar tipos TypeScript

npm run db:push      # Sincronizar esquema Prisma → PostgreSQL
npm run db:seed      # Cargar datos demo
npm run db:migrate   # Crear migración Prisma (desarrollo)
npm run db:studio    # Abrir Prisma Studio (explorar BD)
```

---

## Verificar que todo funciona

```bash
# 1. Tipos correctos
npm run type-check

# 2. Build de producción
npm run build

# 3. Health check (con el servidor corriendo)
curl http://localhost:3000/api/health
```

Respuesta esperada del health check:

```json
{ "status": "ok", "timestamp": "...", "environment": "development" }
```

---

## Despliegue en Render

El proyecto incluye `render.yaml` para desplegar automáticamente:

1. Conecta el repositorio en [render.com](https://render.com)
2. Render crea un **Web Service** y una base **PostgreSQL**
3. En el dashboard de Render, agrega las variables de Supabase:

   | Variable | Requerida |
   |----------|-----------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Sí |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sí |
   | `DATABASE_URL` | Auto (desde Render DB) |
   | `NEXT_PUBLIC_APP_URL` | Sí (URL de Render) |
   | `RESEND_API_KEY` | No |
   | `NEXT_PUBLIC_SENTRY_DSN` | No |

4. Tras el primer deploy, abre la **Shell** de Render y ejecuta:

   ```bash
   npx prisma db push
   npm run db:seed
   ```

5. En Supabase, agrega la URL de Render en **Redirect URLs**:

   ```
   https://tu-app.onrender.com/auth/callback
   ```

---

## Estructura del proyecto

```text
healthcloud/
├── prisma/
│   ├── schema.prisma       # Modelos: User, Organization, Appointment, etc.
│   └── seed.ts             # Datos demo por rol
├── src/
│   ├── app/
│   │   ├── admin/          # Panel Administrador
│   │   ├── organization/   # Panel Organización
│   │   ├── specialist/     # Panel Especialista
│   │   ├── patient/        # Panel Paciente
│   │   ├── auth/           # Callback OAuth, logout
│   │   ├── login/          # Inicio de sesión
│   │   ├── signup/         # Registro
│   │   └── profile/        # Perfil y avatar
│   ├── components/
│   │   ├── auth/           # Formularios de autenticación
│   │   └── platform/       # Navegación y layout por rol
│   └── lib/
│       ├── auth/           # Roles, permisos, sesión
│       ├── prisma.ts       # Cliente Prisma
│       └── supabase/       # Cliente Supabase
├── supabase/migrations/    # SQL para perfiles y storage
└── render.yaml             # Blueprint de despliegue
```

---

## Solución de problemas

### `Invalid API key` al iniciar sesión

- Verifica que `NEXT_PUBLIC_SUPABASE_URL` incluya `https://`
- Copia la **anon key** completa sin espacios

### Error de conexión a base de datos

- Confirma que `DATABASE_URL` es correcta
- En Supabase, usa la connection string en modo **Session** (no Transaction para Prisma)
- Ejecuta `npm run db:push` para crear las tablas

### Login funciona pero redirige mal / panel vacío

- El usuario debe existir en Prisma. Al hacer login se crea automáticamente con rol `PATIENT`
- Para roles Admin/Org/Especialista, usa el seed o actualiza el campo `role` en la tabla `users`

### `npm run build` falla

- Asegúrate de tener `DATABASE_URL` definida (aunque sea una URL válida)
- Ejecuta `npx prisma generate` antes del build

### Puerto 3000 ocupado

```bash
PORT=3001 npm run dev
```

---

## Historial de cambios

Ver [CHANGELOG.md](./CHANGELOG.md).

---

## Recursos

- [Next.js](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [Supabase](https://supabase.com/docs)
- [Render](https://render.com/docs)

---

Desarrollado con Next.js, TypeScript y Prisma.
