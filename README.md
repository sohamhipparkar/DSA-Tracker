# 🚀 Interactive Question Management Sheet

(A React + Zustand + Tailwind + Node API Application)

This is a single-page web application that allows users to track coding
questions organized into **Topics → Subtopics → Questions**.\
The platform supports drag-and-drop ordering, progress tracking, admin
editing mode, and onboarding tutorial.

------------------------------------------------------------------------

## 🧰 Tech Stack

**Frontend** - React (Vite) - Zustand (State Management) - Tailwind
CSS - DnD Kit (Drag & Drop) - Lucide React Icons

**Backend** - Node.js - Express.js

**Storage** - LocalStorage (progress, admin mode, tutorial) - JSON
dataset (initial sheet data)

------------------------------------------------------------------------

## 📦 Prerequisites

Install these before running:

1.  **Node.js (v18 or above recommended)** -- https://nodejs.org\
2.  **npm** -- Comes with Node automatically.

Verify installation:

``` bash
node -v
npm -v
```

------------------------------------------------------------------------

## 🖥️ Backend Setup

### 1️⃣ Navigate to server folder

``` bash
cd backend
```

### 2️⃣ Install dependencies

``` bash
npm install
```

### 3️⃣ Start backend

``` bash
node server.js
```

You should see:

    Server running on http://localhost:5000

Test API in browser:

    http://localhost:5000/api/sheet

⚠️ Keep this terminal running.

------------------------------------------------------------------------

## 🌐 Frontend Setup

Open a **new terminal window**.

### 1️⃣ Go to client folder

``` bash
cd frontend
```

### 2️⃣ Install dependencies

``` bash
npm install
```

### 3️⃣ Start React app

``` bash
npm run dev
```

You will see:

    Local: http://localhost:5173

Open this URL in browser.

------------------------------------------------------------------------

## 👤 Admin Mode

The application has **two roles**:

### Viewer Mode

-   View topics
-   Search questions
-   Mark questions solved
-   Track progress

### Admin Mode

-   Add Topics
-   Add Subtopics
-   Add Questions
-   Delete items
-   Reorder topics (drag & drop)

🟢 **Admin Mode is ON by default on first launch.**

You can toggle it using the **Admin Mode button (top right corner).**

------------------------------------------------------------------------

## 📘 First Time Tutorial

On first visit, a tutorial popup appears explaining: - How to track
progress - How to enable admin mode - How to use search - How to solve
problems

To view again:

``` js
localStorage.removeItem("seenTutorial");
```

Refresh the page.

------------------------------------------------------------------------

## 💾 Data Persistence

The application stores: - Solved questions - Admin mode state - Tutorial
completion - Edited sheet

inside browser **LocalStorage**.

⚠️ Clearing browser data resets progress.

------------------------------------------------------------------------

## 🧪 Troubleshooting

### Loading forever

Make sure backend is running:

    http://localhost:5000/api/sheet

### Reset application

``` js
localStorage.clear();
```

Refresh page.

------------------------------------------------------------------------

## 🎯 Features Implemented

-   Topic / Subtopic / Question CRUD
-   Drag & Drop topic reordering
-   Search questions
-   Progress tracking
-   Checkbox solved system
-   Admin Mode permissions
-   Dark Mode UI
-   First-time onboarding tutorial
-   Continue where you left off
