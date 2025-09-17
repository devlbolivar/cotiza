# AI Cotizador & Propuestas

Genera, envía y rastrea cotizaciones con apoyo de IA para pymes. Este MVP en **Next.js 14 (App Router)** demuestra un flujo completo desde la creación hasta la decisión del cliente y recordatorios automáticos.

## 🚀 Características clave

- **Generación asistida por IA** desde texto o transcripciones de audio.
- **Editor visual** con plantillas por oficio, selección de cliente y totales dinámicos.
- **Envío multicanal**: email (proveedor fake por defecto), enlace público y mensaje sugerido para WhatsApp.
- **Seguimiento y estados** (SENT, VIEWED, APPROVED, REJECTED, CHANGES, EXPIRED).
- **Portal público de decisión** con aceptación de términos, registro de IP y timestamp.
- **Recordatorios automáticos** a las 24 y 72 h (job stub + background sync en el Service Worker).
- **Reportes básicos y embudo** para visualizar desempeño comercial.
- **PWA** con manifest, precache y background sync stub.

## 🧱 Stack

- **Frontend:** Next.js 14 (App Router) + React 18 + TypeScript + TailwindCSS + shadcn/ui primitives.
- **Backend:** Next Route Handlers + Prisma ORM.
- **Base de datos:** SQLite en desarrollo (Postgres-ready mediante variable `DATABASE_PROVIDER`).
- **IA:** SDK oficial de OpenAI.
- **Correo:** Interface `MailProvider` con implementación fake (stdout) y punto de extensión SMTP.
- **Calidad:** ESLint, Prettier y Vitest para utilidades.

## 📦 Estructura destacada

```text
src/
  app/
    app/(dashboard)/*      # Panel interno
    api/*                  # Route handlers (Quotes, IA, envíos, decisiones)
    q/[slug]/page.tsx      # Portal público para clientes
  components/              # UI reutilizable (editor, tablas, acciones)
  lib/                     # Prisma, OpenAI, mail, utils, prompts
  tests/                   # Vitest specs
prisma/                    # Schema y seed demo
public/                    # Assets PWA (manifest, service worker, icons)
```

## ⚙️ Preparación

1. **Instala dependencias**

   ```bash
   npm install
   ```

2. **Configura variables de entorno**

   Copia `.env.example` a `.env` y ajusta según tu entorno. Variables principales:

   - `DATABASE_PROVIDER` (`sqlite` en dev, `postgresql` en producción).
   - `DATABASE_URL`
   - `NEXT_PUBLIC_APP_URL`
   - `OPENAI_API_KEY`
   - `MAIL_PROVIDER` / credenciales SMTP.

3. **Genera el cliente de Prisma y aplica migraciones**

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Seed inicial (owner demo, plantillas y cotización ejemplo)**

   ```bash
   npm run prisma:seed
   ```

## 🧑‍💻 Scripts útiles

```bash
npm run dev         # Arranca Next.js en modo desarrollo
npm run build       # Compila la app para producción
npm run start       # Sirve la build
npm run lint        # ESLint (config Next.js)
npm run typecheck   # Revisión de tipos TS
npm run test        # Vitest (utilidades)
npm run format      # Prettier write
```

## 🔐 Autenticación

El seed crea un único owner demo. El código contiene comentarios `TODO` para integrar un proveedor de auth (Clerk/Auth.js) y soportar multi-tenant en el futuro.

## 🤖 IA & límites

- `src/lib/ai/prompts.ts` centraliza prompts de generación de cotizaciones y mensajes de seguimiento.
- `src/lib/openai.ts` devuelve borradores determinísticos cuando `OPENAI_API_KEY` no está configurada.

## 📬 Email & recordatorios

- `src/lib/mail.ts` define la interfaz `MailProvider`. La implementación `FakeMailProvider` escribe en consola.
- `/api/quotes/[id]/send` programa recordatorios (24h/72h) en la tabla `Reminder` y encola un background sync stub en `public/sw.js`.

## 📊 Reportes

La vista de reportes agrupa cotizaciones por estado, muestra tasa de cierre, ticket promedio y cotizaciones activas.

## 📱 PWA

- Manifest en `public/manifest.json`.
- Service Worker (`public/sw.js`) con precache básico y `background sync` para recordatorios.
- Registro automático del SW en `src/components/ServiceWorkerRegister.tsx`.

## 🧪 Tests

Los utilitarios principales (`src/lib/utils.ts`) cuentan con specs de Vitest (`src/tests/utils.test.ts`). Ejecuta `npm run test`.

## 🗺️ Roadmap sugerido

- Integración real con proveedor de correo (Resend, Postmark, SMTP).
- Agenda de recordatorios con colas/bullmq.
- Soporte de notas de voz → transcripción (Whisper).
- Autenticación multi-tenant y roles (Owner, Seller).
- Exportaciones PDF y firma digital.

---

Hecho con ❤️ para acelerar el flujo comercial de pymes.
