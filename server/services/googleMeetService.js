const { google } = require("googleapis");
const crypto = require("crypto");

const createOAuthClient = () => {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });
    // console.log(
    //     "Google OAuth credentials configured:",
    //     !!oauth2Client.credentials.refresh_token
    // );

    return oauth2Client;
};

const createGoogleMeet = async ({
    title,
    description,
    startTime,
    endTime
}) => {
    const auth = createOAuthClient();

    const calendar = google.calendar({
        version: "v3",
        auth
    });

    const event = {
        summary: title,
        description: description || "",
        start: {
            dateTime: new Date(startTime).toISOString()
        },
        end: {
            dateTime: new Date(endTime).toISOString()
        },
        conferenceData: {
            createRequest: {
                requestId: crypto.randomUUID(),
                conferenceSolutionKey: {
                    type: "hangoutsMeet"
                }
            }
        }
    };

    const response = await calendar.events.insert({
        calendarId: "primary",
        conferenceDataVersion: 1,
        requestBody: event
    });

    const createdEvent = response.data;

    const meetEntryPoint =
        createdEvent.conferenceData?.entryPoints?.find(
            (entryPoint) => entryPoint.entryPointType === "video"
        );

    if (!meetEntryPoint?.uri) {
        throw new Error("Google Meet link was not generated");
    }

    return {
        eventId: createdEvent.id,
        meetingUrl: meetEntryPoint.uri,
        htmlLink: createdEvent.htmlLink
    };
};

module.exports = {
    createGoogleMeet
};