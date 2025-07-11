import readline from 'readline';
import {createAccount, getVerificationLink} from './services/mailService.js';
import {register} from './services/hyperskillService.js';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to ask a question in the console
function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}

export async function run() {
    const numAccountsStr = await askQuestion('How many accounts would you like to create? ');
    const numberOfAccounts = parseInt(numAccountsStr, 10);

    if (isNaN(numberOfAccounts) || numberOfAccounts <= 0) {
        console.error('Invalid input. Please enter a number greater than 0.');
        return;
    }

    console.log(`\nAlright, starting the process to create ${numberOfAccounts} account(s).`);

    for (let i = 1; i <= numberOfAccounts; i++) {
        console.log(`\n===========================================`);
        console.log(`🚀 Starting creation for account #${i} of ${numberOfAccounts}...`);
        console.log(`===========================================`);

        try {
            const {mailjs, account} = await createAccount();
            const tempEmail = account.username;
            const hyperskillPassword = `MyStrongPassword${Date.now()}`;

            await register(tempEmail, hyperskillPassword);

            const verificationLink = await getVerificationLink(mailjs);

            console.log(`\n✅ --- Account #${i} Created Successfully --- ✅`);
            console.log('   Registered Email   :', tempEmail);
            console.log('   Hyperskill Password:', hyperskillPassword);
            console.log('   Verification Link  :', verificationLink);

        } catch (error) {
            console.error(`\n❌ *** FAILED to create account #${i} *** ❌`);
            console.error('   Cause:', error.message);
        }

        if (i < numberOfAccounts) {
            console.log(`\n⏳ Pausing for 5 seconds before creating the next account...`);
            await delay(5000); // 5000 milliseconds = 5 seconds
        }
    }

    console.log('\n\n🎉 All account creation processes are complete.');
}