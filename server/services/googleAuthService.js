const { google } = require("googleapis");
const crypto = require("crypto");

const SCOPES = [
    "https://www.googleapis.com/auth/calendar.events"
];

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// Temporary state storage for local MVP setup
let currentState = null;

const generateAuthorizationUrl = () => {
    currentState = crypto.randomBytes(32).toString("hex");

    return oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        include_granted_scopes: true,
        state: currentState,
        prompt: "consent"
    });
};

const exchangeCodeForTokens = async (code, state) => {
    if (!currentState || state !== currentState) {
        throw new Error("Invalid OAuth state");
    }

    currentState = null;

    const { tokens } = await oauth2Client.getToken(code);

    return tokens;
};

module.exports = {
    generateAuthorizationUrl,
    exchangeCodeForTokens
};