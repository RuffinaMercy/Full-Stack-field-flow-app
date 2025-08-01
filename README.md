# Field Flow - Full-Stack App

This is a complete full-stack web application built with the PERN stack (PostgreSQL, Express, React, Node.js) for tracking employee deliveries and expenses.

---

## 🚀 Live Demo

*   **Live Application (Vercel):** [https://full-stack-field-flow-kr1uo91qa.vercel.app/admin/settings](https://full-stack-field-flow-app.vercel.app/) 
    *(Note: The actual URL from your image is different, but this one is cleaner. You can use whichever you prefer.)*
*   **Backend API (Render):** [https://full-stack-field-flow-app-api.onrender.com](https://full-stack-field-flow-app-api.onrender.com)
    *(Note: Visiting the backend URL directly will show `Cannot GET /`, which is the expected behavior for an API server.)*

---

## Features

### Employee Application
- Secure employee login
- Independent forms for logging customer deliveries and personal expenses
- Real-time data submission to the database

### Admin Panel
- Admin area with a responsive layout
- Data Reports dashboard with tables for Deliveries, Expenses, and a calculated Final Report
- Date filtering and CSV download for all reports
- User management section to add and delete employees

## Tech Stack

*   **Frontend:** React, TypeScript, Vite, Material-UI, Axios
*   **Backend:** Node.js, Express.js
*   **Database:** PostgreSQL with Prisma ORM
*   **Deployment:** Vercel (Frontend), Render (Backend & DB)