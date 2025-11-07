# Research Journal Management System

A full-stack platform for coordinating manuscript submissions, peer review, and publication workflows. The project contains a React + Vite frontend styled with Tailwind CSS and a Spring Boot backend that exposes secured REST APIs with JWT authentication and MySQL persistence.

## Project layout

```
research-journal-frontend/   # React 18 + Vite + Tailwind client
research-journal-backend/    # Spring Boot 3 REST API server
docker-compose.yml           # Docker orchestration for all services
```

## Running with Docker (Recommended)

The easiest way to run the entire application stack is using Docker Compose:

```bash
# Optional: Copy .env.example to .env and customize the values
cp .env.example .env

# Start all services
docker-compose up
```

This will start:
- **MySQL** database on port 3306
- **Backend** API server on port 8081
- **Frontend** web application on port 80

To stop all services:
```bash
docker-compose down
```

To rebuild containers after code changes:
```bash
docker-compose up --build
```

**Note**: For production deployments, make sure to set strong passwords and JWT secrets in your `.env` file.

### Using Pre-built Container Images from GitHub Container Registry

You can also use the pre-built images from GitHub Container Registry:

```bash
# Pull the latest images
docker pull ghcr.io/datta30/researchjournal/backend:latest
docker pull ghcr.io/datta30/researchjournal/frontend:latest
docker pull ghcr.io/datta30/researchjournal/mysql:latest

# Run the containers (make sure to configure environment variables appropriately)
```

## Prerequisites for Local Development

- Node.js 20+
- npm 8+
- Java 21+
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
- For Docker deployments, see `docker-compose.yml` for environment variable configuration.

## CI/CD

The repository includes GitHub Actions workflows:
- **CI Workflow**: Runs tests for both frontend and backend on pull requests
- **Build and Push Containers**: Builds and pushes Docker images to GitHub Container Registry on push to main

## Next steps

- Integrate an actual plagiarism detection service.
- Add email notifications for status changes.
- Harden the reviewer assignment flow with availability checks.
- Expand unit and integration test coverage across services and controllers.
