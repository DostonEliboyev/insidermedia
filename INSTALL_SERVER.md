# How to Install & Run the News Server

This guide walks you through installing and running the **backend server** (API) and **frontend** for the News website on your computer.

---

## What You Need First

1. **Node.js** (v16 or newer) — [Download](https://nodejs.org/)
2. **PostgreSQL** — [Download](https://www.postgresql.org/download/)
3. **npm** — comes with Node.js (no separate install)

---

## Part 1: Install the Backend Server

### Step 1: Open a terminal in the project folder

- **Windows:** Open PowerShell or Command Prompt, then:
  ```powershell
  cd C:\Users\Doston\Desktop\news\backend
  ```

### Step 2: Install backend dependencies

```bash
npm install
```

This installs Express, PostgreSQL client, JWT, bcrypt, multer, etc.

### Step 3: Create the `.env` file

Copy the example file and edit it with your settings:

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**Mac/Linux:**
```bash
cp .env.example .env
```

Then open `.env` in a text editor and set:

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
DB_NAME=news_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

- Replace `YOUR_POSTGRES_PASSWORD` with the password you set when you installed PostgreSQL.
- Replace `JWT_SECRET` with a long random string (e.g. `mySecretKey123!@#`) — use something stronger in production.

### Step 4: Create the database in PostgreSQL

1. Open **pgAdmin** (if you use it) or the **psql** command line.
2. Create a database named `news_db`.

**Using psql (Windows):**
```powershell
psql -U postgres
```

Then in the psql prompt:
```sql
CREATE DATABASE news_db;
\q
```

**Using pgAdmin:** Right-click **Databases** → **Create** → **Database** → Name: `news_db` → Save.

### Step 5: Set up tables and admin user

In the **backend** folder run:

```bash
npm run setup-db
```

This creates the `users` and `news` tables and adds a default admin user.

**If the database already existed before language support was added, also run:**
```bash
npm run migrate-language
```

**Default admin login:**
- Username: `admin`
- Password: `admin123`  
*(Change this after first login in production!)*

### Step 6: (Optional) Check that the server can connect

```bash
npm run check-env
```

If you see “Connected to PostgreSQL database”, your `.env` and database are set up correctly.

### Step 7: Start the backend server

**Development (with auto-restart):**
```bash
npm run dev
```

**Production (no auto-restart):**
```bash
npm start
```

You should see something like: **Server running on port 5000**.

The API is now available at: **http://localhost:5000**

- Example: `http://localhost:5000/api/news` — list of news.

---

## Part 2: Install & Run the Frontend

### Step 1: Open a new terminal

Keep the backend running in the first terminal. Open a **second** terminal.

### Step 2: Go to the frontend folder

```powershell
cd C:\Users\Doston\Desktop\news\frontend
```

### Step 3: Install frontend dependencies

```bash
npm install
```

### Step 4: (Optional) Set frontend environment

If your API is not on `http://localhost:5000`, create a `.env` in the **frontend** folder:

```env
VITE_API_URL=http://localhost:5000/api
```

If you skip this, the app uses `http://localhost:5000/api` by default.

### Step 5: Start the frontend

```bash
npm run dev
```

You should see a local URL, e.g. **http://localhost:5173**. Open it in your browser.

---

## Quick Reference: Run Everything

| What              | Where     | Command        |
|-------------------|-----------|----------------|
| Backend (API)     | `backend/`| `npm run dev`  |
| Frontend (site)  | `frontend/`| `npm run dev` |

1. Terminal 1: `cd backend` → `npm run dev`
2. Terminal 2: `cd frontend` → `npm run dev`
3. Browser: open **http://localhost:5173**

---

## Common Issues

### “SASL: client password must be a string”
- In `.env`, set `DB_PASSWORD=your_actual_password` (as a string, no quotes).
- Run `npm run check-env` in the backend folder.

### “column 'language' does not exist”
- Run in backend: `npm run migrate-language`

### “ECONNREFUSED” or frontend can’t load news
- Make sure the **backend** is running (`npm run dev` in `backend/`).
- Check that `VITE_API_URL` in frontend points to `http://localhost:5000/api` (or your API URL).

### Port 5000 or 5173 already in use
- Close other apps using that port, or change `PORT` in backend `.env` (e.g. 5001) and `VITE_API_URL` in frontend accordingly.

---

## Production (Deploying to a Real Server)

- Use a process manager (e.g. **PM2**) to run the backend: `pm2 start server.js --name news-api`
- Use a reverse proxy (e.g. **Nginx**) for the frontend and API.
- Set strong `JWT_SECRET` and change the default admin password.
- Use environment variables for all secrets; never commit `.env` to Git.

For more details, see the main **README.md** in the project root.
