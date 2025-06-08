from pathlib import Path

readme_content = """
# 🧭 Tour Backend

This is the backend API for managing travel packages and bookings. It provides endpoints for package CRUD operations, booking management with rate-limiting and email notifications, and authentication via JWT.

---

## ✨ Features

- Full CRUD for travel packages  
- Upload support for package images  
- Booking system with rate limits and email verification  
- Admin dashboard endpoints  
- JWT-based authentication  
- Built with NestJS, Prisma ORM, PostgreSQL

---

## 🚀 API Endpoints

### 📦 Packages

| Method | Endpoint                       | Description                      |
|--------|--------------------------------|----------------------------------|
| GET    | `/packages`                   | Get all travel packages          |
| GET    | `/packages/:id`               | Get a package by ID              |
| POST   | `/packages/create`            | Create a new package (with images) |
| PUT    | `/packages/:id`               | Update a package by ID           |
| DELETE | `/packages/:id`               | Delete a package by ID           |
| POST   | `/packages/upload-images`     | Upload images for a package      |

---

### 📅 Bookings

| Method | Endpoint                 | Description                                       |
|--------|--------------------------|---------------------------------------------------|
| POST   | `/bookings`              | Public booking request (limited: 2 per 15 minutes) |
| GET    | `/bookings`              | Get all bookings (admin only)                     |
| GET    | `/bookings/:id`          | Get booking by ID (admin only)                    |
| PATCH  | `/bookings/:id`          | Confirm or update booking (admin only)            |
| DELETE | `/bookings/:id`          | Delete a booking (admin only)                     |
| POST   | `/bookings/verify`       | Verify booking via reference code & email         |

---

### 🔐 Auth

| Method | Endpoint        | Description                             |
|--------|-----------------|-----------------------------------------|
| POST   | `/auth/login`   | Login with username and password        |
| GET    | `/auth/me`      | Get current logged-in admin user        |
| POST   | `/auth/logout`  | Logout by clearing JWT cookie           |

---

### ⚙️ Schemas

- `LoginDto` — used for login request  
- `VerifyBookingsDto` — used for verifying a booking with reference code and email
---

## 📦 Installation

```bash
git clone https://github.com/calledarian/tour-backend
cd tour-backend
npm install
