# TeamSync Backend

A scalable, high-performance backend API for the TeamSync mobile task management application, built with **NestJS**, **PostgreSQL**, and **TypeORM**.

## Overview

TeamSync is a mobile-first task management application designed for teams to collaborate efficiently. The core philosophy is "Structured Accountability" — enforcing a specific lifecycle for tasks with a strict workflow: `To Do → In Progress → Under Review → Recheck → Done`.

The backend addresses the key problem of **"Status Ambiguity"** by providing real-time status updates and a quality control loop through the "Recheck" workflow.

## Tech Stack

| Technology          | Purpose                                       |
| ------------------- | --------------------------------------------- |
| **NestJS**          | Progressive Node.js framework with TypeScript |
| **PostgreSQL**      | Primary relational database                   |
| **TypeORM**         | ORM for database interactions                 |
| **Passport.js**     | Authentication with JWT strategy              |
| **Socket.io**       | Real-time updates via WebSockets              |
| **class-validator** | DTO validation                                |

## Architecture

The application follows a modular architecture with the following feature modules:

```
src/
├── auth/           # Authentication & JWT management
├── users/          # User profiles & RBAC
├── teams/          # Team/Workspace management
├── projects/       # Project containers
├── tasks/          # Core task logic & status machine
├── comments/       # Task comments & activity
├── attachments/    # File uploads
├── gateway/        # WebSocket real-time events
└── common/         # Shared guards, decorators, DTOs
```

### Module Breakdown

| Module             | Description                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------- |
| **AuthModule**     | Handles registration, login, and JWT token generation using Passport.js                  |
| **UsersModule**    | Profile management, avatar uploads, and role-based access control (Admin, Member, Guest) |
| **TasksModule**    | CRUD operations with status state machine and "Recheck" workflow enforcement             |
| **ProjectsModule** | Project creation, permissions, and progress calculation                                  |
| **GatewayModule**  | Real-time updates via Socket.io for instant team synchronization                         |

## Database Schema

### Entities

| Entity          | Key Columns                                             | Relationships                          |
| --------------- | ------------------------------------------------------- | -------------------------------------- |
| **Users**       | id, email, password_hash, role, avatar_url              | One-to-Many: Tasks, Comments           |
| **Teams**       | id, name, owner_id                                      | One-to-Many: Users, Projects           |
| **Projects**    | id, title, description, team_id, status                 | Many-to-One: Teams, One-to-Many: Tasks |
| **Tasks**       | id, project_id, assignee_id, status, priority, due_date | Many-to-One: Projects, Users           |
| **Comments**    | id, task_id, user_id, content, is_rejection             | Many-to-One: Tasks                     |
| **Attachments** | id, task_id, url, file_type                             | Many-to-One: Tasks                     |

### Task Status Enum

```typescript
enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  UNDER_REVIEW = "UNDER_REVIEW",
  RECHECK = "RECHECK",
  DONE = "DONE",
}
```

## User Roles

| Role               | Permissions                                                                      |
| ------------------ | -------------------------------------------------------------------------------- |
| **Admin (Owner)**  | Create workspace, invite/remove members, view all projects, approve/reject tasks |
| **Member**         | Create/update tasks, change status, upload attachments, post comments            |
| **Guest (Viewer)** | Read-only access to specific projects                                            |

## Key Features

### The "Recheck" Workflow

The unique selling point of TeamSync — a formalized quality control loop:

1. **Member** completes work → Status: `UNDER_REVIEW`
2. **Admin** reviews and finds issues → Status: `RECHECK`
3. **Mandatory Comment**: When setting `RECHECK`, a rejection comment is required
4. **Push Notification**: Member receives high-priority alert with rejection reason
5. **Member** fixes issues and resubmits → Status: `UNDER_REVIEW`
6. **Admin** approves → Status: `DONE`

### Real-Time Synchronization

Using NestJS Gateways (Socket.io), when any team member updates a task status, all other connected clients receive instant updates without page refresh.

### Security

- **JWT Authentication**: Stateless, secure token-based auth
- **RBAC Guards**: Custom `@Roles()` decorators to protect endpoints
- **Input Validation**: DTO validation using `class-validator`
- **Password Hashing**: Bcrypt with salt rounds ≥ 10
- **HTTPS**: TLS 1.2+ for all traffic

## API Structure

```
POST   /auth/register        # User registration
POST   /auth/login           # Login & token generation
GET    /users/me             # Get current user profile
PATCH  /users/me             # Update profile

GET    /teams                # List user's teams
POST   /teams                # Create team
POST   /teams/:id/invite     # Invite member

GET    /projects             # List projects
POST   /projects             # Create project
GET    /projects/:id         # Get project details

GET    /tasks                # List tasks (filterable)
POST   /tasks                # Create task
GET    /tasks/:id            # Get task details
PATCH  /tasks/:id            # Update task
PATCH  /tasks/:id/status     # Change task status

POST   /tasks/:id/comments   # Add comment
POST   /tasks/:id/attachments # Upload attachment
```

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd be-team-sync

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev
```

### Environment Variables

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=teamsync

JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=7d

PORT=3000
```

## Development

```bash
# Development mode with hot reload
npm run start:dev

# Production build
npm run build

# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Database migrations
npm run migration:generate -- -n MigrationName
npm run migration:run
```

## Non-Functional Requirements

| Requirement             | Target                                           |
| ----------------------- | ------------------------------------------------ |
| **Response Time**       | < 200ms for standard API calls                   |
| **Concurrent Users**    | Support 1000+ simultaneous WebSocket connections |
| **Data Integrity**      | Strict enum enforcement, foreign key constraints |
| **Conflict Resolution** | Last Write Wins with client notification         |

## License

MIT

---

**TeamSync** — Structured Accountability for Teams
