const pool = require('./config/db');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    const email = 'admin@launchedglobal.in';
    const password = 'adminpassword123'; // Change this!

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.query(
            'INSERT INTO admins (email, password) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING',
            [email, hashedPassword]
        );

        console.log('Admin user seeded successfully');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
