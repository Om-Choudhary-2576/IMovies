# IMovies — Movie Ticket Booking Made Simple

![IMovies Hero Preview](https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80)

**IMovies** is a full-stack, cinema-inspired web application designed to deliver an intuitive and reliable movie ticket booking experience. Featuring a deep charcoal and electric-violet/crimson aesthetic, IMovies provides an end-to-end journey from film discovery, multi-theatre scheduling, and interactive seat selection with atomic concurrency locks, to instant digital boarding-pass ticket generation with scannable QR verification.

---

## 🌟 Key Highlights & Features

- **Cinematic Visual Experience:** Dark modern UI with glassmorphism, responsive posters, smooth micro-animations, and custom typography (Outfit & Plus Jakarta Sans).
- **Comprehensive Discovery:** Browse Now Showing, Coming Soon, and Featured Premiere banners; search by title or cast; filter by genre, language, and category; sort by rating or release date.
- **Auditoriums & Formats:** Support for IMAX with Laser, Dolby Atmos, 4DX, and Standard screens across multi-city theatre complexes.
- **Interactive Seat Reservation:** Visual cinema screen curve, row/column labels, tiered pricing (VIP Recliner, Premium, Standard), hover tooltips, and real-time state management.
- **Concurrency & Double-Booking Prevention:** Backend-enforced atomic 8-minute seat holds with live countdown timers. Prevents double-booking even under concurrent traffic.
- **Transparent Price Breakdown:** Backend-calculated subtotals, per-ticket convenience fees, sales tax, and instant discount vouchers (e.g. `IMOVIE20` for 20% off).
- **Digital Boarding Pass Tickets:** Unique reference numbers (e.g. `IM-7871-5278`), scannable QR codes for gate check-in, and printable ticket views.
- **Account & Booking Management:** User registration, JWT authentication with role protection, profile management, and ticket cancellation with automated seat release.
- **Administrator Control Suite:** Protected dashboard featuring live KPI metrics (revenue, total bookings, active screenings), movie catalog CRUD, theatre management, conflict-free show scheduling, and booking auditing.
- **Zero-Setup Local Database:** Automatically uses an embedded in-memory MongoDB replica set with automatic seeding if no external database is configured, allowing instant out-of-the-box local execution.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router v7, Vanilla CSS3 Design System, Lucide React Icons, Axios, Canvas Confetti |
| **Backend** | Node.js, Express.js, REST Architecture, JWT (jsonwebtoken), bcryptjs, Helmet, CORS, Morgan |
| **Database** | MongoDB with Mongoose ODM (MongoDB Atlas in production; automatic in-memory fallback for zero-config local dev & tests) |
| **Testing** | Vitest, Supertest, React Testing Library, JSDOM |
| **Deployment** | Vercel (Frontend SPA), Render (Backend API), MongoDB Atlas (Cloud Database) |

---

## 📂 Project Structure

```
IMovies/
├── client/                     # Frontend Single Page Application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Navbar, Footer, MovieCard, SeatMap, TrailerModal, Skeletons
│   │   ├── context/            # AuthContext, BookingContext
│   │   ├── pages/              # 20 required application pages
│   │   ├── services/           # Axios API client
│   │   ├── test/               # Vitest component tests
│   │   ├── App.jsx             # React Router routing & guards
│   │   ├── index.css           # Global cinema design system
│   │   └── main.jsx            # React root mount
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json             # Vercel SPA rewrites
│   └── .env.example
├── server/                     # Backend REST API Server
│   ├── scripts/
│   │   └── seed.js             # Realistic database seeder
│   ├── src/
│   │   ├── config/             # Database connection & memory server fallback
│   │   ├── controllers/        # Auth, Movies, Theatres, Shows, Bookings, Admin
│   │   ├── middleware/         # JWT Auth, Admin guard, Centralized Error, Rate Limiter
│   │   ├── models/             # User, Movie, Theatre, Screen, Show, Booking
│   │   ├── routes/             # Express API route modules
│   │   ├── tests/              # Supertest + Vitest automated test suite
│   │   ├── utils/              # Token generation
│   │   ├── app.js              # Express app setup
│   │   └── server.js           # Server listen & auto-seed hook
│   ├── package.json
│   ├── render.yaml             # Render deployment blueprint
│   └── .env.example
├── docs/                       # Technical Documentation
│   ├── architecture.md         # High-level architecture & diagrams
│   ├── database-design.md      # Schema specifications & relationships
│   ├── api-documentation.md    # Complete REST API endpoint reference
│   └── testing.md              # QA & test execution details
├── package.json                # Root orchestration scripts
├── README.md                   # Project overview & documentation
└── .gitignore                  # Git exclusions
```

---

## ⚡ Quick Start & Local Execution

### Prerequisites
- Node.js (v18 or higher; tested on v24.12.0)
- npm (v9 or higher)

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/imovies.git
cd IMovies

# Install dependencies across both backend and frontend
npm run install:all
```

*(Alternatively, run `npm install` inside both `/server` and `/client` directories).*

### 2. Configure Environment Variables
Copy the example environment files:

```bash
# Backend configuration
cp server/.env.example server/.env

