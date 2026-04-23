# Hotel Management System - Complete Project Guide

This is a complete handbook for understanding, running, and extending the project.

## 1. What This Project Is

A MERN-based hotel management product with:
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + MongoDB Atlas (Mongoose)
- Auth: JWT (Bearer token)
- Roles: `admin`, `staff`, `customer`
- Booking logic with overlap prevention
- Admin panel for room, booking, and user operations
- Currency display configured to INR (`en-IN`, `INR`)

## 2. Current Folder Structure

```text
hotelmanagement/
  client/
  server/
  README.md
  PROJECT_COMPLETE_GUIDE.md
```

## 3. How To Run The Project (Local)

## Prerequisites
- Node.js 18+ (you are on Node v22, which works)
- npm
- MongoDB Atlas connection string

## Backend setup
1. Open terminal:
```bash
cd server
npm install
```
2. Configure env file:
- Use `server/.env`
- Required:
  - `MONGO_URI` (Atlas URI, URL-encode special chars in password)
  - `JWT_SECRET`
  - `CLIENT_URL=http://localhost:5173`
3. Start backend:
```bash
npm run dev
```
Expected output:
- `MongoDB connected: ...`
- `Server running on port 5000`

## Frontend setup
1. Open second terminal:
```bash
cd client
npm install
```
2. Configure env file:
- `client/.env`
- `VITE_API_BASE_URL=http://localhost:5000/api`
3. Start frontend:
```bash
npm run dev
```
4. Open:
- `http://localhost:5173`

## Important command note
Do not run Vite with positional args like:
- `vite 127.0.0.1 5173` (this causes `CACError: Unused args`)
Use:
- `npm run dev`

## 4. High-Level Architecture

## Frontend flow
- User logs in/registers
- JWT token stored in `localStorage` key: `hotel_auth`
- Axios attaches token to protected API calls
- Protected routes enforce login and role constraints

## Backend flow
- Express app mounts route groups under `/api/*`
- `protect` middleware validates JWT and attaches `req.user`
- `authorizeRoles` checks role permissions
- Controllers execute business logic and return JSON
- Global error middleware formats failures

## Database entities
- `User`: name, email, password(hash), role
- `Room`: roomNumber, type, price, status, images
- `Booking`: user, room, checkIn/out, status, paymentStatus, totalPrice

## 5. Screens Count and Purpose

Total screens/pages: **7**

1. `LoginPage` (`/login`)
- User authentication

2. `RegisterPage` (`/register`)
- New account creation

3. `DashboardPage` (`/dashboard`)
- Booking stats + booking history + cancel booking

4. `RoomsPage` (`/rooms`)
- Rooms listing + search/filter + pagination

5. `BookingPage` (`/book/:roomId`)
- Date selection + availability check + booking creation

6. `AdminPanelPage` (`/admin`)
- Admin/staff operations (rooms, bookings, revenue, users)

7. `NotFoundPage` (`*`)
- 404 fallback

## 6. How Registration Works

Frontend:
- `RegisterPage` collects `name`, `email`, `password`, `role`
- Calls `register` from `AuthContext`
- On success: token saved, user auto-logged in, redirect to dashboard

Backend:
- Route: `POST /api/auth/register`
- Validation: name required, valid email, password min 6
- Duplicate email check
- Password hashed in `User` model pre-save hook
- Response includes JWT token + user data

## 7. How To Create Admin

There are 3 practical methods:

## Method A (quick for now, current code allows this)
- Register through UI and send role as `admin`
- Backend currently accepts provided role if valid enum

## Method B (recommended operationally)
1. Register as normal user
2. Login with existing admin
3. Go to Admin Panel -> User Management
4. Change user role to `admin`

## Method C (direct DB update)
- Update `users` collection record role to `admin`

## Security note
Current register API allows role in request body. In production, this should be locked down so public registration always creates `customer`.

## 8. API Map (Current)

## Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

## Users (admin only)
- `GET /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id/role`
- `DELETE /api/users/:id`

## Rooms
- `GET /api/rooms`
- `GET /api/rooms/:id`
- `POST /api/rooms` (admin/staff)
- `PUT /api/rooms/:id` (admin/staff)
- `DELETE /api/rooms/:id` (admin only)
- `POST /api/rooms/upload-image` (admin/staff)

