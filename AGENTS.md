# Instructions for Codex Agents

This repository implements a simple purchase order system with a Flask backend and a React frontend.

## Structure
- `backend/` – Flask API using SQLAlchemy. It expects the environment variable `DATABASE_URL` pointing to a PostgreSQL database.
- `frontend/` – React application built with Vite that consumes the API.

## Guidelines
- Keep backend and frontend code separated in their respective folders.
- Update the README files whenever setup or usage steps change.
- Do not commit build artifacts or dependencies such as `node_modules`.

## Programmatic checks
Run the following commands before committing any change that touches Python or JavaScript code:

```bash
python3 -m py_compile backend/app.py backend/models.py
npm install
npm run build
```

These commands ensure the backend compiles and the frontend builds successfully.
