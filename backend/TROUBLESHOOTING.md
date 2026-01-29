# Troubleshooting Guide

## Database Connection Errors

### Error: "SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string"

This error means the database password is not being read correctly from your `.env` file.

#### Quick Fix:

1. **Check if `.env` file exists:**
   ```bash
   cd backend
   ls -la .env  # On Windows: dir .env
   ```

2. **If `.env` doesn't exist, create it:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file and set your actual PostgreSQL password:**
   ```env
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=your_actual_postgres_password  # ⚠️ Change this!
   DB_NAME=news_db
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=5000
   ```

4. **Verify your configuration:**
   ```bash
   npm run check-env
   ```

#### Common Issues:

**Issue 1: Password is empty or not set**
- Make sure `DB_PASSWORD` has a value in your `.env` file
- Don't leave it as `your_password` - use your actual PostgreSQL password

**Issue 2: Password contains special characters**
- If your password has special characters, wrap it in quotes:
  ```env
  DB_PASSWORD="my@password#123"
  ```

**Issue 3: .env file is in wrong location**
- The `.env` file must be in the `backend/` directory
- Not in the root directory or `frontend/` directory

**Issue 4: PostgreSQL is not running**
- Make sure PostgreSQL service is running
- On Windows: Check Services or run `pg_ctl status`
- On Mac/Linux: `sudo systemctl status postgresql` or `brew services list`

**Issue 5: Database doesn't exist**
- Create the database:
  ```bash
  psql -U postgres
  CREATE DATABASE news_db;
  \q
  ```

#### Step-by-Step Verification:

1. **Check environment variables:**
   ```bash
   cd backend
   npm run check-env
   ```

2. **Test PostgreSQL connection manually:**
   ```bash
   psql -U postgres -d news_db
   ```
   If this works, your credentials are correct.

3. **Check PostgreSQL is listening:**
   ```bash
   # On Windows (PowerShell)
   netstat -an | findstr 5432
   
   # On Mac/Linux
   lsof -i :5432
   ```

4. **Verify .env file format:**
   - No spaces around `=`
   - No quotes unless password has special characters
   - Each variable on its own line
   - No trailing spaces

#### Example .env file:

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=mypassword123
DB_NAME=news_db
JWT_SECRET=my_super_secret_jwt_key_at_least_32_characters_long
PORT=5000
```

---

## Other Common Errors

### "relation 'users' does not exist"
**Solution:** Run the database setup:
```bash
npm run setup-db
```

### "password authentication failed"
**Solution:** 
- Check your PostgreSQL password is correct
- Try connecting with psql to verify: `psql -U postgres`

### "database 'news_db' does not exist"
**Solution:** Create the database:
```bash
psql -U postgres
CREATE DATABASE news_db;
\q
```

### "Connection refused"
**Solution:**
- PostgreSQL is not running
- Check PostgreSQL service status
- Verify port 5432 is correct

---

## Still Having Issues?

1. Run the environment checker:
   ```bash
   npm run check-env
   ```

2. Check server logs for detailed error messages

3. Verify PostgreSQL is accessible:
   ```bash
   psql -U postgres -c "SELECT version();"
   ```

4. Check if port 5432 is correct (some installations use 5433)
