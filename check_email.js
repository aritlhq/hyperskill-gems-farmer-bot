import Mailjs from '@cemalgnlts/mailjs';

/**
 * Use this script to check the inbox of a temporary email account
 * if main script failed to return a verification link.
 */
async function checkInbox() {
    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
        console.error('Error: Email and password must be provided!');
        console.log('How to use: node check_email.js <email> <password>');
        return;
    }

    console.log(`Try logging in to ${email}...`);
    const mailjs = new Mailjs();

    try {
        const loginRes = await mailjs.login(email, password);
        if (!loginRes.status) {
            throw new Error('Failed to log in to temporary email account: ' + loginRes.message);
        }
        console.log('Login successful! Checking the inbox...');

        const messages = await mailjs.getMessages();
        if (messages.data.length === 0) {
            console.log('\n--- RESULTS ---');
            console.log('The inbox is still empty. Try running again in 1-2 minutes.');
        } else {
            console.log(`\n--- FOUND ${messages.data.length} MESSAGE ---`);
            messages.data.forEach((msg, index) => {
                console.log(`\nMessage #${index + 1}`);
                console.log(`  From    : ${msg.from.address}`);
                console.log(`  Subject  : ${msg.subject}`);
                console.log(`  Intro     : ${msg.intro}...`);
            });
        }
    } catch (error) {
        console.error('\n❌ *** PROCESS FAILED *** ❌');
        console.error('Cause:', error.message);
    }
}

checkInbox();