import Mailjs from '@cemalgnlts/mailjs';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function createAccount() {
    console.log('1. Create a temporary email account with mail.tm...');
    const mailjs = new Mailjs();
    const result = await mailjs.createOneAccount();
    if (!result.status) throw new Error('Failed to create mail.tm account: ' + result.message);

    const accountInfo = result.data;
    console.log(`   -> Email created: ${accountInfo.username}`);
    return {mailjs, account: accountInfo};
}

export async function getVerificationLink(mailjs) {
    console.log('4. Check the inbox every 10 seconds (maximum 2 minutes)...');
    for (let i = 0; i < 12; i++) {
        const messages = await mailjs.getMessages();
        const verificationEmail = messages.data.find(msg => msg.from.address.includes('hyperskill.org'));

        if (verificationEmail) {
            console.log('   -> Verification email found!');
            const fullMessage = await mailjs.getMessage(verificationEmail.id);
            const body = (fullMessage.data.html && fullMessage.data.html[0]) || fullMessage.data.text || '';

            if (!body) throw new Error('Email found, but the contents (body) of the email are empty.');

            const match = body.match(/(https:\/\/hyperskill.org\/accounts\/confirm-email\/[\w\d-:]+)/);
            if (match && match[0]) return match[0];

            throw new Error('The contents of the email were found, but regex did not find a verification link pattern.');
        }
        console.log(`   -> Trial ${i + 1}: The inbox is still empty, waiting 10 seconds...`);
        await delay(10000);
    }
    throw new Error('The waiting time limit expires. The email from Hyperskill never arrived.');
}