# Campus Marketplace

Student resource exchange platform for a single college.

**Module 1 only: user authentication.**

- Stage 1: built in plain JavaScript and JSX
- Stage 2: converted to TypeScript. Same logic, same routes, same screens.

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
│   ├── tsconfig.json
│   ├── config/db.ts              MongoDB connection
│   ├── models/User.ts            IUser interface + schema
│   ├── controllers/authController.ts
│   ├── routes/authRoutes.ts
│   ├── utils/allowedEmail.ts     which addresses may register
│   ├── utils/otp.ts              generate, expire and print the code
│   ├── seed/seedUser.ts          creates the one existing student
│   └── server.ts
└── frontend/
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    └── src/
        ├── types.ts              shapes shared across the screens
        ├── api/auth.ts           every call to the backend + ApiError
        ├── components/           AuthLayout, Field, Notice, OtpInput
        ├── pages/                Login, Register, VerifyOtp, Home
        ├── App.tsx               routes
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

The server starts on `http://localhost:5555`. **Keep this terminal visible —
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
| Register number | 2026611028 |
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
const ALLOWED_EMAILS = [];
```

Add a domain to the first list to accept everyone at that domain. Add a full
address to the second list to allow one specific person, which is handy if you
want to test with your own Gmail.

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

## TypeScript notes

Both halves are type checked separately:

```bash
cd backend  && npm run typecheck
cd frontend && npm run typecheck
```

`npm run dev` on the backend uses `ts-node-dev`, so there is no build step
while developing. `npm run build` compiles to `backend/dist/`, and `npm start`
runs the compiled output.

Where the types live:

| File | What it describes |
| --- | --- |
| `backend/models/User.ts` | `IUser` — one user document |
| `backend/controllers/authController.ts` | `PublicUser` and the four request bodies |
| `frontend/src/types.ts` | `User`, `AuthResponse`, the form shapes, router state |
| `frontend/src/api/auth.ts` | `ApiError`, a class extending `Error` |

## Next stages

- Stage 3: Module 2, profile management
- Stage 4: Module 3, listings