# Frontend configuration
cp client/.env.example client/.env
```

> **Note on Database:** You can leave `MONGODB_URI` blank in `server/.env`. The application will automatically initialize an in-memory MongoDB instance with pre-populated movies, theatres, screenings, and accounts! If you have a MongoDB Atlas connection string, provide it in `MONGODB_URI`.

### 3. Launch the Application

In terminal 1 (Backend API):
```bash
cd server
npm run dev
# Starts on http://localhost:5000
```

In terminal 2 (Frontend Client):
```bash
cd client
npm run dev
# Starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 🔑 Pre-Configured Demo Credentials

The database auto-seeds with the following accounts for immediate testing:

| Role | Email Address | Password | Permissions |
|---|---|---|---|
| **Customer** | `user@imovies.com` | `User@123456` | Book tickets, view history, manage profile |
| **Administrator** | `admin@imovies.com` | `Admin@123456` | Full CRUD on movies, theatres, shows, stats |

*(The login screen also includes one-click autofill buttons for both roles).*

---

## 🧪 Automated Testing

IMovies includes an automated test suite verifying authentication, authorization, seat reservation, and booking concurrency:

```bash
# Run backend API integration tests
npm --prefix server test

# Run frontend component tests
npm --prefix client test

# Run production build verification
npm --prefix client run build
```

### Verified Test Results:
- `server/src/tests/auth.test.js`: 6 tests passed (Registration, duplicate email prevention, login, invalid password rejection, profile access, unauthorized blocking).
- `server/src/tests/booking.test.js`: 4 tests passed (Atomic 8-minute seat hold, double-booking rejection on held seats [409 Conflict], booking confirmation, double-booking rejection on confirmed seats).
- `client/src/test/MovieCard.test.jsx`: 1 test passed (Rendering, metadata display, booking links).
- Production build: Succeeded with 0 warnings.

---

## 📡 REST API Endpoint Summary

Full API contracts are documented in [`docs/api-documentation.md`](docs/api-documentation.md).

- **Health Check:** `GET /api/health`
- **Authentication:**
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `PUT /api/auth/profile`
  - `POST /api/auth/forgot-password`
  - `POST /api/auth/reset-password`
- **Movies:**
  - `GET /api/movies` (search, genre, status, sorting, pagination)
  - `GET /api/movies/featured`
  - `GET /api/movies/now-showing`
  - `GET /api/movies/coming-soon`
  - `GET /api/movies/:idOrSlug`
  - `POST /api/movies` (Admin)
  - `PUT /api/movies/:id` (Admin)
  - `DELETE /api/movies/:id` (Admin)
- **Theatres & Screens:**
  - `GET /api/theatres`
  - `GET /api/theatres/:id`
  - `POST /api/theatres` (Admin)
  - `DELETE /api/theatres/:id` (Admin)
- **Shows & Schedules:**
  - `GET /api/shows` (by movie, theatre, date, city)
  - `GET /api/shows/:id` (real-time seat matrix & live hold release)
  - `POST /api/shows` (Admin, validates screen schedule conflict)
  - `DELETE /api/shows/:id` (Admin)
- **Seat Holds & Bookings:**
  - `POST /api/bookings/hold` (atomically reserves seats for 8 mins)
  - `POST /api/bookings/confirm` (backend price calculation & digital ticket issue)
  - `GET /api/bookings/my` (customer ticket history)
  - `GET /api/bookings/:id` (single ticket with QR code)
  - `POST /api/bookings/:id/cancel` (releases seats back to available pool)
- **Admin Management:**
  - `GET /api/admin/stats` (revenue, booking counters, recent activity)
  - `GET /api/admin/bookings` (audit log of all bookings)
  - `PUT /api/admin/bookings/:id/status` (status override)

---

## 🚀 Production Deployment Guide

### 1. MongoDB Atlas Setup
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Under **Network Access**, allow access from `0.0.0.0/0` (or Render's outbound IPs).
3. Under **Database Access**, create a database user and password.
4. Copy your connection string: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/imovies?retryWrites=true&w=majority`.

### 2. Backend Deployment (Render)
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New Web Service**.
3. Connect your repository and configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Set Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGODB_URI`: `<your-mongodb-atlas-uri>`
   - `JWT_SECRET`: `<secure-random-secret>`
   - `CLIENT_URL`: `https://your-frontend.vercel.app`
5. Click **Deploy Web Service**. Once deployed, copy your backend URL (e.g. `https://imovies-api.onrender.com`).

### 3. Frontend Deployment (Vercel)
1. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Select your repository.
3. Configure settings:
   - **Root Directory:** `client`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Set Environment Variables:
   - `VITE_API_URL`: `https://imovies-api.onrender.com/api`
5. Click **Deploy**. Vercel will build the frontend with SPA rewrite rules (`vercel.json`) handling route refreshes.

---

## 🔒 Security Best Practices Implemented

- Passwords hashed using `bcryptjs` with salt rounds.
- Tokens signed with strong `JWT_SECRET` and expiration.
- Client requests pass through `helmet` for HTTP header security.
- Cross-Origin Resource Sharing (`cors`) restricted to configured client origin.
- Sensitive endpoints protected with sliding window rate limiting.
- Backend prices and discounts calculated strictly on server — never trusts client prices.
- Sensitive credentials excluded from Git via `.gitignore`.

---

## 📄 Documentation Links

- [System Architecture](docs/architecture.md)
- [Database Schema Design](docs/database-design.md)
- [REST API Documentation](docs/api-documentation.md)
- [Testing & Quality Assurance Guide](docs/testing.md)

---

## ⚖️ License
This project is open-source and available under the [MIT License](LICENSE).
