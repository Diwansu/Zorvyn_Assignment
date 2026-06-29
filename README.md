# Zorvyn Finance API — Backend

A backend system for a **Finance Dashboard** where different users interact with financial records based on their role. Built with Node.js, Express, and MongoDB.

---

## 🔗 Links

| | |
|---|---|
| **Live API** | https://zorvyn-assignment-phi.vercel.app/ |
| **GitHub Repo** | https://github.com/Diwansu/Zorvyn_Assignment |
| **AWS** | http://a72ec80a5d34d4785b30c0da368c7c10-925013098.us-east-1.elb.amazonaws.com/| ( was deleted later)

---

## 🛠️ Tech Stack

- **Runtime** — Node.js
- **Framework** — Express v5
- **Database** — MongoDB (via Mongoose)
- **Authentication** — JWT (JSON Web Tokens)
- **Password Hashing** — bcryptjs
- **Deployment** — Vercel

---

## 📁 Project Structure

```
Backend/
├── controllers/
│   ├── authController.js        # register, login, getMe
│   ├── dashboardController.js   # summary analytics
│   ├── recordController.js      # CRUD for financial records
│   └── userController.js        # user role & status management
├── middlewares/
│   ├── authMiddleware.js         # JWT token verification
│   ├── errorMiddleware.js        # global error handler
│   └── roleMiddleware.js         # role-based access control
├── models/
│   ├── User.js                   # user schema
│   └── Record.js                 # financial record schema
├── routes/
│   ├── authRoutes.js
│   ├── dashboardRoutes.js
│   ├── recordRoutes.js
│   └── userRoutes.js
├── .env                          # environment variables (not committed)
├── .gitignore
├── package.json
├── server.js                     # entry point
└── vercel.json                   # Vercel deployment config
```

---

## ⚙️ Local Setup — Step by Step

### 1. Clone the repository

```bash
git clone https://github.com/Diwansu/Zorvyn_Assignment.git
cd Zorvyn_Assignment/Backend
```

### 2. Install dependencies

```bash
docker compose 
```

### 3. Create a `.env` file

Create a file named `.env` inside the `Backend` folder and add the following:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
```

> To get a `MONGO_URI`, create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas), then go to Connect → Drivers → copy the connection string and replace `<password>` with your actual password.

### 4. Run the server

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

### 5. Verify it works

Open your browser or Postman and visit:
```
GET http://localhost:3000/
```
You should see:
```
Zorvyn Finance API is running...
```

---

## 👥 Roles & Permissions

The system has three roles with different levels of access:

| Action | Viewer | Analyst | Admin |
|---|:---:|:---:|:---:|
| View dashboard summary | ✅ | ✅ | ✅ |
| View all records | ❌ | ✅ | ✅ |
| View single record | ❌ | ✅ | ✅ |
| Filter & sort records | ❌ | ✅ | ✅ |
| Create records | ❌ | ❌ | ✅ |
| Update records | ❌ | ❌ | ✅ |
| Delete records | ❌ | ❌ | ✅ |
| View all users | ❌ | ❌ | ✅ |
| Change user role | ❌ | ❌ | ✅ |
| Change user status | ❌ | ❌ | ✅ |

---

## 🔑 Test Credentials

These accounts are pre-created on the live deployed API for testing:

| Role | Email | Password |
|---|---|---|
| Admin | admin@test.com | 123456 |
| Analyst | analyst@test.com | 123456 |
| Viewer | viewer@test.com | 123456 |
| Inactive User | inactive@test.com | 123456 |

> **Note:** The inactive account will be blocked at login with a `403` response, demonstrating the user status feature.

---

## 📡 API Endpoints

Base URL (Live): `https://zorvyn-assignment-phi.vercel.app`  
Base URL (Local): `http://localhost:3000`

All protected routes require the following header:
```
Authorization: Bearer <your_token>
```

---

### 🔐 Auth Routes — `/api/auth`

#### Register a new user
```
POST /api/auth/register
```
Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "Viewer"
}
```
- `role` can be `Viewer`, `Analyst`, or `Admin`. Defaults to `Viewer` if not provided or invalid.
- Returns user info and a JWT token.

---

#### Login
```
POST /api/auth/login
```
Body:
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```
- Returns user info and a JWT token.
- Blocked with `403` if user status is `inactive`.

---

#### Get current logged-in user
```
GET /api/auth/me
```
- Requires token.
- Returns the user object of whoever is currently logged in.

---

### 💰 Record Routes — `/api/records`

All record routes require authentication. Role restrictions are listed per endpoint.

#### Get all records
```
GET /api/records
```
- Allowed: `Analyst`, `Admin`
- Returns all financial records with creator info populated.

**Optional query filters:**

