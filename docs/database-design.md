# IMovies Database Design

## 1. Entity-Relationship Overview

IMovies utilizes MongoDB with Mongoose ODM. Schemas are designed with referential integrity, strong type validations, and compound indexes to optimize query performance and ensure ticket consistency.

```
       +------------------+
       |       User       |
       +--------+---------+
                | 1
                |
                | has many
                v *
       +------------------+             +------------------+
       |     Booking      | * ------ 1  |       Show       |
       +------------------+             +--------+---------+
                                                 |
                                     +-----------+-----------+
                                     | 1                     | 1
                                     v                       v
                           +------------------+    +------------------+
                           |      Movie       |    |     Theatre      |
                           +------------------+    +--------+---------+
                                                            | 1
                                                            | has many
                                                            v *
                                                   +------------------+
                                                   |      Screen      |
                                                   +------------------+
```

---

## 2. Collections & Schema Details

### 2.1 User (`users`)
Stores registered customer accounts and administrators.
- `_id`: ObjectId
- `name`: String (required, trimmed)
- `email`: String (required, unique, lowercase, trimmed, indexed)
- `password`: String (bcrypt hashed, min 6 chars)
- `role`: String (`'user'` | `'admin'`, default `'user'`, indexed)
- `phone`: String (optional)
- `resetPasswordToken`: String (hashed)
- `resetPasswordExpires`: Date
- `createdAt`, `updatedAt`: Timestamps

### 2.2 Movie (`movies`)
Stores film catalog information with publication status.
- `_id`: ObjectId
- `title`: String (required, trimmed, indexed)
- `slug`: String (required, unique, indexed)
- `description`: String (required)
- `posterUrl`: String (required URL)
- `backdropUrl`: String (required URL)
- `genres`: [String] (e.g. `['Action', 'Sci-Fi']`, indexed)
- `language`: String (e.g. `'English'`, `'Spanish'`, indexed)
- `duration`: Number (minutes, e.g. `148`)
- `releaseDate`: Date (required)
- `cast`: [String]
- `director`: String
- `certification`: String (`'U'`, `'UA'`, `'PG-13'`, `'R'`, etc.)
- `rating`: Number (0.0 to 10.0, default 8.5)
- `votesCount`: Number (default 0)
- `trailerUrl`: String
- `status`: String (`'NOW_SHOWING'` | `'COMING_SOON'` | `'INACTIVE'`, default `'NOW_SHOWING'`, indexed)
- `createdAt`, `updatedAt`: Timestamps

### 2.3 Theatre (`theatres`)
Physical cinema complexes.
- `_id`: ObjectId
- `name`: String (required, indexed)
- `city`: String (required, indexed)
- `address`: String (required)
- `location`: { lat: Number, lng: Number }
- `amenities`: [String] (e.g. `['Parking', 'Dolby Atmos', 'Recliners', 'Food Court', 'Wheelchair Access']`)
- `screens`: [ScreenSchema]
- `isActive`: Boolean (default true)
- `createdAt`, `updatedAt`: Timestamps

### 2.4 Screen (`theatres.screens` / subdocument)
Screens within a theatre.
- `_id`: ObjectId
- `screenNumber`: Number (required)
- `name`: String (e.g. `'Screen 1 - IMAX'`)
- `screenType`: String (`'IMAX'` | `'4DX'` | `'Dolby Cinema'` | `'Standard'`)
- `totalRows`: Number (e.g. `8`, letters A-H)
- `seatsPerRow`: Number (e.g. `12`)
- `totalSeats`: Number

### 2.5 Show (`shows`)
Specific movie screening on a particular screen at a given date/time.
- `_id`: ObjectId
- `movie`: ObjectId (ref: `'Movie'`, required, indexed)
- `theatre`: ObjectId (ref: `'Theatre'`, required, indexed)
- `screenId`: ObjectId (required)
- `screenName`: String
- `screenType`: String
- `date`: String (Format: `YYYY-MM-DD`, indexed)
- `startTime`: String (e.g. `'18:30'`, indexed)
- `endTime`: String (e.g. `'21:00'`)
- `tierPricing`: {
    `standard`: Number (e.g. 12.00),
    `premium`: Number (e.g. 16.00),
    `vip`: Number (e.g. 22.00)
  }
- `seats`: [{
    `seatNumber`: String (e.g. `'D7'`),
    `row`: String (e.g. `'D'`),
    `column`: Number (e.g. 7),
    `tier`: String (`'standard'` | `'premium'` | `'vip'`),
    `price`: Number,
    `status`: String (`'AVAILABLE'` | `'HELD'` | `'BOOKED'`),
    `heldBy`: ObjectId (ref: `'User'`),
    `holdExpiresAt`: Date
  }]
- `status`: String (`'ACTIVE'` | `'CANCELLED'` | `'COMPLETED'`, default `'ACTIVE'`)
- Compound Index: `{ theatre: 1, screenId: 1, date: 1, startTime: 1 }` (Prevents conflicting screen schedules)

### 2.6 Booking (`bookings`)
Records confirmed or in-progress ticket reservations.
- `_id`: ObjectId
- `bookingReference`: String (Unique, e.g. `IM-9834-4821`, indexed)
- `user`: ObjectId (ref: `'User'`, required, indexed)
- `show`: ObjectId (ref: `'Show'`, required, indexed)
- `movie`: { id: ObjectId, title: String, posterUrl: String, duration: Number, language: String }
- `theatre`: { id: ObjectId, name: String, city: String, screenName: String }
- `showDetails`: { date: String, startTime: String }
- `seats`: [{ seatNumber: String, row: String, column: Number, tier: String, price: Number }]
- `subtotal`: Number
- `convenienceFee`: Number
- `tax`: Number
- `discount`: Number
- `totalAmount`: Number
- `bookingStatus`: String (`'CONFIRMED'` | `'CANCELLED'`, default `'CONFIRMED'`, indexed)
- `paymentStatus`: String (`'SUCCESS'` | `'PENDING'` | `'FAILED'` | `'REFUNDED'`, default `'SUCCESS'`)
- `paymentMethod`: String (e.g. `'Card'`, `'PayPal'`, `'MockDevPayment'`)
- `paymentTransactionId`: String
- `qrCode`: String (base64 data URL representing cryptographic verification token)
- `createdAt`, `updatedAt`: Timestamps
