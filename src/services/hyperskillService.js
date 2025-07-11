import puppeteer from 'puppeteer';
import {REFERRAL_URL, BROWSER_EXECUTABLE_PATH} from '../config.js';

export async function register(email, password) {
    console.log('2. Start the browser (via Puppeteer) to register...');
    const browser = await puppeteer.launch({
        headless: 'new', executablePath: BROWSER_EXECUTABLE_PATH
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');

    try {
        console.log('   -> Visiting the referral page...');
        await page.goto(REFERRAL_URL, {waitUntil: 'networkidle2'});
        const signUpEmailButtonSelector = 'aria/Sign up with email';
        console.log(`   -> Waiting for the "Sign up with email" button and clicking on it...`);
        await page.waitForSelector(signUpEmailButtonSelector);
        await page.click(signUpEmailButtonSelector);

        const emailInputSelector = 'input[type="email"]';
        console.log(`   -> Waiting for the email input field to appear...`);
        await page.waitForSelector(emailInputSelector);

        console.log('   -> Email column found. Typing email...');
        await page.type(emailInputSelector, email);

        const passwordInputSelector = 'input[type="password"]';
        console.log('   -> Password column found. Type password...');
        await page.type(passwordInputSelector, password);

        const finalSubmitButtonSelector = 'button[type="submit"]';
        console.log('   -> Type complete. Clicking the final submit button...');
        await Promise.all([page.waitForNavigation({waitUntil: 'networkidle2'}), page.click(finalSubmitButtonSelector)]);

        console.log('   -> Registration on the Hyperskill website is successful!');
    } catch (error) {
        const errorScreenshotPath = `error_screenshot_${Date.now()}.png`;
        console.log(`!!! An error occurred during registration, saving the screenshot to: ${errorScreenshotPath}`);
        await page.screenshot({path: errorScreenshotPath, fullPage: true});
        throw error;
    } finally {
        await browser.close();
        console.log('   -> Browser closed.');
    }
}