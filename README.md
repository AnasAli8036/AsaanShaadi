# Asaan Shaadi - Wedding Platform

A comprehensive monolithic platform for booking wedding venues, caterers, and related services.

## Project Structure

```
AsaanShaadi/
├── frontend/          # Next.js frontend application
├── backend/           # Node.js backend API
├── shared/           # Shared types and utilities
├── docs/             # Documentation
└── docker-compose.yml # Development environment
```

## Tech Stack

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- React Hook Form
- Zustand (State Management)

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication

### Integrations
- Google Maps API
- Google Calendar API / Calendly
- Stripe Payments
- Brevo SMTP

## Getting Started

1. Clone the repository
2. Install dependencies: `npm run install:all`
3. Set up environment variables
4. Run development servers: `npm run dev`

## Features

- Venue/Hall booking with availability checking
- Caterer services and packages
- Advanced search and filtering
- User profiles and booking history
- Admin dashboard
- Payment integration
- Email notifications
- Booking conflict resolution
