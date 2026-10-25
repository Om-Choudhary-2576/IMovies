# IMovies REST API Documentation

## Base URL
`/api` (e.g. `http://localhost:5000/api`)

All endpoints return JSON responses. Errors follow a uniform structure:
```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```
Successful responses follow:
```json
{
  "success": true,
  "data": { ... }
}
```

---

## 1. Authentication & Users (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user account |
| POST | `/api/auth/login` | Public | Authenticate user & issue JWT |
| GET | `/api/auth/me` | User / Admin | Retrieve current logged-in user profile |
| PUT | `/api/auth/profile` | User / Admin | Update profile name, phone, password |
| POST | `/api/auth/forgot-password` | Public | Request password reset token |
| POST | `/api/auth/reset-password` | Public | Reset password using valid token |

---

## 2. Movies (`/api/movies`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/movies` | Public | List movies with search, filter (genre, language, status), sort & pagination |
| GET | `/api/movies/featured` | Public | Get featured banner movies |
| GET | `/api/movies/now-showing` | Public | Get currently screening movies |
| GET | `/api/movies/coming-soon` | Public | Get upcoming movie premieres |
| GET | `/api/movies/:id` | Public | Get movie details by ID or slug |
| POST | `/api/movies` | Admin | Create a new movie |
| PUT | `/api/movies/:id` | Admin | Update movie details |
| DELETE | `/api/movies/:id` | Admin | Delete movie |

---

## 3. Theatres & Screens (`/api/theatres`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/theatres` | Public | List all theatres (optional city filter) |
| GET | `/api/theatres/:id` | Public | Get theatre details & screens |
| POST | `/api/theatres` | Admin | Create a new theatre complex |
| PUT | `/api/theatres/:id` | Admin | Update theatre details |
| DELETE | `/api/theatres/:id` | Admin | Remove theatre |

---

## 4. Shows & Schedules (`/api/shows`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/shows` | Public | Query shows by `movieId`, `theatreId`, `date`, `city` |
| GET | `/api/shows/:id` | Public | Get show details with real-time seat matrix |
| POST | `/api/shows` | Admin | Schedule a new show (validates screen schedule conflicts) |
| PUT | `/api/shows/:id` | Admin | Update show pricing or timing |
| DELETE | `/api/shows/:id` | Admin | Cancel/delete show |

---

## 5. Seat Reservation & Bookings (`/api/bookings`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/bookings/hold` | Authenticated | Place an atomic 8-minute hold on selected seats |
| POST | `/api/bookings/confirm` | Authenticated | Confirm booking, calculate pricing, simulate payment & issue ticket |
| GET | `/api/bookings/my` | Authenticated | Retrieve customer's personal booking history |
| GET | `/api/bookings/:id` | Authenticated | Get full booking details with QR code & ticket info |
| POST | `/api/bookings/:id/cancel`| Authenticated | Cancel booking & release seats back to available pool |

---

## 6. Admin Management (`/api/admin`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/admin/stats` | Admin | Metrics: total revenue, movies, theatres, bookings, seat utilization |
| GET | `/api/admin/bookings` | Admin | Paginated list of all bookings across system |
| PUT | `/api/admin/bookings/:id/status` | Admin | Admin override booking/refund status |

---

## 7. System Health (`/api/health`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/health` | Public | Server uptime, DB status, and system timestamp |
