# Admin User Management Scripts

## Create Admin User

Create a new admin user for your news website.

### Usage

**Option 1: Interactive Mode (Recommended)**
```bash
npm run create-admin
```
This will prompt you to enter:
- Username
- Password
- Confirm Password

**Option 2: Command-Line Arguments**
```bash
npm run create-admin <username> <password>
```

**Option 3: Direct Node Command**
```bash
node scripts/create-admin.js <username> <password>
```

### Examples

```bash
# Interactive mode
npm run create-admin

# With arguments
npm run create-admin admin mypassword123

# Direct node command
node scripts/create-admin.js admin mypassword123
```

### Features

- ✅ Validates password strength (minimum 6 characters)
- ✅ Checks if username already exists
- ✅ Option to update password for existing users
- ✅ Properly hashes passwords with bcrypt
- ✅ Secure role assignment (hardcoded to 'admin')
- ✅ Clear success/error messages

### Security Notes

- Passwords are hashed using bcrypt (10 salt rounds)
- Role is hardcoded to 'admin' - cannot be manipulated
- Username must be unique
- Script runs directly against database (bypasses API)

### Troubleshooting

**Error: "User already exists"**
- The script will ask if you want to update the password
- Or use a different username

**Error: "Password must be at least 6 characters"**
- Use a stronger password with at least 6 characters

**Error: Database connection failed**
- Make sure PostgreSQL is running
- Verify `.env` file is configured correctly
- Run `npm run check-env` to verify configuration

---

## Other Available Scripts

### Setup Database
```bash
npm run setup-db
```
Creates database schema and default admin user (username: `admin`, password: `admin123`)

### Check Environment
```bash
npm run check-env
```
Verifies all environment variables are set correctly and tests database connection
