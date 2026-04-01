# Construction EDMS

> Electronic Document Management System for Construction Projects

A modern EDMS platform built with Next.js 16, React 19, and TypeScript for managing construction project documentation, workflows, and transmittals.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Features

- 📁 Document Management & Version Control
- 🔄 Workflow & Approval System
- 📮 Transmittal Management
- 👥 Role-Based Access Control
- 🎨 Theme Customization
- 🔐 OAuth Authentication (Google, GitHub)

## Tech Stack

- Next.js 16.2.1 with App Router
- React 19 & TypeScript
- PostgreSQL with Drizzle ORM
- Better Auth for authentication
- shadcn/ui components
- Tailwind CSS

## Documentation

See the `hex/` folder for detailed documentation:
- `hex/AGENTS.md` - AI agent collaboration guide
- `hex/GOAL.md` - Project requirements
- `hex/TODO.md` - Development roadmap
- `hex/CHANGELOG.md` - Version history

## License

MIT