## Bookings
- `GET /api/bookings/availability`
- `GET /api/bookings/my`
- `POST /api/bookings`
- `PATCH /api/bookings/:id/cancel`
- `GET /api/bookings/admin/all` (admin/staff)
- `GET /api/bookings/admin/revenue` (admin only)

## 9. Backend File-by-File Explanation

## Root and runtime
- `server/package.json`
  - Backend scripts (`dev`, `start`) and dependencies.
- `server/server.js`
  - Loads env, connects DB, starts HTTP server.
- `server/app.js`
  - Express app config: CORS, body parsers, routes, error handlers.
- `server/.env`
  - Active environment values.
- `server/.env.example`
  - Template for required env variables.
- `server/render.yaml`
  - Render deployment service spec.

## Config
- `server/config/db.js`
  - Mongoose Atlas connection function.
- `server/config/cloudinary.js`
  - Cloudinary client setup.
- `server/config/mailer.js`
  - Nodemailer transporter + `sendEmail` helper.

## Models
- `server/models/User.js`
  - User schema + password hashing + comparePassword method.
- `server/models/Room.js`
  - Room schema, status/type enums, index for filtering.
- `server/models/Booking.js`
  - Booking schema, status/payment enums, indexes.

## Middleware
- `server/middleware/authMiddleware.js`
  - JWT auth (`protect`) and role guard (`authorizeRoles`).
- `server/middleware/errorMiddleware.js`
  - Not-found and central error formatter.
- `server/middleware/asyncHandler.js`
  - Async wrapper to avoid repetitive try/catch.

## Controllers
- `server/controllers/authController.js`
  - Register, login, current profile logic.
- `server/controllers/userController.js`
  - Admin user list/get/update-role/delete.
- `server/controllers/roomController.js`
  - Create/read/update/delete room + optional image upload.
- `server/controllers/bookingController.js`
  - Availability, create booking, overlap blocking, cancel, admin booking list, revenue.

## Routes
- `server/routes/authRoutes.js`
  - `/api/auth/*` endpoints + validators.
- `server/routes/userRoutes.js`
  - `/api/users/*` with admin-only router-level guard.
- `server/routes/roomRoutes.js`
  - `/api/rooms/*` public + protected operations.
- `server/routes/bookingRoutes.js`
  - `/api/bookings/*` customer/admin booking endpoints.

## Utils
- `server/utils/generateToken.js`
  - JWT sign helper.

## Other
- `server/uploads/`
  - Temp storage used by multer for image upload endpoint.

## 10. Frontend File-by-File Explanation

## Runtime and config
- `client/package.json`
  - Frontend scripts and dependencies.
- `client/index.html`
  - Vite HTML entrypoint.
- `client/vite.config.js`
  - Vite + React plugin setup.
- `client/tailwind.config.js`
  - Tailwind scanning + custom brand palette.
- `client/postcss.config.js`
  - Tailwind/PostCSS plugins.
- `client/vercel.json`
  - Vercel build + SPA rewrite config.
- `client/.env`
  - Runtime API base URL.
- `client/.env.example`
  - Env template.

## App bootstrap
- `client/src/main.jsx`
  - React root render + Router + AuthProvider + ToastContainer.
- `client/src/App.jsx`
  - Route table and route protection wiring.
- `client/src/index.css`
  - Tailwind imports and utility class shortcuts (`card`, `input`, `btn*`, `badge`).

## Context and hooks
- `client/src/context/AuthContext.jsx`
  - Auth state, localStorage persistence, login/register/logout, profile sync.
- `client/src/hooks/useAuth.js`
  - Context accessor hook.

## Services
- `client/src/services/api.js`
  - Axios instance + auth header helper + error normalization.
- `client/src/services/authService.js`
  - Auth API calls.
- `client/src/services/roomService.js`
  - Room API calls.
- `client/src/services/bookingService.js`
  - Booking API calls.
- `client/src/services/userService.js`
  - User/admin API calls.

## Components
- `client/src/components/Navbar.jsx`
  - Top navigation + role-aware links + logout.
- `client/src/components/ProtectedRoute.jsx`
  - Guards routes by auth and optional role list.
- `client/src/components/RoomCard.jsx`
  - Room tile with status + CTA.
- `client/src/components/BookingForm.jsx`
  - Date form + nights calc + submit enable rules.
