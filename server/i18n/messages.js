const messages = {
  en: {
    usernameRequired: "Username is required and must be a string.",
    usernameTooShort: "Username must be at least 3 characters.",
    passwordRequired: "Password is required and must be a string.",
    passwordTooShort: "Password must be at least 8 characters.",
    consentRequired: "Consent is required.",
    tosRequired: "Terms of Service must be accepted.",
    privacyRequired: "Privacy Policy must be accepted.",
    consentVersionRequired: "Consent version is required.",
    usernameTaken: "Username is already taken.",
    wrongCredentials: "Wrong username or password.",
    serverError: "An unexpected error occurred.",
  },
  nb: {
    usernameRequired: "Brukernavn er påkrevd og må være en tekst.",
    usernameTooShort: "Brukernavn må ha minst 3 tegn.",
    passwordRequired: "Passord er påkrevd og må være en tekst.",
    passwordTooShort: "Passord må ha minst 8 tegn.",
    consentRequired: "Samtykke er påkrevd.",
    tosRequired: "Du må godta vilkårene for bruk.",
    privacyRequired: "Du må godta personvernerklæringen.",
    consentVersionRequired: "Samtykkversjon er påkrevd.",
    usernameTaken: "Brukernavnet er allerede i bruk.",
    wrongCredentials: "Feil brukernavn eller passord.",
    serverError: "En uventet feil oppstod.",
  },
};

export function getLang(req) {
  const header = req.headers["accept-language"] || "en";
  const lang = header.split(",")[0].split("-")[0].toLowerCase().trim();
  return messages[lang] ? lang : "en";
}

export function msg(req, key) {
  const lang = getLang(req);
  return { error: messages[lang]?.[key] ?? messages.en[key] ?? key };
}
