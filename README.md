# 🎨 Animated Item Manager + Diary App

A full-stack productivity web application combining an **item management system** and a **personal diary**, built using **Node.js, Express.js, and MongoDB**. This project began as a front-end-only application during a web development internship and was independently extended into a complete full-stack system with persistent cloud storage.

🔗 **Live Demo:** https://animated-item-manager-1.onrender.com/
*(Hosted on Render free tier — may take 30–60 seconds to load on first visit after inactivity)*

---

## Overview

Animated Item Manager lets users manage everyday items and maintain a personal diary, all backed by a real database instead of local/temporary storage. The project focuses on full CRUD functionality, clean RESTful route design, and a distinct, animated UI experience for each section of the app.

---

## Features

- **Item Manager** — Create, view, update, and delete items with a stylish animated interface
- **Personal Diary** — Full CRUD operations for diary entries, with a separate visual theme and font styling from the item manager
- **MongoDB Atlas Integration** — Persistent cloud-based storage replacing the original local-storage approach
- **RESTful API Design** — Clean, modular Express routes separating item and diary logic
- **Animated, Responsive UI** — Custom CSS animations and distinct styling across views

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Frontend | HTML, CSS, JavaScript |
| Deployment | Render |

---

## Project Structure

```
animated-item-manager/
├─ models/      # Mongoose schemas for items & diary entries
├─ routes/      # Express route handlers (items, diary)
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
 MONGODB_URI=your_mongodb_atlas_connection_string
 ```
4. Run the app
 ```
 npm run dev
 ```
5. Open `http://localhost:3000` (or your configured port) in your browser.

---

## Project Origin

This project began as a front-end-only application (HTML, CSS, JavaScript) built during a Front-End Web Development internship under the AICTE–Edunet Foundation–IBM SkillBuild initiative.
👉 See the original version: [TaskManager](https://github.com/KrithikaDevadiga444/TaskManager)

It was later independently rebuilt and extended into a full-stack application with a Node.js/Express backend and MongoDB Atlas database to add persistent storage and a more robust architecture.

---

## Future Enhancements

- User authentication for personal item/diary spaces
- Image upload support for diary entries
- Search and filter functionality for items
- Dark mode toggle

---

## Developed By

Krithika Devadiga