- `client/src/components/DashboardStats.jsx`
  - Summary cards for bookings and spend/volume.

## Pages
- `client/src/pages/LoginPage.jsx`
  - Login form and redirect logic.
- `client/src/pages/RegisterPage.jsx`
  - Registration form and onboarding redirect.
- `client/src/pages/DashboardPage.jsx`
  - History list, cancel action, stats.
- `client/src/pages/RoomsPage.jsx`
  - Search/filter/pagination + room cards.
- `client/src/pages/BookingPage.jsx`
  - Room details + availability + booking create.
- `client/src/pages/AdminPanelPage.jsx`
  - KPI cards + create/delete room + user role management.
- `client/src/pages/NotFoundPage.jsx`
  - 404 fallback UI.

## Utils
- `client/src/utils/format.js`
  - Currency (INR), date formatting, nights calculation.

## 11. What Is Completed

- End-to-end auth flow (register/login/logout/profile sync)
- JWT-based route protection
- Role-based access enforcement
- Room management APIs and admin UI
- Booking creation with overlap prevention
- Booking history and cancellation
- Revenue endpoint and admin summary cards
- Search/filter/pagination for rooms
- INR currency display across UI
- Deployment config stubs for Vercel/Render

## 12. What Is Still Pending / Improvement Backlog

## High priority
1. Lock public registration role
- Current register endpoint allows role from request body.
- Recommended: force `customer` on public register.

2. Vite version compatibility cleanup
- Current `client/package.json` has `vite@8.0.9` while `@vitejs/plugin-react@4.x` expects up to v7.
- App runs, but warnings exist.
- Recommendation:
  - either downgrade Vite to `^7` or `^5`
  - or upgrade plugin strategy to compatible stack.

3. Add robust testing
- There are testing deps in server but no active test suite now.
- Recommended: restore unit/integration tests and CI checks.

## Functional pending
4. Real payment integration
- `paymentStatus` exists but no payment gateway flow yet.

5. Password reset / email verification
- Missing auth hardening flows.

6. Refresh token / session management
- Currently single JWT in localStorage.

7. Better room status automation
- Room status set to booked on create booking and available on cancel checks, but no scheduler for checkout completion.

8. Image upload UX on frontend
- Backend has upload endpoint; admin UI currently uses URL/metadata path and no upload widget.

9. Confirmation dialogs for destructive actions
- Delete user/room and cancel booking can be improved with confirm modal.

10. Observability and security hardening
- Add helmet, rate limiting, audit logging, and stricter validation/sanitization.

## 13. Manual QA Checklist

Use this every time before deployment:

1. Auth
- Register new customer
- Login/logout
- Invalid login shows proper error

2. Role checks
- Customer cannot access `/admin`
- Non-admin blocked from admin revenue/users APIs

3. Rooms
- Create room
- Duplicate room number blocked
- Filter/search/pagination work

4. Booking
- Book room on valid date range
- Overlap booking blocked
- Invalid date range prevented
- Cancel booking updates status

5. Admin
- User role update works
- Room delete works
- Revenue endpoint returns expected values

## 14. Deployment Summary

## Frontend (Vercel)
- Root dir: `client`
- Build: `npm run build`
- Output: `dist`
- Env: `VITE_API_BASE_URL=<backend-url>/api`

## Backend (Render)
- Root dir: `server`
- Build: `npm install`
- Start: `npm start`
- Configure all envs from `.env.example`
- Set `CLIENT_URL` to deployed frontend URL

## 15. Common Errors and Fixes

1. `MongoDB connection error: querySrv ENOTFOUND _mongodb._tcp.0826`
- Cause: broken Atlas URI / unescaped password.
- Fix: URL-encode special chars in password (`@` -> `%40`).

2. `CACError: Unused args: 5173`
- Cause: running Vite with wrong positional args.
- Fix: run only `npm run dev`.

3. CORS errors
- Ensure backend `CLIENT_URL` exactly matches frontend origin.

## 16. Quick Start For New Developer

1. Clone repo
2. Configure `server/.env` and `client/.env`
3. Run backend + frontend
4. Register first admin (temporary method allowed currently)
5. Seed rooms from admin panel
6. Test booking flow using customer user

## 17. Product Status (Current)

Overall status: **Feature-complete MVP with role-based operations and live booking logic, ready for staged deployment after security and dependency compatibility hardening.**
