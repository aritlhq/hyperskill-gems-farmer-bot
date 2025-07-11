import {createAccount, getVerificationLink} from './services/mailService.js';
import {register} from './services/hyperskillService.js';

export async function run() {
    try {
        const {mailjs, account} = await createAccount();
        const tempEmail = account.username;
        const hyperskillPassword = `MyStrongPassword${Date.now()}`;

        await register(tempEmail, hyperskillPassword);

        const verificationLink = await getVerificationLink(mailjs);

        console.log('\n✅ --- PROCESS COMPLETED SUCCESSFULLY --- ✅');
        console.log('Registered Email    :', tempEmail);
        console.log('Hyperskill Password:', hyperskillPassword);
        console.log('Verification Link    :', verificationLink);

    } catch (error) {
        console.error('\n❌ *** PROCESS FAILED *** ❌');
        console.error('Cause:', error.message);
    }
}