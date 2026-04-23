# Hotel Management System (MERN)

Production-ready Hotel Management System using React + Vite + Tailwind on frontend and Node.js + Express + MongoDB Atlas on backend.

## Project Structure

- `client/` Frontend app (Vite + React + Tailwind)
- `server/` Backend API (Express + MongoDB + JWT)

## Local Setup

### 1. Backend

```bash
cd server
npm install
npm run dev
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

## Environment Variables

### Backend (`server/.env`)

- `NODE_ENV`
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_FROM`

### Frontend (`client/.env`)

- `VITE_API_BASE_URL`

## API Base

- `http://localhost:5000/api`

## Deployment

- Frontend: Vercel (`client/vercel.json`)
- Backend: Render (`server/render.yaml`)
