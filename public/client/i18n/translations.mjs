const translations = {
  en: {
    appTitle: "Mini Poll",
    welcome: "Mini Poll",
    welcomeUser: "Welcome, {username}!",
    createAccount: "Create Account",
    login: "Login",
    logout: "Logout",
    authTabs: "Authentication options",
    username: "Username",
    password: "Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    signUp: "Sign Up",
    updatePassword: "Update Password",
    deleteAccount: "Delete Account",
    accountSettings: "Account Settings",
    changePassword: "Change Password",
    deleteWarning: "Warning: This action cannot be undone.",
    tosConsent: "I accept the {tos} and {privacy}",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",

    userCreated: "Account created! You can now log in.",
    usernameRequired: "Username and password are required.",
    consentRequired: "You must accept the Terms of Service and Privacy Policy.",
    passwordRequired: "New password is required.",
    passwordMismatch: "Passwords do not match.",
    passwordUpdated: "Password updated successfully!",
    accountDeleted: "Account deleted.",
    loggedOut: "Logged out.",
    wrongCredentials: "Wrong username or password.",
    couldNotCreate: "Could not create account.",
    couldNotUpdate: "Could not update password.",
    couldNotDelete: "Could not delete account.",

    offlineTitle: "You are offline",
    offlineMessage: "Please check your internet connection and try again.",
    offlineBack: "Go back",
  },
  nb: {
    appTitle: "Mini Poll",
    welcome: "Mini Poll",
    welcomeUser: "Velkommen, {username}!",
    createAccount: "Opprett konto",
    login: "Logg inn",
    logout: "Logg ut",
    authTabs: "Autentiseringsvalg",
    username: "Brukernavn",
    password: "Passord",
    newPassword: "Nytt passord",
    confirmPassword: "Bekreft passord",
    signUp: "Registrer",
    updatePassword: "Oppdater passord",
    deleteAccount: "Slett konto",
    accountSettings: "Kontoinnstillinger",
    changePassword: "Endre passord",
    deleteWarning: "Advarsel: Denne handlingen kan ikke angres.",
    tosConsent: "Jeg godtar {tos} og {privacy}",
    termsOfService: "vilkårene for bruk",
    privacyPolicy: "personvernerklæringen",

    userCreated: "Konto opprettet! Du kan nå logge inn.",
    usernameRequired: "Brukernavn og passord er påkrevd.",
    consentRequired: "Du må godta vilkårene for bruk og personvernerklæringen.",
    passwordRequired: "Nytt passord er påkrevd.",
    passwordMismatch: "Passordene stemmer ikke overens.",
    passwordUpdated: "Passord oppdatert!",
    accountDeleted: "Konto slettet.",
    loggedOut: "Logget ut.",
    wrongCredentials: "Feil brukernavn eller passord.",
    couldNotCreate: "Kunne ikke opprette konto.",
    couldNotUpdate: "Kunne ikke oppdatere passord.",
    couldNotDelete: "Kunne ikke slette konto.",

    offlineTitle: "Du er frakoblet",
    offlineMessage: "Sjekk internettilkoblingen din og prøv igjen.",
    offlineBack: "Gå tilbake",
  },
};

function detectLang() {
  const lang = (navigator.language || "en").split("-")[0].toLowerCase();
  return translations[lang] ? lang : "en";
}

export const lang = detectLang();

export function t(key, vars = {}) {
  const str = translations[lang]?.[key] ?? translations.en[key] ?? key;
  return Object.entries(vars).reduce((s, [k, v]) => s.replace(`{${k}}`, v), str);
}
