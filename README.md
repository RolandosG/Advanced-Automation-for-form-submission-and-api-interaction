# AUTOMATED APPLY

This enhanced tool is designed to streamline your job application process on LinkedIn by automating applications. It has been significantly revamped to avoid repetitive login captchas through cookie management, and it adapts to site updates to maintain functionality over time.

# Key Features:

## Cookie-based Session Management: 
Avoids repetitive logins by saving session cookies, thereby circumventing frequent captchas.
## Updated Selector Logic: 
Adapted to the latest LinkedIn UI changes to ensure reliable form submissions.
## Robust Error Handling: 
Gracefully handles errors and moves to the next job posting after a configurable number of failed attempts.
## User Input for Unhandled Cases: 
Plans to incorporate a method for handling unknown variables during form submission, potentially integrating machine learning techniques.

### Step 1 install dependencies:
```
npm i
```

### Step 2, copy the sample configuration file to your environment and fill it with your information
```
cp sample_config.ts config.ts
```

### Step 3, run the program

```
npm run apply
```

To run the program without pressing the submit form button (for testing purposes)
```
npm run start
```

### Initial Setup and Testing
During the first run, you might encounter some errors as the script attempts to log in and navigate the site. These issues should resolve once the initial setup, including cookie storage, is complete. Subsequent uses will benefit from smoother operation.

## Future Enhancements
### Intelligent Form Handling: 
Exploring advanced techniques to better handle form variations and unexpected fields.
### Interactive User Feedback: 
Implementing mechanisms for user interaction to refine application data on-the-fly.
