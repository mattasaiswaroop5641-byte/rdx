const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');

// Temporary in-memory store for OTPs until database is connected fully
const otpStore = new Map();

exports.signup = async (req, res) => {
    res.json({ message: 'User registered successfully!' });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    // TODO: Verify credentials against PostgreSQL DB here
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in memory (Expire after 5 mins in production!)
    otpStore.set(email, otp);
    
    // Mock Email Send - Look at your terminal console!
    console.log('\n=============================================');
    console.log(`✉️ EMAIL SENT TO: ${email}`);
    console.log(`🔐 YOUR RDX OTP IS: ${otp}`);
    console.log('=============================================\n');
    
    res.json({ message: 'OTP sent to your email.' });
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    
    if (otpStore.get(email) === otp) {
        otpStore.delete(email); // Clear OTP after successful use
        
        const token = jwt.sign({ email, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.json({ token, message: 'Login successful' });
    } else {
        res.status(401).json({ error: 'Invalid or expired OTP' });
    }
};

exports.adminLogin = async (req, res) => {
    try {
        const { email, password, token2fa } = req.body;
        
        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH || !process.env.ADMIN_2FA_SECRET) {
            console.error("Missing .env variables for admin login!");
            return res.status(500).json({ error: 'Server configuration error. Check .env' });
        }

        if (email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Allow login even if the .env file has the plain text password instead of a hash
        const isPasswordValid = process.env.ADMIN_PASSWORD_HASH.startsWith('$2b$') 
            ? await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)
            : password === process.env.ADMIN_PASSWORD_HASH;
            
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const is2faValid = speakeasy.totp.verify({
            secret: process.env.ADMIN_2FA_SECRET.trim(),
            encoding: 'base32',
            token: token2fa,
            window: 1 // Forgives slight 30-second delays in the Google Auth clock
        });

        if (!is2faValid) {
            return res.status(401).json({ error: 'Invalid 2FA code' });
        }

        const jwtSecret = process.env.JWT_SECRET || 'super_secret_fallback_key_123';
        const token = jwt.sign({ role: 'admin' }, jwtSecret, { expiresIn: '8h' });
        res.json({ token, message: 'Admin logged in successfully' });
    } catch (error) {
        console.error("Admin Login Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};