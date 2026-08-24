const {
    generateAuthorizationUrl,
    exchangeCodeForTokens
} = require("../services/googleAuthService");

const googleAuth = (req, res) => {
    try {
        const authorizationUrl = generateAuthorizationUrl();

        return res.redirect(authorizationUrl);

    } catch (error) {
        console.error("Google authorization error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to start Google authorization",
            data: null
        });
    }
};

const googleCallback = async (req, res) => {
    try {
        const { code, state, error } = req.query;

        if (error) {
            return res.status(400).json({
                success: false,
                message: `Google authorization failed: ${error}`,
                data: null
            });
        }

        if (!code || !state) {
            return res.status(400).json({
                success: false,
                message: "Authorization code or state missing",
                data: null
            });
        }

        const tokens = await exchangeCodeForTokens(code, state);

        console.log("Google OAuth successful.");

        if (tokens.refresh_token) {
    console.log("Refresh token received.");
    console.log("GOOGLE_REFRESH_TOKEN=");
    console.log(tokens.refresh_token);
} else {
            console.log("No refresh token received.");
        }

        return res.status(200).json({
            success: true,
            message: "Google authorization successful",
            data: {
                message: "Check the server terminal for the refresh token."
            }
        });

    } catch (error) {
        console.error("Google callback error:", error);

        return res.status(500).json({
            success: false,
            message: "Google authorization failed",
            data: null
        });
    }
};

module.exports = {
    googleAuth,
    googleCallback
};