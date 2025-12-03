# Project Documentation

This project is a monorepo managed by [Turborepo](https://turbo.build/repo). It contains the backend API and frontend Web application.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v20 or later recommended)
- [pnpm](https://pnpm.io/) (Package Manager)
- [Docker](https://www.docker.com/) (for Database)

## Installation

Install dependencies from the root directory:

```bash
pnpm install
```

## Environment Setup

Copy the example environment files to create your local configuration:

1. **Root**:
   ```bash
   cp .env.example .env
   ```
2. **API**:
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```
3. **Web**:
   ```bash
   cp apps/web/.env.example apps/web/.env
   ```

> **Note**: Adjust the values in `.env` files if necessary, but the defaults should work for local development.

## Database Setup

1. **Start the Database**:
   Run the PostgreSQL container using Docker Compose:

   ```bash
   docker compose up -d
   ```

2. **Migrate and Seed**:
   Apply database migrations and seed initial data:

   ```bash
   # Run migrations
   pnpm --filter api prisma:migrate

   # Seed data (Cities and Admin)
   pnpm --filter api seed:cities
   pnpm --filter api seed:admin
   ```

## Running Development

To start the development server for all applications (API and Web):

```bash
pnpm dev
```

- **API**: [http://localhost:8080](http://localhost:8080)
- **Web**: [http://localhost:3000](http://localhost:3000)

## Project Structure

- **`apps/api`**: Backend application built with Express and Prisma.
- **`apps/web`**: Frontend application built with Next.js.
