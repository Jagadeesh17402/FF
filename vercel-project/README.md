# Tasks & Notes — Vercel-Ready with Authentication

A modern task and note management app with full JWT authentication, ready to deploy on **Vercel** + **Neon (PostgreSQL)**.

---

## 🚀 Deploy in 5 Steps

### Step 1 — Get a Free PostgreSQL Database (Neon)

1. Go to **[neon.tech](https://neon.tech)** → Sign up free (use GitHub login)
2. Click **"New Project"** → name it anything (e.g. `taskapp`)
3. Click **"Connect"** → copy the **Connection String**:
   ```
   postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
   Save this — you'll need it in Step 4.

---

### Step 2 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
# Create a new repo at github.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

### Step 3 — Import to Vercel

1. Go to **[vercel.com](https://vercel.com)** → Log in with GitHub
2. Click **"Add New" → "Project"**
3. Find your GitHub repo → click **"Import"**
4. Settings to confirm:
   - **Framework Preset:** `Vite` ✅
   - **Build Command:** `npm run build` ✅
   - **Output Directory:** `dist` ✅
   - **Root Directory:** leave as `/` ✅

---

### Step 4 — Add Environment Variables on Vercel

Before clicking Deploy, expand **"Environment Variables"** and add:

| Name | Value |
|---|---|
| `VITE_API_URL` | `/api` |
| `DATABASE_URL` | your Neon connection string from Step 1 |
| `JWT_SECRET` | a long random string (see below) |
| `JWT_EXPIRES_IN` | `7d` |

**Generate a JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

### Step 5 — Deploy! 🎉

Click **"Deploy"**. Vercel will:
- Build the React frontend
- Deploy the Express API as serverless functions
- Connect everything automatically

Your live URL will be: `https://your-app-name.vercel.app`

Every `git push` to `main` auto-deploys. ✅

---

## 💻 Run Locally

### Prerequisites
- Node.js 18+
- A Neon account (or any PostgreSQL database)

### Setup

```bash
# 1. Clone and install frontend deps
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd your-repo
npm install

# 2. Frontend environment
cp .env.example .env
# Edit .env:
#   VITE_API_URL=http://localhost:5000/api

# 3. Install API deps
cd api
npm install

# 4. API environment
cp .env.example .env
# Edit api/.env:
#   DATABASE_URL=postgresql://...  (your Neon connection string)
#   JWT_SECRET=your_secret
#   JWT_EXPIRES_IN=7d

# 5. Start API server
node server.js
# or with auto-reload: npx nodemon server.js

# 6. In a new terminal, start frontend
cd ..
npm run dev
```

Open **http://localhost:5173** — you'll be redirected to `/login`.

---

## 🏗️ Project Structure

```
your-repo/
├── src/                          # React frontend (original + auth)
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthForm.jsx      ← shared auth card
│   │   └── ...                   (original — unchanged)
│   ├── contexts/
│   │   ├── AuthContext.jsx       ← auth state & API calls
│   │   └── ThemeContext.jsx      (original — unchanged)
│   ├── pages/
│   │   ├── Login.jsx             ← login page
│   │   └── Signup.jsx            ← signup page
│   ├── App.jsx                   ✅ UNCHANGED
│   ├── AppRouter.jsx             ← auth routing wrapper
│   └── main.jsx                  (entry — swaps App → AppRouter)
│
├── api/                          # Express backend (Vercel serverless)
│   ├── auth/
│   │   ├── authMiddleware.js     ← JWT verification
│   │   ├── loginController.js    ← login handler
│   │   └── registerController.js ← register handler
│   ├── models/
│   │   └── User.js               ← PostgreSQL user model
│   ├── routes/
│   │   └── authRoutes.js         ← Express routes
│   ├── server.js                 ← Express app (exported, no listen)
│   ├── package.json
│   └── .env.example
│
├── vercel.json                   ← Vercel build + routing config
├── .env.example                  ← Frontend env template
└── package.json                  ← Frontend deps (Vite, React, etc.)
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Create account |
| `POST` | `/api/auth/login` | No | Login, get JWT |
| `GET` | `/api/auth/me` | Bearer JWT | Get current user |
| `GET` | `/api/health` | No | Health check |

---

## 🗄️ Database Schema

```sql
CREATE TABLE users (
  user_id       SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,        -- bcrypt, never plain text
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

The table is **auto-created** on first API call — no manual migrations needed.

---

## 🔐 Security Features

- Passwords hashed with **bcrypt** (cost factor 12)
- **JWT** tokens with configurable expiry (default 7 days)
- Duplicate email prevention
- Generic login error messages (prevents user enumeration)
- Protected routes — unauthenticated users redirected to `/login`

---

## ⚙️ Environment Variables

### Frontend (root `.env`)
| Variable | Local Value | Vercel Value |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` | `/api` |

### Backend (`api/.env`)
| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (from Neon) |
| `JWT_SECRET` | Long random string for signing tokens |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`, `24h`) |

---

**Built with ❤️ — React + Vite + Express + Neon PostgreSQL + Vercel**
