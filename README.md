# 💪 FitNexus — Fitness Tracker

> A full-stack gym management and personal fitness tracking platform built with **Spring Boot** + **React (Vite)** + **Neon PostgreSQL**.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [API Reference](#-api-reference)
- [Role System](#-role-system)
- [Database](#-database)
- [Running the App](#-running-the-app)
- [Screenshots](#-screenshots)

---

## 🌟 Overview

**FitNexus** is a premium gym management web application that allows:

- **Admins** to manage members, trainers, roles, and view system-wide stats
- **Trainers** to log workouts and monitor member health metrics
- **Members (Users)** to track their workouts, meals, calorie goals, and BMI

The app uses **OTP-based login** for users/trainers and **direct login** for admins, ensuring secure multi-role access.

---

## ✅ Features

### 🔐 Authentication
- OTP-based email verification login for Users & Trainers
- Direct admin login (no OTP)
- Forgot password with reset code via email
- JWT-less session via `localStorage`

### 👥 Member Management (Admin)
- Register new members with **role assignment** (User / Trainer) at creation time
- Edit member profiles (name, email, weight, height, age)
- Change member roles inline from the Members table
- Delete members (cascades workouts, meals, goals)

### 🏋️ Workout Tracking
- Log exercises with type, duration, and calories burned
- Filter by logged-in user
- Admin/Trainer can view all members' workouts

### 🍽️ Meal / Nutrition Logging
- Log meals with name, calories, and date
- Daily calorie intake tracking vs. goal

### 🎯 Goal Management
- Set target weight and calorie goals
- Visual BMI and calorie progress cards on dashboard

### 📊 Dashboard
- **Admin/Trainer View** — member directory with BMI, status, stats overview
- **User View** — personal metric cards (Exercise, Nutrition, Goal Weight, BMI), calorie bar chart, recent activity, gym branch info
- Dynamic trainer cards fetched from DB (only ROLE_TRAINER users, max 3)

### 🌐 Public Landing Page
- Hero section with CTA
- Program showcase
- Weekly class schedule
- **Expert Trainers** — fetched live from database
- Registration form

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Backend** | Spring Boot 3.1, Spring Data JPA, Spring Security |
| **Database** | Neon.tech PostgreSQL (cloud-hosted) |
| **ORM** | Hibernate (ddl-auto: update) |
| **API Docs** | SpringDoc OpenAPI (Swagger UI) |
| **Build Tools** | Maven (backend), npm (frontend) |
| **Runner** | `concurrently` via root `package.json` |

---

## 📁 Project Structure

```
FitNexus/
├── fitnesstracker/               # Spring Boot Backend
│   ├── src/main/java/com/fitness/tracker/
│   │   ├── controller/           # REST Controllers
│   │   │   ├── UserController.java
│   │   │   ├── WorkoutController.java
│   │   │   ├── MealController.java
│   │   │   ├── GoalController.java
│   │   │   └── RoleController.java
│   │   ├── model/                # JPA Entities
│   │   │   ├── User.java
│   │   │   ├── Workout.java
│   │   │   ├── Meal.java
│   │   │   ├── Goal.java
│   │   │   └── Role.java
│   │   ├── repository/           # Spring Data Repositories
│   │   ├── service/              # Business Logic
│   │   │   ├── UserService.java
│   │   │   ├── RoleService.java
│   │   │   └── DatabaseSeeder.java
│   │   └── security/             # Spring Security Config
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/                     # React + Vite Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx       # Public landing page
│   │   │   ├── Login.jsx         # Login / OTP / Forgot Password
│   │   │   ├── Dashboard.jsx     # Role-based dashboard
│   │   │   ├── Users.jsx         # Member management (Admin)
│   │   │   ├── Workouts.jsx      # Workout logging
│   │   │   ├── Meals.jsx         # Meal logging
│   │   │   ├── Goals.jsx         # Goals management
│   │   │   └── Roles.jsx         # Role audit view
│   │   ├── components/
│   │   │   ├── UserForm.jsx      # Create/Edit member + Role picker
│   │   │   ├── WorkoutForm.jsx
│   │   │   ├── MealForm.jsx
│   │   │   ├── GoalForm.jsx
│   │   │   ├── RoleForm.jsx
│   │   │   └── Modal.jsx
│   │   ├── api.js                # Axios API layer
│   │   ├── App.jsx               # Router + Nav + Layout
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   └── vite.config.js
│
├── .maven/                       # Bundled Maven (no install needed)
├── .gitignore
├── package.json                  # Root runner (concurrently)
├── run.bat                       # Windows one-click start script
└── README.md
```

---

## 📦 Prerequisites

| Tool | Version | Notes |
|---|---|---|
| **Java JDK** | 17+ | Required for Spring Boot |
| **Node.js** | 18+ | Required for React/Vite |
| **npm** | 9+ | Comes with Node.js |
| **Maven** | 3.9+ | Must be installed separately — [Download here](https://maven.apache.org/download.cgi) |

> ⚠️ **Note:** The `.maven/` folder is excluded from Git. Install Maven on your machine and ensure `mvn` is on your system PATH before running the backend.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/FitNexus.git
cd FitNexus
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

### 3. Install root concurrently runner

```bash
npm install
```

### 4. Configure the database (see below)

### 5. Start both servers

```bash
# Option A: Windows one-click
run.bat

# Option B: npm scripts
npm run start
```

---

## ⚙️ Environment Configuration

### Backend — `fitnesstracker/src/main/resources/application.properties`

```properties
# Neon PostgreSQL Connection
spring.datasource.url=jdbc:postgresql://<your-neon-host>/neondb?sslmode=require&channelBinding=require
spring.datasource.username=<your-username>
spring.datasource.password=<your-password>
spring.datasource.driverClassName=org.postgresql.Driver

# Hibernate
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# Swagger UI
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.enabled=true
```

> ⚠️ **Never commit real credentials.** Use environment variables or a `.env` file excluded by `.gitignore`.

### Frontend — `frontend/src/api.js`

```js
const API_BASE_URL = 'http://localhost:8080/api'
```

Change this to your deployed backend URL for production.

---

## 📡 API Reference

Base URL: `http://localhost:8080/api`

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | Get all users |
| POST | `/users` | Create a new user |
| PUT | `/users/{id}` | Update user profile |
| DELETE | `/users/{id}` | Delete user |
| POST | `/users/login/otp-send` | Send OTP for login |
| POST | `/users/login/otp-verify` | Verify OTP and login |
| POST | `/users/login/admin` | Admin direct login |
| POST | `/users/forgot-password/request` | Request reset code |
| POST | `/users/forgot-password/reset` | Reset password |

### Workouts
| Method | Endpoint | Description |
|---|---|---|
| GET | `/workouts` | Get all workouts |
| POST | `/workouts` | Log a workout |
| PUT | `/workouts/{id}` | Update workout |
| DELETE | `/workouts/{id}` | Delete workout |

### Meals
| Method | Endpoint | Description |
|---|---|---|
| GET | `/meals` | Get all meals |
| POST | `/meals` | Log a meal |
| PUT | `/meals/{id}` | Update meal |
| DELETE | `/meals/{id}` | Delete meal |

### Goals
| Method | Endpoint | Description |
|---|---|---|
| GET | `/goals` | Get all goals |
| POST | `/goals` | Create goal |
| PUT | `/goals/{id}` | Update goal |
| DELETE | `/goals/{id}` | Delete goal |

### Roles
| Method | Endpoint | Description |
|---|---|---|
| GET | `/roles` | Get all roles |
| POST | `/roles` | Assign a role |
| PUT | `/roles/{id}` | Update a role |
| DELETE | `/roles/{id}` | Remove a role |

> 📖 **Swagger UI** available at: `http://localhost:8080/swagger-ui.html`

---

## 🔑 Role System

FitNexus uses a three-tier role system:

| Role | Access |
|---|---|
| `ROLE_ADMIN` | Full access — manage users, roles, view all data |
| `ROLE_TRAINER` | Log and manage workouts/meals for members |
| `ROLE_USER` | Personal tracking — own workouts, meals, goals |

### How Roles Work
- Roles are stored in the `roles` table linked to a `User`
- Assigned at user creation or changed later from the **Member Management** page
- **Admins** sign in directly (no OTP)
- **Trainers & Users** require OTP email verification
- Landing page **Expert Trainers** section auto-fetches users with `ROLE_TRAINER` (max 3, no admins)

---

## 🗄️ Database

The app uses **[Neon.tech](https://neon.tech)** — a serverless PostgreSQL cloud database.

### Tables (auto-created by Hibernate)

| Table | Description |
|---|---|
| `app_user` | Member profiles (name, email, age, weight, height) |
| `roles` | Role assignments linked to users |
| `workout` | Exercise logs |
| `meal` | Nutrition logs |
| `goal` | Fitness goal targets |

### Default Admin Seeding

On first startup, `DatabaseSeeder.java` creates a default admin account:

```
Email:    admin@fitnexus.com
Password: admin123
Role:     ROLE_ADMIN
```

> ⚠️ **Change the default admin password immediately after first login!**

---

## ▶️ Running the App

### Development Mode

```bash
# Start everything (backend + frontend)
npm run start

# Or individually:
npm run backend    # Spring Boot on :8080
npm run frontend   # Vite dev server on :5173
```

### Windows Quick Start

Double-click **`run.bat`** — launches both servers in separate terminal windows.

### Access Points

| Service | URL |
|---|---|
| Frontend (Landing) | http://localhost:5173 |
| Backend API | http://localhost:8080/api |
| Swagger Docs | http://localhost:8080/swagger-ui.html |

---

## 🏗️ Database Setup (Neon)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new **Project** → default database is `neondb`
3. Copy the connection string from **Connection Details**
4. Paste into `application.properties`
5. Start the app — Hibernate will auto-create all tables

---

## 📸 Screenshots

| Page | Description |
|---|---|
| Landing | Public homepage with hero, programs, schedule, trainers |
| Login | OTP-based login with forgot password flow |
| Dashboard (User) | Metric cards, calorie chart, recent activity |
| Dashboard (Admin) | Member directory with BMI and status |
| Member Management | Add/Edit/Delete users with role assignment |
| Workouts | Log and manage workout sessions |
| Meals | Nutrition tracking with calorie log |
| Goals | Target weight and calorie goal management |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

<div align="center">
  <strong>Built with ❤️ by the FitNexus Team</strong><br/>
  <sub>Spring Boot · React · Neon PostgreSQL</sub>
</div>
