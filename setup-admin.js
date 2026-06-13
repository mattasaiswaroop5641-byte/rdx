const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');

async function generateAdminCredentials() {
    const email = 'mattasaiswaroop5641@gmail.com';
    const password = 'Mgsai1042';

    // 1. Hash the password securely
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 2. Generate a 2FA Secret for Google Authenticator
    const secret = speakeasy.generateSecret({ 
        name: `RDX Admin (${email})` 
    });

    console.log('\n========================================================');
    console.log('✅ ADMIN CREDENTIALS GENERATED SUCCESSFULLY');
    console.log('========================================================\n');

    console.log('STEP 1: Copy and paste these exact lines into your backend .env file:\n');
    console.log(`ADMIN_EMAIL=${email}`);
    console.log(`ADMIN_PASSWORD_HASH=${passwordHash}`);
    console.log(`ADMIN_2FA_SECRET=${secret.base32}`);
    
    console.log('\n--------------------------------------------------------\n');
    console.log('STEP 2: Open Google Authenticator on your phone.');
    console.log('Tap the "+" button and select "Enter a setup key".');
    console.log(`Account Name: RDX Admin`);
    console.log(`Your Key:     ${secret.base32}`);
    console.log(`Type of Key:  Time-based (TOTP)\n`);
    console.log('========================================================\n');
}

generateAdminCredentials();