import { getGmailClient } from "./controllers/gmailApi.js";
import { getEmail, sendReplyEmail } from "./controllers/email.js";
import { createLabelIfNeeded } from "./controllers/gmailApi.js";

const repliedUsers = new Set();

const checkEmailsAndSendReplies = async () => {
  try {
    const gmail = getGmailClient();
    console.log("Gmail Bot Started.....");
    const res = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread",
    });
    const messages = res.data.messages;

    if (messages && messages.length > 0) {
      console.log(`Total unread messages: ${messages.length}`);
      for (const message of messages) {
        const email = await getEmail(message.id);
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
          await sendReplyEmail(toEmail, fromEmail, subject);

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

const getRandomInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

console.log("Starting the Gmail auto-reply bot...");
setInterval(checkEmailsAndSendReplies, getRandomInterval(45, 120) * 1000);
