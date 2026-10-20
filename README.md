# Fintech Core — Frontend

Aplicación web frontend del proyecto académico Fintech Core, construida con React, TypeScript y Vite. Este repositorio es un fork de [cesar-devsenior/CleanArchitecture-G1-fintech-core-front](https://github.com/cesar-devsenior/CleanArchitecture-G1-fintech-core-front).

La versión integrada con backend, PostgreSQL y Docker Compose está en [CleanArchitecture-G1-fintech-core-app](https://github.com/klion534/CleanArchitecture-G1-fintech-core-app). Este repositorio separado conserva el frontend como proyecto independiente; consulte su historial para distinguir los cambios de este fork del código original.

## Tecnologías

- React 18 y TypeScript
- Vite
- React Router
- Axios y Zod
- Vitest y Testing Library
- Nginx y Docker para servir el build

## Requisitos

- Node.js y pnpm.
- La API configurada para el entorno local.

## Instalación y desarrollo

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Configure `VITE_API_URL` en `.env` para apuntar a la API que desea utilizar. No agregue credenciales ni secretos al repositorio.

## Validación

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Estado

Proyecto académico/de aprendizaje. Para levantar el sistema completo y consultar los pasos de ejecución integrada, use el repositorio full stack enlazado arriba.
