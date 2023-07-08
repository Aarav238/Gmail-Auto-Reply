import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

console.log("CLIENT_ID:", CLIENT_ID);
console.log("CLIENT_SECRET:", CLIENT_SECRET);

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


const repliedUsers = new Set();

const checkEmailsAndSendReplies = async () => {
  try {
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
    console.log("Gmail Bot Started.....");
    const res = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread",
    });
    const messages = res.data.messages;

    if (messages && messages.length > 0) {
      console.log(`Total unread messages: ${messages.length}`);
      for (const message of messages) {
        const email = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });
        const fromHeader = email.data.payload.headers.find(
          (header) => header.name.toLowerCase() === "from"
        );
        const toHeader = email.data.payload.headers.find(
          (header) => header.name.toLowerCase() === "to"
        );
        const subjectHeader = email.data.payload.headers.find(
          (header) => header.name.toLowerCase() === "subject"
        );
        const fromEmail = fromHeader ? fromHeader.value : "";
        const toEmail = toHeader ? toHeader.value : "";
        const subject = subjectHeader ? subjectHeader.value : "";
        console.log(`Processing email from: ${fromEmail}`);
        console.log(`To email: ${toEmail}`);
        console.log(`Subject: ${subject}`);

        if (repliedUsers.has(fromEmail)) {
          console.log(`Already replied to: ${fromEmail}`);
          continue;
        }

        const thread = await gmail.users.threads.get({
          userId: "me",
          id: message.threadId,
        });

        const replies = thread.data.messages.slice(1);

        if (replies.length === 0) {
          await gmail.users.messages.send({
            userId: "me",
            requestBody: {
              raw: await createReplyRaw(toEmail, fromEmail, subject),
            },
          });

          const labelName = "GmailBot";
          await gmail.users.messages.modify({
            userId: "me",
            id: message.id,
            requestBody: {
              addLabelIds: [await createLabelIfNeeded(labelName)],
            },
          });

          console.log(`Sent reply to email: ${fromEmail}`);
          repliedUsers.add(fromEmail);
        }
      }
    } else {
      console.log("No unread messages found.");
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

const createReplyRaw = async (from, to, subject) => {
  const emailContent = `From: ${from}\nTo: ${to}\nSubject: ${subject}\n\nI am acknowledging your message and I will response as soon as possible.`;
  const base64EncodedEmail = Buffer.from(emailContent)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return base64EncodedEmail;
};

const createLabelIfNeeded = async (labelName) => {
  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
  const res = await gmail.users.labels.list({ userId: "me" });
  const labels = res.data.labels;

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

const getRandomInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

console.log("Starting the gmail auto-reply bot...");
setInterval(checkEmailsAndSendReplies, getRandomInterval(45, 120) * 1000);
