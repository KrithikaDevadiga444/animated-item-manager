# 🎨 My Digital Space — Animated Item Manager + Diary App

A full-stack productivity web application combining a **personal inventory management system** and a **private diary**, built using **Node.js, Express.js, and MongoDB**, with full user authentication. This project began as a front-end-only application during a web development internship and was independently extended into a complete, secured full-stack system with persistent cloud storage.

🔗 **Live Demo:** https://animated-item-manager-1.onrender.com/
*(Hosted on Render free tier — may take 30–60 seconds to load on first visit after inactivity)*

---

## Overview

My Digital Space lets users securely manage a personal inventory and maintain a private diary, all backed by a real database and protected by user authentication. Every user's items and diary entries are private to their own account. The project focuses on full CRUD functionality, clean RESTful route design, thoughtful UX (search, filter, sort, status tracking), and a distinct, animated UI experience across the app.

---

## Features

### 🔐 Authentication
- Secure signup and login with hashed passwords
- Session-based authentication — each user only sees and manages their own data
- Persistent login state shown across all pages ("Signed in as ___") with logout support

### 📦 Item Manager
- Add items with **name, category, quantity, status, and optional notes** — not just a basic list
- Category dropdown (Groceries, Stationery, Electronics, Household, Other)
- Status tracking (Needed / Purchased / In Use)
- **Search** items by name, **filter** by category and status, **sort** by date added
- Category summary dashboard showing item counts and total quantity per category
- Full CRUD — Add, Edit, Delete, and quantity updates

### 📔 Personal Diary
- Full CRUD operations for diary entries
- Entries sorted newest/oldest first
- Distinct visual theme and font styling from the Item Manager
- Entries are private and tied to the logged-in user

### 🎨 UI/UX
- Custom animated, responsive interface across all pages
- Distinct visual identity per section (Home, Items, Diary) while staying cohesive

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | Sessions, bcrypt password hashing |
| Frontend | HTML, CSS, JavaScript |
| Deployment | Render |

---

## Project Structure

```
animated-item-manager/
├─ models/      # Mongoose schemas (User, Item, Diary)
├─ routes/      # Express route handlers (auth, items, diary)
├─ public/      # Static assets (CSS, JS, images)
├─ index.js     # App entry point & server setup
├─ package.json
└─ README.md
```

---

## How to Run Locally

1. Clone the repository
 ```
 git clone https://github.com/KrithikaDevadiga444/animated-item-manager.git
 cd animated-item-manager
 ```
2. Install dependencies
 ```
 npm install
 ```
3. Add your MongoDB connection string as an environment variable (`.env` file):
 ```
 MONGO_URI=your_mongodb_atlas_connection_string
 ```
4. Run the app
 ```
 npm run dev
 ```
5. Open `http://localhost:5000` in your browser.

---

## Project Origin

This project began as a front-end-only application (HTML, CSS, JavaScript) built during a Front-End Web Development internship under the AICTE–Edunet Foundation–IBM SkillBuild initiative.
👉 See the original version: [TaskManager](https://github.com/KrithikaDevadiga444/TaskManager)

It was later independently rebuilt and significantly extended — adding a Node.js/Express backend, MongoDB Atlas database, full user authentication, and a redesigned, feature-rich inventory system — to create a complete, secure, full-stack application.

---

## Future Enhancements

- Image upload support for diary entries and inventory items
- Email-based password reset
- Dark mode toggle
- Export inventory/diary data as CSV or PDF

---

## Developed By

Krithika Devadiga
