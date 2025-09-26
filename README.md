# Research Journal Management System

A full-stack platform for coordinating manuscript submissions, peer review, and publication workflows. The project contains a React + Vite frontend styled with Tailwind CSS and a Spring Boot backend that exposes secured REST APIs with JWT authentication and MySQL persistence.

## Project layout

```
research-journal-frontend/   # React 18 + Vite + Tailwind client
research-journal-backend/    # Spring Boot 3 REST API server
```

## Prerequisites

- Node.js 18+
- npm 8+
- Java 17+
- Maven 3.9+
- MySQL server with a database named `research_journal`

Update `research-journal-backend/src/main/resources/application.properties` if your MySQL credentials differ from the default `root` / `root`.

## Backend setup

1. Install dependencies and start the API:

```powershell
cd research-journal-backend
mvn spring-boot:run
```

The server listens on `http://localhost:8081`. An administrator account is bootstrapped on first run (email: `admin@journal.com`, password: `password`).

## Frontend setup

1. Install dependencies and launch the web client:

```powershell
cd research-journal-frontend
npm install
npm run dev
```

The frontend is served at `http://localhost:5173` and proxies API calls to the backend on port 8081.

## Default roles & flows

- **Authors** upload PDFs, track statuses, and submit revisions.
- **Editors** assign reviewers, review plagiarism status, and record decisions.
- **Reviewers** complete assigned reviews with structured feedback.
- **Admins** manage the user directory and view platform metrics.

## Running tests

Backend smoke test:

```powershell
cd research-journal-backend
mvn test
```

## Environment variables

- `jwt.secret` and `jwt.expiration` (milliseconds) can be customized in `application.properties`.
- `app.upload-dir` controls where uploaded PDFs are stored on disk. Ensure the directory is writable by the JVM process.

## Next steps

- Integrate an actual plagiarism detection service.
- Add email notifications for status changes.
- Harden the reviewer assignment flow with availability checks.
- Expand unit and integration test coverage across services and controllers.
