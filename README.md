# News Website

A modern, production-ready news website built with React, Node.js, and PostgreSQL. Similar to Kun.uz, featuring frequently updated content and a clean UX/UI.

## Tech Stack

### Frontend
- **React** (Vite)
- **Redux Toolkit** (with async thunks)
- **TailwindCSS**
- **React Router**
- **React Helmet** (SEO)
- **React Quill** (Rich text editor)

### Backend
- **Node.js**
- **Express.js**
- **PostgreSQL**
- **JWT** (Authentication)
- **bcrypt** (Password hashing)
- **Multer** (File uploads)
- **express-validator** (Request validation)

## Features

- 🌍 **Multi-language support**: Russian, Uzbek, and English
- 📰 Latest news display with pagination
- 🏷️ Category-based news filtering (Uzbekistan, Education, Finance, Auto, World)
- 🔍 SEO-friendly URLs with unique slugs
- 👤 Admin authentication with JWT
- ✏️ Admin dashboard for CRUD operations
- 📝 Rich text editor for news content
- 📸 Image upload functionality
- 📱 Fully responsive design
- ⚡ Skeleton loaders and loading states
- 🔒 Protected admin routes
- 🌐 Language switcher in header

## Project Structure

```
news/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── newsController.js
│   ├── database/
│   │   ├── schema.sql
│   │   └── seed.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── upload.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── newsRoutes.js
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   └── store.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Installation & Setup

> **Step-by-step guide:** See **[INSTALL_SERVER.md](INSTALL_SERVER.md)** for a full walkthrough of how to install and run the server (backend + frontend) on your machine.

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=news_db
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=5000
   ```

4. **Create PostgreSQL database:**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE news_db;
   \q
   ```

5. **Set up database schema and seed admin user:**
   ```bash
   # Option 1: Use the setup script (recommended)
   npm run setup-db
   
   # Option 2: Manual setup
   psql -U postgres -d news_db -f database/schema.sql
   node database/seed.js
   ```
   
   **For existing databases, add language support:**
   ```bash
   npm run migrate-language
   ```
   
   Default admin credentials:
   - Username: `admin`
   - Password: `admin123`
   
   **Important:** Change the default password in production!

   **Create additional admin users:**
   ```bash
   # Interactive mode (recommended)
   npm run create-admin
   
   # Or with arguments
   npm run create-admin <username> <password>
   ```

7. **Start the backend server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables (optional):**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` if you need to change the API URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

5. **Build for production:**
   ```bash
   npm run build
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### News (Public)
- `GET /api/news` - Get all news (with pagination: `?page=1&limit=10`)
- `GET /api/news/:slug` - Get news by slug
- `GET /api/news/category/:category` - Get news by category (with pagination)

### News (Admin Only - Requires JWT Token)
- `POST /api/news` - Create news (multipart/form-data)
- `PUT /api/news/:id` - Update news (multipart/form-data)
- `DELETE /api/news/:id` - Delete news

**Note:** Admin endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Usage

### Admin Login

1. Navigate to `http://localhost:3000/admin/login`
2. Login with default credentials:
   - Username: `admin`
   - Password: `admin123`

### Creating News

1. After logging in, go to Admin Dashboard
2. Click "Create New News"
3. Fill in the form:
   - Title
   - Short Description
   - Category
   - Image (optional)
   - Content (using rich text editor)
4. Click "Create News"

### Editing/Deleting News

1. In Admin Dashboard, find the news item
2. Click "Edit" to modify or "Delete" to remove

## Database Schema

### Users Table
```sql
- id (SERIAL PRIMARY KEY)
- username (VARCHAR, UNIQUE)
- password (VARCHAR - hashed)
- role (VARCHAR, default: 'admin')
- created_at (TIMESTAMP)
```

### News Table
```sql
- id (SERIAL PRIMARY KEY)
- title (VARCHAR)
- slug (VARCHAR, UNIQUE)
- short_description (TEXT)
- content (TEXT - HTML)
- category (VARCHAR)
- image_url (VARCHAR)
- created_at (TIMESTAMP)
```

## Security Features

- **XSS Protection**: HTML sanitization on frontend (DOMPurify) and backend (sanitize-html)
- **Privilege Escalation Prevention**: Database constraints + middleware blocking role manipulation
- **JWT-based authentication**: Secure token-based auth
- **Password hashing**: bcrypt with salt rounds
- **Role-based access control**: Admin-only endpoints protected
- **Request validation**: express-validator for input validation
- **File upload validation**: Images only, 5MB limit
- **CORS enabled**: Cross-origin protection
- **SQL injection protection**: Parameterized queries
- **No public user registration**: Admin creation only through secure seed scripts

**⚠️ Important**: See `SECURITY_FIXES.md` for detailed security documentation.

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Configure proper CORS origins
4. Use a process manager like PM2
5. Set up reverse proxy (nginx)

### Frontend
1. Build the project: `npm run build`
2. Serve the `dist` folder with a web server (nginx, Apache)
3. Configure API proxy if needed

### Database
1. Use connection pooling in production
2. Set up regular backups
3. Configure proper indexes (already included in schema)

## Troubleshooting

### Database Connection Issues

**Error: "SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string"**

This means your database password is not configured correctly. Quick fix:

1. **Create/check `.env` file:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edit `.env` and set your PostgreSQL password:**
   ```env
   DB_PASSWORD=your_actual_postgres_password
   ```

3. **Verify configuration:**
   ```bash
   npm run check-env
   ```

**Other common issues:**
- Verify PostgreSQL is running
- Check `.env` file is in `backend/` directory
- Ensure database exists: `CREATE DATABASE news_db;`
- See `backend/TROUBLESHOOTING.md` for detailed help

### Image Upload Issues
- Check `backend/uploads/` directory exists
- Verify file size is under 5MB
- Ensure file is an image format

### CORS Issues
- Verify backend CORS is configured
- Check API URL in frontend `.env`

## License

ISC

## Author

Built with ❤️ for modern news websites
