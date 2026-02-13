# Project Management App

A full-stack **Node.js + TypeScript + React (TSX)** project to manage projects and expenses.

## Features

* Add / View / Edit Projects
* Add / View Expenses per project
* Proper **frontend & backend validation**
* Centralized **error handling**
* Type-safe API requests & responses

---

## Setup Instructions

### Backend

1. Clone the repository:

```bash
git clone https://github.com/madushankapathi/KEA-Full-Stack-Take-Home-Assignment.git
cd KEA KEA-Full-Stack-Take-Home-Assignment/backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```
PORT=5000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=KEA
DB_PORT=5432
```

4. Run database setup for PostgreSQL:

```
CREATE DATABASE KEA;


CREATE TABLE projects (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
client_name VARCHAR(255) NOT NULL,
estimated_budget NUMERIC(10,2) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE expenses (
id SERIAL PRIMARY KEY,
project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
description VARCHAR(255) NOT NULL,
amount NUMERIC(10,2) NOT NULL,
category VARCHAR(50) CHECK (category IN ('material','labor','other')) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

5. Start the backend server:

```bash
npm run dev
```

---

### Frontend

1. Navigate to frontend folder:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend:

```bash
npm start
```

4. Open in browser at `http://localhost:3000`

---

## Database Schema Explanation

**Projects Table**

| Column           | Type      | Description              |
| ---------------- | --------- | ------------------------ |
| id               | INT       | Primary key              |
| name             | VARCHAR   | Project name             |
| client_name      | VARCHAR   | Client name              |
| estimated_budget | DECIMAL   | Project estimated budget |
| created_at       | TIMESTAMP | Timestamp of creation    |

**Expenses Table**

| Column      | Type      | Description                      |
| ----------- | --------- | -------------------------------- |
| id          | INT       | Primary key                      |
| project_id  | INT       | Foreign key referencing Projects |
| description | VARCHAR   | Expense description              |
| amount      | DECIMAL   | Expense amount                   |
| category    | ENUM      | Type: material, labor, or other  |
| created_at  | TIMESTAMP | Timestamp of creation            |

---

## Assumptions Made

* A project **must have a name, client name, and estimated budget**.
* Expenses **cannot be negative or zero**.
* Expense category limited to: `material`, `labor`, `other`.
* API and frontend hosted locally for development.

---

## What Could Be Improved With More Time

* User Authentication & Authorization
* Better UI/UX with modal libraries and toast notifications
* Centralized validation using Zod/Yup across frontend and backend
* Pagination & filtering for projects and expenses lists
* Unit & integration testing for frontend and backend
* Deployment using Docker and cloud platforms

---

