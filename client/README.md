# Task Manager Frontend

React + Vite app for the MERN Task Manager.

## Setup

1. Copy `.env.example` to `.env` and adjust if your API URL differs:

```
VITE_API_URL=http://localhost:4000
```

2. Install and run:

```
npm install
npm run dev
```

The app will start at `http://localhost:5173`.

## Pages

- Home: Info and CSV format
- Login: Uses httpOnly cookie auth with the backend
- Admin Dashboard: Create agents, view agents, upload CSV/XLS/XLSX and distribute tasks
- Agent Dashboard: View my tasks
- Profile: View/update profile (name, phone)

## Notes
- Keep server running at `PORT=4000` or update `VITE_API_URL`.
- CSV/XLS/XLSX must have columns: `FirstName, Phone, Notes`.
