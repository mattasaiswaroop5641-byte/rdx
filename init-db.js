require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function initializeDatabase() {
    try {
        console.log("Connecting to PostgreSQL...");

        // 1. Create all necessary tables
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS orders (
                id VARCHAR(50) PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                amount_paid VARCHAR(50),
                payment_status VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS tickets (
                id VARCHAR(50) PRIMARY KEY,
                "user" VARCHAR(255),
                subject VARCHAR(255),
                status VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS logs (
                id SERIAL PRIMARY KEY,
                time VARCHAR(50),
                action VARCHAR(255),
                target VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS coupons (
                id SERIAL PRIMARY KEY,
                code VARCHAR(50) UNIQUE NOT NULL,
                discount_percentage INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("✅ Database tables created successfully.");

        // 2. Inject some mock data if the database is empty
        const userCheck = await pool.query('SELECT * FROM users LIMIT 1');
        if (userCheck.rows.length === 0) {
            console.log("Injecting test data so the dashboard shows output...");
            await pool.query(`INSERT INTO users (email) VALUES ('admin@rdx.com'), ('customer@test.com')`);
            await pool.query(`INSERT INTO orders (id, user_id, amount_paid, payment_status) VALUES ('ORD-9999', 1, '₹1500', 'Completed'), ('ORD-8888', 2, '₹4999', 'Pending')`);
            await pool.query(`INSERT INTO tickets (id, "user", subject, status) VALUES ('#5001', 'customer@test.com', 'Help with bot setup', 'Open')`);
            await pool.query(`INSERT INTO logs (time, action, target) VALUES ('12:00 PM', 'System Boot', 'Server'), ('12:05 PM', 'Admin Login', 'admin@rdx.com')`);
            await pool.query(`INSERT INTO coupons (code, discount_percentage) VALUES ('RDXLAUNCH', 20)`);
            console.log("✅ Test data injected!");
        } else {
            console.log("✨ Data already exists in tables. Ready to go!");
        }

    } catch (error) {
        console.error("❌ Database Error:", error.message);
        console.log("\nMake sure you have PostgreSQL installed locally, and your DATABASE_URL in the .env file is correct!");
    } finally {
        await pool.end();
        process.exit();
    }
}

initializeDatabase();