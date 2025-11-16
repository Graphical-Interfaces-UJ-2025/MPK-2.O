# Integrated Public Transport Management & Ticketing System

A full-stack monorepo application for managing public transport ticketing system.

## Overview

This project is built as an npm monorepo containing two main applications:
- **Frontend**: Vue.js application for the user interface
- **Backend**: TypeScript Express API with clean architecture

## Project Structure

```
.
├── frontend/          # Vue.js frontend application
├── backend/           # TypeScript Express backend API
└── package.json       # Root workspace configuration
```

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm

## Quick Start

1. Clone the repository
```bash
git clone <repository-url>
cd Integrated-Public-Transport-Management-Ticketing-System
```

2. Install dependencies for all workspaces
```bash
npm install
```

3. Set up the backend (see [backend/README.md](backend/README.md) for detailed instructions)
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
npm run migrate:latest
```

4. Run the applications
```bash
# From root directory
npm run dev              # Run both frontend and backend
npm run dev:frontend     # Run only frontend
npm run dev:backend      # Run only backend
```

## Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs

## Workspace Scripts

- `npm run dev` - Run both frontend and backend
- `npm run build` - Build both applications
- `npm run dev:frontend` - Run only frontend
- `npm run dev:backend` - Run only backend

## Documentation

For detailed documentation on each application:
- [Backend Documentation](backend/README.md) - Architecture, setup, and development guide
- Frontend Documentation - Coming soon

## License

ISC
