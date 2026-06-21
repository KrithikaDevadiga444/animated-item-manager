# Animated Item Manager + Diary App

A full-stack productivity web application combining a **personal inventory tracker** and a **private diary**, built with **Node.js, Express.js, MongoDB, and vanilla JavaScript**.

🔗 **Live Demo:** https://animated-item-manager-1.onrender.com/

---

## Overview

Each user gets their own private workspace: items and diary entries are scoped to the logged-in account via session-based authentication. The Item Manager supports search, filtering, sorting, and category dashboards — not just basic CRUD.

---

## Features

### Authentication
- Sign up / log in with email and password
- Passwords hashed with **bcrypt** (via `bcryptjs`)
- **Session-based auth** — server stores session in MongoDB; browser sends an httpOnly cookie automatically
- Logout destroys the session

### Item Manager
- Add items with name, category (dropdown), quantity, status, and optional notes
- Search by name, filter by category/status, sort by date/name/category
- Edit and delete (with confirmation) existing items
- Category summary dashboard at the top

### Diary
- Private journal entries tied to your account
- Sort newest or oldest first
- Edit and delete with confirmation modals

### UI
- Cohesive glassmorphism design across all pages
- Subtle animations on cards, modals, and list changes
- Fully responsive layout

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | bcryptjs, express-session, connect-mongo |
| Frontend | HTML, CSS, JavaScript (vanilla) |
| Deployment | Render |

---

## Project Structure

```
animated-item-manager/
├─ models/          # User, Item, Diary Mongoose schemas
├─ middleware/      # Auth middleware (requireAuth)
├─ routes/          # auth, items, diary route handlers
├─ scripts/         # seed.js — demo data for live preview
├─ public/          # Static frontend (HTML, CSS, JS)
├─ index.js         # Server entry point
├─ package.json
└─ README.md
```

---

## How to Run Locally

1. Clone and install:
   ```bash
   git clone https://github.com/KrithikaDevadiga444/animated-item-manager.git
   cd animated-item-manager
   npm install
   ```

2. Create a `.env` file:
   ```
   MONGO_URI=your_mongodb_atlas_connection_string
   SESSION_SECRET=a-long-random-string-for-production
   ```

3. (Optional) Seed demo data for interviews/live demo:
   ```bash
   npm run seed
   ```
   Demo login: `demo@animatedmanager.app` / `demo1234`

4. Start the server:
   ```bash
   npm run dev
   ```

5. Open `http://localhost:5000` in your browser.

---

## Auth Flow (Interview Cheat Sheet)

1. **Register** — password is hashed with bcrypt (10 salt rounds) and stored as `passwordHash`. Never store plain text.
2. **Login** — bcrypt compares the submitted password to the hash. On success, `req.session.userId` is set.
3. **Session cookie** — Express sends a signed session ID cookie (`httpOnly`, so JavaScript cannot read it — XSS protection).
4. **Protected routes** — `requireAuth` middleware checks `req.session.userId`. Items/diary queries always filter by that user ID.
5. **Logout** — session is destroyed server-side; cookie is cleared.

---

## Developed By

Krithika Devadiga
