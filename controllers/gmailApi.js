import { google } from "googleapis";
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } from "../configs/configs.js";


// Create OAuth2 client using the provided credentials
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


/*
 * Get the Gmail client with authentication.
 * returns the Gmail client object.
*/
export const getGmailClient = () => {
  return google.gmail({ version: "v1", auth: oAuth2Client });
};


/*
 * Get the Gmail labels for the authenticated user.
 * returns the array of Gmail labels.
*/
export const getGmailLabels = async () => {
  const gmail = getGmailClient();
  const res = await gmail.users.labels.list({ userId: "me" });
  return res.data.labels;
};

/*
 * Create a Gmail label if it does not already exist.
 * param {string} labelName - The name of the label to create.
 * returns {string} The ID of the created or existing label.
*/

export const createLabelIfNeeded = async (labelName) => {
  const gmail = getGmailClient();
  const labels = await getGmailLabels();

  const existingLabel = labels.find((label) => label.name === labelName);
  if (existingLabel) {
    return existingLabel.id;
  }

  const newLabel = await gmail.users.labels.create({
    userId: "me",
    requestBody: {
      name: labelName,
      labelListVisibility: "labelShow",
      messageListVisibility: "show",
    },
  });

  return newLabel.data.id;
};
