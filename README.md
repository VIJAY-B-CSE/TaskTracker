# Task Tracker

Task Tracker is a lightweight, full-stack task management application designed to help users organize their workflow. Users can create projects and assign tasks with due dates, priority tiers, and statuses. 

This project is built using a modern decoupled architecture: a **Spring Boot** REST API backend, a **React (Vite)** single-page application frontend, and a **MySQL** relational database. The application follows a RESTful architecture where the React frontend communicates with the Spring Boot backend through HTTP APIs.

---

## Features

- **Project Management (CRUD)**: Create, view, update, and delete projects.
- **Task Management (CRUD)**: Create, view, update, and delete tasks.
- **Project-Task Association**: Relational mapping where tasks belong to a specific project.
- **Filtering**: Server-side filtering of tasks by **Status** (`TODO`, `DOING`, `DONE`) and **Priority** (`LOW`, `MEDIUM`, `HIGH`).
- **Sorting**: Server-side sorting of tasks by **Due Date** in ascending or descending order.
- **Pagination**: Efficient loading of tasks (5 per page) with page controls to prevent loading unnecessary data.
- **Server-Side Validation**: Dynamic check rules (e.g. `@NotBlank` title, `@NotNull` due date) returning structured errors.
- **Global Exception Handling**: Returns clean, consistent JSON error responses for `400 Bad Request`, `404 Not Found`, and `500 Internal Server Error`.
- **Backend Integration Tests (CRUD and Validation)**: Automated `MockMvc` integration tests verifying REST endpoints and validation logic.
- **Database Schema**: Pre-written SQL file matching the database entity definitions.

---

## Technology Stack

### Backend
- **Java** (version 21+)
- **Spring Boot** (version 4.1.x)
- **Spring Data JPA** & **Hibernate** (ORM)
- **JUnit 5** & **MockMvc** (Integration Testing)
- **Jackson** (JSON Serialization/Deserialization)

### Frontend
- **React** (version 19.x)
- **Vite** (build tool)
- **Bootstrap** (styling & responsive design)
- **Axios** (API requests)
- **React Router DOM** (navigation)

### Database
- **MySQL** (version 8.x)

---

## Project Folder Structure

```text
TaskTracker/
│
├── backend/tasktracker/
│   ├── schema.sql                         # SQL database definition
│   └── tasktracker/                       # Maven backend project
│       ├── pom.xml                        # Maven dependencies
│       └── src/
│           ├── main/java/com/vijay/tasktracker/
│           │   ├── controller/            # REST API endpoints
│           │   ├── entity/                # Hibernate JPA database models
│           │   ├── exception/             # Custom exceptions & global handler
│           │   ├── repository/            # Database access queries
│           │   └── service/               # Core business logic
│           └── test/                      # JUnit integration test cases
│
├── frontend/                              # Vite React project
│   ├── package.json                       # npm configurations
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── components/common/             # Shared UI components (Navbar)
│       ├── pages/                         # Page layouts (Home, Projects, Tasks)
│       ├── services/                      # Axios HTTP instance (api.js)
│       ├── styles/                        # Custom CSS files
│       ├── main.jsx                       # React render target
│       └── App.jsx                        # Route configuration
```

---

## Database Setup

This project uses **MySQL** with **Hibernate (JPA)**.

The application is configured to automatically create and update the required tables using:

```properties
spring.jpa.hibernate.ddl-auto=update
```

### 1. Make sure MySQL Server is running.

### 2. Create the database (only once).

```sql
CREATE DATABASE IF NOT EXISTS tasktracker_db;
```

### 3. Update the database credentials in:

`backend/tasktracker/tasktracker/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/tasktracker_db?createDatabaseIfNotExist=true
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.hibernate.ddl-auto=update
```

### 4. Start the Spring Boot application.

Hibernate will automatically create or update all required tables based on the entity classes.

> **Note:** A `schema.sql` file is also included in the project to provide the database schema for reference.

---

## Backend Setup

1. Navigate to the Maven project folder:
   ```bash
   cd backend/tasktracker/tasktracker
   ```
2. Run the integration tests to verify compile settings and database endpoints:
   ```bash
   # Windows
   mvnw clean test

   # Linux/macOS
   ./mvnw clean test
   ```
3. Run the Spring Boot application:
   ```bash
   # Windows
   mvnw spring-boot:run

   # Linux/macOS
   ./mvnw spring-boot:run
   ```
   The backend server will start running on `http://localhost:8080`.

---

## Frontend Setup

> **Note:** Make sure the backend is running before starting the frontend.

1. Navigate to the React project folder:
   ```bash
   cd frontend
   ```
2. Install the required Node dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## API Endpoints

### Projects API
| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/projects` | Fetch all projects |
| `GET` | `/api/projects/{id}` | Fetch a specific project by ID |
| `POST` | `/api/projects` | Create a new project |
| `PUT` | `/api/projects/{id}` | Update project details |
| `DELETE` | `/api/projects/{id}` | Delete a project |

### Tasks API
| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | Fetch tasks (Supports pagination, status/priority filtering, and due date sorting) |
| `GET` | `/api/tasks/{id}` | Fetch a specific task by ID |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/{id}` | Update task details / status |
| `DELETE` | `/api/tasks/{id}` | Delete a task |

---

## Design Decisions

- **Spring Boot + React:** Used a separate backend and frontend to follow a clean client-server architecture.
- **Spring Data JPA:** Simplified database operations and reduced boilerplate code.
- **MySQL:** Used a relational database to model the relationship between Projects and Tasks.
- **Server-side Validation:** Implemented validation in the backend to ensure data integrity.
- **Global Exception Handling:** Returned consistent HTTP error responses and displayed them in the frontend.
- **Pagination & Filtering:** Implemented on the backend to improve performance and reduce unnecessary data transfer.

---

## Future Improvements

- Add user authentication using Spring Security and JWT.
- Add search functionality for tasks and projects.
- Allow file attachments for tasks.
- Deploy the application using Docker and a cloud platform.
- Improve the UI with dark mode and responsive enhancements.

---

## AI Usage Declaration

AI assistants were used to support development and learning during this project.

- **Google Antigravity** – Assisted with frontend and React component generation and implementation.
- **ChatGPT** – documentation, debugging, and general development support.

All AI-generated suggestions were reviewed, tested, and integrated into the project by the author.

---

## Author

Developed by **Vijay B**
