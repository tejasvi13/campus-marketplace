# Campus Marketplace

Student resource exchange platform for a single college.

**Stage 1 covers Module 1 only: user authentication.** 

---

## What is built

- A landing screen with the project title, a one line introduction and the sign in form
- Registration, restricted to `@student.edu` addresses
- OTP verification, printed in the backend terminal instead of being e-mailed
- Login, which pushes unverified accounts to the OTP screen with a fresh code
- A placeholder home screen after sign in

Passwords and e-mail addresses are stored as plain text on purpose, so everything
is visible while you build. Hashing comes later.

---

## Folders

```
campus-marketplace/
├── backend/
│   ├── config/db.js              MongoDB connection
│   ├── models/User.js            User schema, including the OTP fields
│   ├── controllers/authController.js
│   ├── routes/authRoutes.js
│   ├── utils/allowedEmail.js     which addresses may register
│   ├── utils/otp.js              generate, expire and print the code
│   ├── seed/seedUser.js          creates the one existing student
│   └── server.js
└── frontend/
    └── src/
        ├── api/auth.js           every call to the backend
        ├── components/           AuthLayout, Field, Notice, OtpInput
        ├── pages/                Login, Register, VerifyOtp, Home
        ├── App.jsx               routes
        └── styles.css
```

---

## Running it

You need Node.js and MongoDB installed and running.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # on Windows: copy .env.example .env
npm run seed              # creates jtejasvi@student.edu
npm run dev
```

The server starts on `http://localhost:5000`. **Keep this terminal visible —
every OTP is printed here.**

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## The account that already exists

| Field | Value |
| --- | --- |
| Name | J Tejasvi |
| Register number | 2026 |
| E-mail | jtejasvi@student.edu |
| Password | tejasvi123 |
| Verified | yes |

Created by `npm run seed`. Running the seed again refreshes it rather than
creating a duplicate.

---

## Testing the flow

1. Sign in as `jtejasvi@student.edu` / `tejasvi123`. You land on the home screen.
2. Sign out and register a new account, for example `meena@student.edu`.
3. Look at the backend terminal. The code is printed in a small box.
4. Type it into the six boxes and verify, then sign in.
5. Try registering `someone@gmail.com`. It is rejected.

---

## Changing who is allowed to register

Open `backend/utils/allowedEmail.js`.

```js
const ALLOWED_DOMAINS = ["student.edu"];
```

Add a domain to the first list to accept everyone at that domain. 

---

## API

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an unverified account and print an OTP |
| POST | `/api/auth/verify-otp` | Check the code and mark the account verified |
| POST | `/api/auth/resend-otp` | Print a new code |
| POST | `/api/auth/login` | Sign in, or ask for verification first |
| GET | `/api/health` | Check the server is up |

---

