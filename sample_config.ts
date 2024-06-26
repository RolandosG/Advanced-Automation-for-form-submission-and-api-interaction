export default {
  // Edit config.ts to include your LinkedIn credentials and other necessary details.
  // LOGIN DETAILS
  LINKEDIN_EMAIL: "",
  LINKEDIN_PASSWORD: "",

  // JOB SEARCH PARAMETERS
  KEYWORDS: "javascript",
  LOCATION: "Canada",
  WORKPLACE: {
    REMOTE: true,
    ON_SITE: true,
    HYBRID: false,
  },
  JOB_TITLE: "(javascript|frontend|front-end|fullstack|full-stack|nodejs|node|js).*(developer|engineer)",
  JOB_DESCRIPTION: "^((?!(primeit))(.|[\n\r]))*$",
  JOB_DESCRIPTION_LANGUAGES: ["french", "english"], // replace value with ["any"] to accept all job description laguages

  // FORM DATA
  PHONE: "123456789",
  CV_PATH: "",
  COVER_LETTER_PATH: "",
  HOME_CITY: "Lisbon, Portugal",
  YEARS_OF_EXPERIENCE: {
    "angular": 5,
    "react.js": 6,
    ".net": 3,
    "php": 4,
    "spring": 4,
    "java": 4,
    "magento": 5,
    "node": 5,
    "javascript": 5,
    "mongodb": 5,
    "kubernetes": 5,
    "CI/CD": 5,
    "python": 5,
    "drupal": 5,
    "sass": 5,
    "html": 5,
    "google cloud": 5,
    "docker": 5,
    "terraform": 5,
    "css": 4,
    "typescript": 6,
    "webmethods": 5
  },
  LANGUAGE_PROFICIENCY: {
    "english": "professional",
    "spanish": "native",
    "french": "native"
  },
  REQUIRES_VISA_SPONSORSHIP: false,
  // Adjust based on your situation
  TEXT_FIELDS: {
    "salary expectation": "55,000",
    "notice period": "Two weeks",
    "How much notice do you require": "Two weeks",
    "current location": "Toronto",
    "years.*experience|années.*expérience": "1",
    "experience with performing integration systems testing": "1",
    "experience do you have in functional, integration, regression, and non-functional testing": "1",
    "experience do you have in SaaS and COTS products, Azure Cloud and API testing": "1",
    "Depuis combien d’années utilisez-vous": "1",
    ".*experience.*": "1",
    "How many years.*": "1",
  },
  BOOLEANS: {
    "bachelor": true,
    "authorized to work in Canada": true,
    "criminal history": false,  
    "authorized to work": true,
    "criminal charges": false,
    "contact for future opportunities": true,
    "authorized": true,
    "contact.*future.*job": true,
    "Have you completed a 3-year College diploma": true,
    "Are you comfortable with 1-2 days onsite": true,
  },
  MULTIPLE_CHOICE_FIELDS: {
    "pronouns": "He/Him",
    "Do you have any.*": "Yes",
    "Are you able to.*": "Yes",
    "in office": "Yes",
    "preferred interview language": "English",
    "province based": "Ontario",
    "preferred language": "English",
    "province": "Ontario",
    "What is your preferred language for an interview": "English/ Anglais",
    "Do you have a valid driver's license": "Yes",
    "Will you now, or in the future, require sponsorship for employment visa status": "No",  
    "What is your preferred language for an interview?/ Quelle est votre langue préférée pour un entretien ?What is your preferred language for an interview?/ Quelle est votre langue préférée pour un entretien ? ": "English/ Anglais",
    "Race/Ethnicity": "I prefer not to specify",
    "Gender": "I prefer not to specify",
    "Veteran status": "I am not a protected veteran",
    "Are you a veteran?": "No",
    "Do you claim disability status?": "No",
    "Are you able.*": "Yes",
    "Are you located within.*Toronto.*": "Yes",
    "Do you have experience with .*Salesforce.*": "Yes",
    "Are you comfortable working .*onsite.*": "Yes",
    ".*experience in.*testing.*": "1",
    ".*experience with QA methodologies.*": "Yes",
    ".*experience with QA tools.*": "Yes",
    ".*familiar with Quality Management Systems.*": "Yes",
    ".*comfortable in a hybrid work setting.*": "Yes",
    ".*legally authorized to work in Canada.*": "Yes",
    ".*experience with implementing QMS.*": "Yes",
  },
 
  // OTHER SETTINGS
  SINGLE_PAGE: false,
}
