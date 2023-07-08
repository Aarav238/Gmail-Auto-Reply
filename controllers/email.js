import { getGmailClient } from "./gmailApi.js";

/*
 * Get the email message by messageId.
 * param {string} messageId - The ID of the email message.
 * returns {object} The email message object.
 */

export const getEmail = async (messageId) => {
  const gmail = getGmailClient();
  return await gmail.users.messages.get({
    userId: "me",
    id: messageId,
  });
};


/*
 * Send a reply email.
 * param {string} fromEmail - The email address of the sender.
 * param {string} toEmail - The email address of the recipient.
 * param {string} subject - The subject of the email.
 * returns {Promise<void>} A Promise that resolves when the reply email is sent.
 */
export const sendReplyEmail = async (fromEmail, toEmail, subject) => {
  const gmail = getGmailClient();
  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: await createReplyRaw(fromEmail, toEmail, subject),
    },
  });
};


/*
 * Create the raw content of the reply email.
 * param {string} from - The email address of the sender.
 * param {string} to - The email address of the recipient.
 * param {string} subject - The subject of the email.
 * returns {Promise<string>} A Promise that resolves with the base64 encoded raw content of the email.
 */

export const createReplyRaw = async (from, to, subject) => {
  const emailContent = `From: ${from}\nTo: ${to}\nSubject: ${subject}\n\nI am acknowledging your message and I will respond as soon as possible.`;
  const base64EncodedEmail = Buffer.from(emailContent)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return base64EncodedEmail;
};
