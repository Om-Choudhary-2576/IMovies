# IMovies Architecture Overview

## 1. System Vision & Objective
**IMovies — Movie Ticket Booking Made Simple** is a high-performance, full-stack web application designed to deliver a modern, cinematic, and reliable movie ticket booking experience. It addresses the end-to-end journey from movie discovery and theatre schedules to concurrent seat reservation, payment simulation, digital ticket generation, and comprehensive administrative management.

## 2. High-Level Architecture Diagram

```
+------------------------------------------------------------------------+
|                             USER BROWSER                               |
|   React 19 + Vite + React Router + Lucide Icons + Responsive CSS3      |
+-----------------------------------+------------------------------------+
                                    |
                            HTTP/REST (Axios)
                                    |
                                    v
+------------------------------------------------------------------------+
|                          EXPRESS.JS BACKEND                            |
|                                                                        |
|  [Security Middlewares]                                                |
|    - Helmet (HTTP security headers)                                    |
|    - CORS (Whitelisted client origins)                                |
|    - Rate Limiter (Protects auth/booking routes)                       |
|                                                                        |
|  [Authentication & Authorization]                                      |
|    - JWT Bearer Token verification                                     |
|    - Role-based authorization (`protect`, `isAdmin`)                   |
|                                                                        |
|  [REST API Controllers]                                                |
|    - Auth: Register, Login, Profile, Password Reset                    |
|    - Movies: List, Search, Filter, Details, Admin CRUD                 |
|    - Theatres & Screens: List, Detail, Admin CRUD                      |
|    - Shows: Schedule, Screen conflict validation                       |
|    - Bookings: Atomic seat hold, confirmation, cancellation            |
|    - Admin: Metrics dashboard, booking audit                           |
+-----------------------------------+------------------------------------+
                                    |
                              Mongoose ODM
                                    |
                                    v
+------------------------------------------------------------------------+
|                          MONGODB DATABASE                              |
|   - Production: MongoDB Atlas Cloud Cluster                            |
|   - Local Dev/Test: MongoDB Local or In-Memory Replica Set             |
|                                                                        |
|   Collections:                                                         |
|     - users, movies, theatres, screens, shows, bookings                |
+------------------------------------------------------------------------+
```

## 3. Core Modules & Responsibilities

### 3.1 Frontend (`/client`)
- **Single Page Application (SPA):** Built with React 19 and Vite for instant HMR and optimized production bundling.
- **Routing:** React Router v7 configuring public discovery routes, user-authenticated routes, and role-protected admin routes.
- **Design System:** Custom CSS variables based on deep charcoal (`#0a0d14`), electric violet (`#8b5cf6`), and cinema crimson (`#e50914`) palette, glassmorphism, responsive grid layouts, and micro-animations.
- **State Management:** React Context API for centralized user authentication state (`AuthContext`) and booking flow state (`BookingContext`).

### 3.2 Backend (`/server`)
- **Express REST Server:** Layered MVC architecture separating routes, controllers, services, middleware, and data models.
- **Data Integrity & Concurrency:** Atomic seat reservation algorithms that prevent race conditions and double bookings.
- **Error Handling:** Centralized asynchronous error handler returning sanitized JSON error envelopes with proper HTTP status codes.

### 3.3 Database (`MongoDB + Mongoose`)
- Enforces strict schema validations, unique indexes, and compound indexes (e.g. unique booking reference, screen conflict checks).
- In-memory replica set support enables zero-configuration local execution and automated integration testing.

## 4. Concurrency & Seat Booking Reliability
1. **Seat Hold Step:** When a user selects seats, a 8-minute time-limited hold is placed atomically.
2. **Double Booking Guard:** MongoDB atomic queries (`$set`) match only seats with status `AVAILABLE` or whose `holdExpiresAt < now`.
3. **Hold Expiry:** Background cleanup and just-in-time validation verify seat validity prior to final booking confirmation.
4. **Final Confirmation:** Revalidates the hold ownership, processes payment simulation, marks seats as `BOOKED`, and generates a tamper-evident digital ticket reference.
