import { google } from "googleapis";
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } from "../configs/configs.js";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export const getGmailClient = () => {
  return google.gmail({ version: "v1", auth: oAuth2Client });
};

export const getGmailLabels = async () => {
  const gmail = getGmailClient();
  const res = await gmail.users.labels.list({ userId: "me" });
  return res.data.labels;
};

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
