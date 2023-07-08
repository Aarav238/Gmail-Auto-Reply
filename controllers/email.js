import { getGmailClient } from "./gmailApi.js";

export const getEmail = async (messageId) => {
  const gmail = getGmailClient();
  return await gmail.users.messages.get({
    userId: "me",
    id: messageId,
  });
};

export const sendReplyEmail = async (fromEmail, toEmail, subject) => {
  const gmail = getGmailClient();
  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: await createReplyRaw(fromEmail, toEmail, subject),
    },
  });
};

export const createReplyRaw = async (from, to, subject) => {
  const emailContent = `From: ${from}\nTo: ${to}\nSubject: ${subject}\n\nI am acknowledging your message and I will respond as soon as possible.`;
  const base64EncodedEmail = Buffer.from(emailContent)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return base64EncodedEmail;
};
