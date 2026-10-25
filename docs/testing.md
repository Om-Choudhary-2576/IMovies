# IMovies Testing & Quality Assurance Strategy

## 1. Testing Strategy Overview
The IMovies quality assurance suite covers both backend and frontend layers:
- **Backend API Integration Tests:** Supertest + Vitest testing live endpoints with an in-memory MongoDB replica set or active connection.
- **Concurrency & Booking Integrity:** Verification of atomic seat holding, prevention of double bookings when concurrent requests attempt to reserve the same seat, and hold expiry.
- **Frontend Component Tests:** Vitest + React Testing Library verifying user workflows, navigation, seat selection, and forms.
- **Smoke & Build Tests:** Production bundling (`vite build`) and server syntax verification.

## 2. Test Execution Commands

```bash
# Run all tests across workspace
npm test

# Run backend tests only
npm --prefix server test

# Run frontend tests only
npm --prefix client test

# Run production build check
npm --prefix client run build
```

## 3. Critical Test Scenarios

### Authentication & Authorization
- Customer registration with email validation and password hashing.
- Duplicate email registration rejection.
- Login with correct password vs incorrect password rejection.
- Protected endpoints return 401 Unauthorized without token.
- Admin endpoints return 403 Forbidden for non-admin users.

### Seat Reservation & Concurrency
- Successful 8-minute seat hold for available seats.
- Attempting to reserve an already held seat returns 409 Conflict.
- Simulating two simultaneous requests for the exact same seat: exactly one succeeds and the other is safely rejected.
- Holding expired seats allows subsequent users to reclaim them.
- Booking cancellation returns seats to `AVAILABLE`.

### Movies & Theatres
- Filtering movies by genre, status (`NOW_SHOWING`), and search keyword.
- Scheduling shows on overlapping time slots on the same screen returns 409 Conflict.
