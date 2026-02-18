# Admin Setup Instructions

## Step 1: Create the Admins Table in Neon Tech DB

1. Log in to your Neon Tech dashboard
2. Navigate to your database console/SQL editor
3. Run the SQL script from `backend/database/create_admins_table.sql`:

```sql
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
```

## Step 2: Seed an Admin User

After creating the table, you can create an admin user in two ways:

### Option A: Using the Seed Script (Recommended)

1. Make sure you have your `.env` file configured with `DATABASE_URL`
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies if not already installed:
   ```bash
   npm install
   ```
4. Run the seed script:
   ```bash
   node seedAdmin.js
   ```

This will create an admin user with:
- **Email**: `admin@launchedglobal.in`
- **Password**: `adminpassword123`

**⚠️ IMPORTANT**: Change the password in production!

### Option B: Manual SQL Insert (Alternative)

If you prefer to create an admin manually, you'll need to hash the password using bcrypt. You can use an online bcrypt generator or create a simple Node.js script:

```javascript
const bcrypt = require('bcryptjs');
const password = 'your-secure-password';
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
console.log(hashedPassword);
```

Then insert into the database:
```sql
INSERT INTO admins (email, password) 
VALUES ('admin@example.com', '<hashed-password-from-above>');
```

## Step 3: Update Admin Credentials

To change the default admin credentials in `seedAdmin.js`:

1. Open `backend/seedAdmin.js`
2. Update the `email` and `password` variables
3. Run the script again (it uses `ON CONFLICT DO NOTHING`, so it won't duplicate)

## Step 4: Test Admin Login

1. Start your backend server
2. Navigate to the frontend admin login page: `/admin/login`
3. Use the credentials you created to log in
4. You should be redirected to `/admin/dashboard` upon successful login

## Troubleshooting

- **"Invalid email or password"**: Make sure the admins table exists and contains a user with the correct email
- **Database connection errors**: Verify your `DATABASE_URL` in `.env` is correct
- **Table already exists**: The script uses `IF NOT EXISTS`, so it's safe to run multiple times
