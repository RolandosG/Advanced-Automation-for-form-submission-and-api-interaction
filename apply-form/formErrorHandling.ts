import { Page } from 'puppeteer';
import readline from 'readline';

// Utility function to get user input
export const getUserInput = (question: string): Promise<string> => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
};

// Function to check for form errors
export async function checkForFormErrors(page: Page): Promise<string | null> {
    const errors = await page.evaluate(() => {
        const errorMessages: string[] = [];
        document.querySelectorAll('.artdeco-inline-feedback__message').forEach((el: Element) => {
            const element = el as HTMLElement; // Cast to HTMLElement to access innerText
            if (element.innerText.includes("required") || element.innerText.includes("must")) {
                errorMessages.push(element.innerText);
            }
        });
        return errorMessages.length > 0 ? errorMessages[0] : null; // Return only the first error found
    });

    return errors;
}
function determineInputSelectorForError(error: string): string {
    // Example: Map the error message to a specific form input selector
    if (error.includes("JIRA")) return '#input-for-jira'; // This is a placeholder selector
    return ''; // Default if no match found
}
// Function to handle form errors
export async function handleFormError(page: Page, error: string): Promise<{ success: boolean }> {
    console.error(`Detected form error: ${error}`);
    const userResponse = await getUserInput(`Form error detected: ${error}. Please enter the correct value: `);
    if (userResponse) {
        // Implement a way to find the correct input field based on the error message or another method
        const inputSelector = determineInputSelectorForError(error); // Ensure you have this function implemented
        await page.type(inputSelector, userResponse);
        return { success: true };
    }
    return { success: false };
}
