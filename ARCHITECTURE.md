# Architecture Overview

## System summary

AI Audit System is designed as a lean audit platform for AI spend analysis. It couples a React frontend with an Express backend and a MongoDB persistence layer. The architecture supports fast audit generation, lead capture, shareable public reporting, and email confirmation.

## Component breakdown

### Frontend

- `client/src/App.jsx`: application routes and audit lifecycle management
- `client/src/components/AuditForm.jsx`: collects customer inputs, AI tools, plan selections, and team details
- `client/src/components/ResultsPage.jsx`: renders audit insights, PDF export, and lead capture
- `client/src/components/PublicResults.jsx`: delivers public report rendering with SEO metadata
- `react-helmet-async`: manages dynamic page metadata for social previews and SEO

### Backend

- `server/index.js`: Express entry point, routes registration, and MongoDB connection
- `server/routes/auditRoutes.js`: audit persistence and public audit retrieval
- `server/routes/leadRoutes.js`: lead collection, validation, honeypot anti-spam, and email trigger
- `server/utils/auditEngine.js`: core savings and plan recommendation engine
- `server/utils/emailService.js`: Nodemailer transactional email service
- `server/models/Lead.js`: lead persistence schema
- `server/models/Audit.js`: audit persistence schema

## Data flow

1. User submits audit inputs via the frontend form.
2. The client sends the tool usage payload to the backend audit analysis endpoint.
3. The backend runs `analyzeAudit`, returns results, and saves audit data for sharing.
4. The user may capture a lead after viewing the results.
5. Lead submission is persisted and triggers a confirmation email asynchronously.
6. Public reports are available via a shareable `/results/:id` route.

## Architectural principles

- Keep business logic server-side for consistent audit recommendations
- Preserve frontend rendering while offloading analysis to API endpoints
- Use shareable IDs and public routes for report viewing without exposing internal workflows
- Make transactional email a non-blocking enhancement so lead capture remains reliable

## Deployment notes

- Frontend and backend can deploy independently or behind a reverse proxy
- MongoDB connection is configured through environment variables
- Email credentials are securely layered through `SMTP_*` environment settings
- CI validates backend tests and lint rules before merging changes