| Parameter | Example | Description |
|---|---|---|
| `type` | `?type=income` | Filter by income or expense |
| `category` | `?category=Salary` | Filter by category |
| `startDate` | `?startDate=2024-01-01` | Records from this date |
| `endDate` | `?endDate=2024-12-31` | Records up to this date |
| `sort` | `?sort=amount_high` | Sort options: `oldest`, `amount_high`, `amount_low` |

Example with filters:
```
GET /api/records?type=income&category=Salary&sort=amount_high
```

---

#### Get single record
```
GET /api/records/:id
```
- Allowed: `Analyst`, `Admin`
- Replace `:id` with the record's MongoDB `_id`.

---

#### Create a record
```
POST /api/records
```
- Allowed: `Admin` only
- Body:
```json
{
  "amount": 5000,
  "type": "income",
  "category": "Salary",
  "date": "2024-06-15",
  "notes": "June salary payment"
}
```

Field rules:
- `amount` — required, number
- `type` — required, must be `income` or `expense`
- `category` — required, one of: `Salary`, `Investment`, `Food`, `Entertainment`, `Utilities`, `Other`
- `date` — optional, defaults to today
- `notes` — optional, max 500 characters

---

#### Update a record
```
PUT /api/records/:id
```
- Allowed: `Admin` only
- Send only the fields you want to update in the body.
- Mongoose validators still run on update.

---

#### Delete a record
```
DELETE /api/records/:id
```
- Allowed: `Admin` only
- Permanently deletes the record.
- Returns a success message with the deleted record's `id`.

---

### 📊 Dashboard Routes — `/api/dashboard`

#### Get summary
```
GET /api/dashboard/summary
```
- Allowed: `Viewer`, `Analyst`, `Admin` (all roles)
- Returns:
  - `totalIncome` — sum of all income records
  - `totalExpense` — sum of all expense records
  - `netBalance` — totalIncome minus totalExpense
  - `categoryTotals` — breakdown of total amount per category
  - `recentActivity` — last 5 records with creator details

Example response:
```json
{
  "summary": {
    "totalIncome": 15000,
    "totalExpense": 4200,
    "netBalance": 10800
  },
  "categoryTotals": {
    "Salary": 10000,
    "Investment": 5000,
    "Food": 2400,
    "Utilities": 1800
  },
  "recentActivity": [...]
}
```

---

### 👥 User Routes — `/api/users`

All user routes are restricted to `Admin` only.

#### Get all users
```
GET /api/users
```
- Returns all users. Passwords are never included in the response.

---

#### Update user role
```
PUT /api/users/:id/role
```
Body:
```json
{
  "role": "Analyst"
}
```
- Valid roles: `Viewer`, `Analyst`, `Admin`
- Returns updated user object.

---

#### Update user status
```
PUT /api/users/:id/status
```
Body:
```json
{
  "status": "inactive"
}
```
- Valid statuses: `active`, `inactive`
- Setting a user to `inactive` blocks them from logging in.

---

## 🔒 Key Features

### JWT Authentication
Every protected route requires a valid JWT token in the `Authorization` header. Tokens are generated on register and login and expire after 30 days.

### Role-Based Access Control
Three middleware functions work together on every request:
1. `protect` — verifies the JWT token is valid and the user exists
2. `authorize(...roles)` — checks if the user's role is allowed for that route
3. Routes clearly define which roles can do what

### User Status Control
Admins can set any user to `inactive`. Inactive users are blocked at login and also blocked mid-session via the auth middleware — even if they already have a valid token.

### Input Validation & Error Handling
- Mongoose schema validation catches missing or invalid fields
- A global error handler catches all errors and returns clean JSON responses with appropriate status codes
- Invalid MongoDB IDs return `404` instead of crashing the server
- All sensitive error stack traces are hidden in production

---

## 🧪 Testing the API

### Recommended Tool
[Postman](https://www.postman.com/) — create a collection with a `base_url` variable set to the live API URL.

### Suggested Test Order
1. Register or login with a test account to get a token
2. Set the token in `Authorization: Bearer <token>`
3. Test dashboard summary (works for all roles)
4. Test record creation with Admin token
5. Test record viewing and filtering with Analyst token
6. Test that Viewer gets `403` on record routes
7. Test user management with Admin token (change role, change status)
8. Login as the inactive user — expect `403`

---

## 📝 Assumptions Made

- Role assignment is allowed during registration for simplicity. In a real system, only Admins would be able to assign roles.
- Soft delete for users is implemented via the `inactive` status field rather than removing the document from the database.
- The `createdBy` field on records always stores the Admin who created the record, since only Admins can create records.
- No pagination was implemented on the records list, but filtering and sorting are supported.

---

## 👤 Author

**Diwanshu Baskota**  
diwansu531@gmail.com  
Zorvyn FinTech Backend Developer Intern Assignment
