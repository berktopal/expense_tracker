# Expense Tracker

A full-stack personal expense tracking application. Users register, log in with JWT authentication and manage their own expenses on a dashboard with spending breakdowns, period filters, a monthly budget indicator and rule-based spending suggestions.

![CI](https://github.com/berktopal/expense_tracker/actions/workflows/ci.yml/badge.svg)

## Features

- **Authentication:** registration and login with bcrypt-hashed passwords and JWT (HS256) tokens
- **Expense management:** create, edit and delete expenses (title, amount, date); every user only sees and modifies their own records
- **Dashboard analytics:** spending distribution pie chart (Recharts), totals per period (this week / this month / last month / all)
- **Budget tracking:** remaining amount against a monthly limit
- **Spending suggestions:** highlights categories that dominate total spending or exceed a threshold
- **Dark / light mode**
- **Form validation** with Formik + Yup on the client and field whitelisting + validation on the server

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, React Router, Material UI, Recharts, Formik, Yup, Axios, Day.js |
| Backend | Node.js, Express 5, Sequelize ORM, JSON Web Tokens, bcrypt |
| Database | MySQL |
| CI | GitHub Actions (backend smoke test against MySQL, frontend production build) |

## Architecture

```
expense_tracker/
├── backend/
│   ├── app.js              # Express app: CORS, JSON parsing, routes
│   ├── server.js           # DB sync + HTTP server
│   ├── config/db.js        # Sequelize connection
│   ├── models/             # User, Transaction (User 1-N Transaction)
│   ├── controllers/        # auth + transaction business logic
│   ├── middleware/         # JWT authentication
│   └── routes/             # /api/register, /api/login, /api/me, /api/transactions
└── frontend/
    └── src/
        ├── pages/          # Login, Register, Dashboard
        ├── components/     # Navbar, AddTransactionForm, TransactionItem, Spinner
        ├── context/        # Theme (dark mode)
        └── api/axios.js    # API client with token interceptor
```

## API

All `/api/transactions` endpoints require an `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Create an account (`username`, `password` ≥ 8 chars) |
| POST | `/api/login` | Returns a JWT valid for 1 day |
| GET | `/api/me` | Current user |
| GET | `/api/transactions` | List the current user's expenses |
| POST | `/api/transactions` | Create an expense (`title`, `amount`, `date`) |
| PUT | `/api/transactions/:id` | Update an expense |
| DELETE | `/api/transactions/:id` | Delete an expense |

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8

### Backend
```bash
cd backend
cp .env.example .env      # then fill in DB credentials and JWT_SECRET
npm install
node server.js            # http://localhost:5000
```

Generate a strong `JWT_SECRET` (the server refuses to start with a secret shorter than 32 characters):
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Frontend
```bash
cd frontend
npm install
npm start                 # http://localhost:3000
```

## Security

- Passwords hashed with bcrypt; uniform login error messages (no username enumeration)
- JWT algorithm pinned to HS256; weak or missing secrets prevent startup
- Server-side field whitelisting prevents mass assignment (e.g. reassigning a record to another user)
- Ownership checks on every read, update and delete
- CORS restricted to the configured frontend origin
