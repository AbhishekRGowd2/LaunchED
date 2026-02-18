-- Create admins table for Neon Tech DB
-- Run this SQL script in your Neon Tech database console

CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- After creating the table, you can seed an admin user using the seedAdmin.js script
-- Or manually insert using bcrypt hashed password
