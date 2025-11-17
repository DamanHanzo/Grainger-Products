# Product Management System

A full-stack application for managing products, built with Spring Boot, PostgreSQL, and React.

## Tech Stack

### Backend
- **Java 17** with **Spring Boot 3.2**
- **PostgreSQL 16** for data persistence
- **Flyway** for database migrations
- **Spring Data JPA** for data access
- **Swagger/OpenAPI** for API documentation
- **JUnit 5** and **MockMvc** for testing
- **Gradle** for build management

### Frontend
- **React 18** with hooks
- **Vite** for fast development and building
- **Axios** for HTTP requests
- **Vitest** and **React Testing Library** for testing

## Prerequisites

- **Java 17+** (verify with `java -version`)
- **Node.js 18+** and npm (verify with `node -v`)
- **Docker** and **Docker Compose** (for PostgreSQL)
- **Git**

## Project Structure

```
.
├── backend/                 # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/grainger/products/
│   │   │   │   ├── controller/      # REST controllers
│   │   │   │   ├── service/         # Business logic
│   │   │   │   ├── repository/      # Data access layer
│   │   │   │   └── model/           # JPA entities
│   │   │   └── resources/
│   │   │       ├── application.yml  # Configuration
│   │   │       └── db/migration/    # Flyway migrations
│   │   └── test/                    # Unit and integration tests
│   ├── build.gradle                 # Gradle dependencies
│   └── gradlew                      # Gradle wrapper
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API service layer
│   │   └── test/            # Test setup
│   ├── package.json         # npm dependencies
│   └── vite.config.js       # Vite configuration
└── docker-compose.yml       # PostgreSQL container setup
```

## Getting Started

### 1. Start PostgreSQL Database

```bash
# Start the database container
docker-compose up -d

# Verify it's running
docker ps

# View logs (optional)
docker-compose logs -f postgres
```

The database will be available at `localhost:5432` with credentials:
- Database: `products_db`
- Username: `postgres`
- Password: `postgres`

### 2. Start Backend (Spring Boot)

```bash
cd backend

# Install dependencies and run tests
./gradlew test

# Start the application
./gradlew bootRun
```

The backend will start at `http://localhost:8080`

**API Documentation** (Swagger UI): `http://localhost:8080/swagger-ui.html`

### 3. Start Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Run tests
npm test

# Start development server
npm run dev
```

The frontend will start at `http://localhost:3000`

## Development Workflow

### Backend Development

**Run tests:**
```bash
cd backend
./gradlew test
```

**Run with test coverage:**
```bash
./gradlew test jacocoTestReport
```

**Build JAR:**
```bash
./gradlew build
```

### Frontend Development

**Run tests:**
```bash
cd frontend
npm test
```

**Run tests with UI:**
```bash
npm run test:ui
```

**Run with coverage:**
```bash
npm run test:coverage
```

**Build for production:**
```bash
npm run build
```

## Troubleshooting

**Database connection issues:**
```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart the database
docker-compose restart postgres
```

**Port already in use:**
```bash
# Backend (8080)
lsof -ti:8080 | xargs kill -9

# Frontend (3000)
lsof -ti:3000 | xargs kill -9
```

**Clean build:**
```bash
# Backend
cd backend && ./gradlew clean build

# Frontend
cd frontend && rm -rf node_modules && npm install
```
