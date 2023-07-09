import { getGmailClient } from "./controllers/gmailApi.js";
import { getEmail, sendReplyEmail } from "./controllers/email.js";
import { createLabelIfNeeded } from "./controllers/gmailApi.js";
import express from 'express';

const app = express();


// Set to keep track of users who have already received an auto-reply
const repliedUsers = new Set();



// Function to check emails and send auto-replies
const checkEmailsAndSendReplies = async () => {
  try {
    // Get the Gmail client using the getGmailClient function from gmailApi.js
    const gmail = getGmailClient();
    
    // Log a message to indicate that the Gmail bot has started
    console.log("Gmail Bot Started.....");
    const res = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread",
    });
    const messages = res.data.messages;
    // If there are unread messages
    if (messages && messages.length > 0) {
      console.log(`Total unread messages: ${messages.length}`);

      // Iterate over each message
      for (const message of messages) {
         // Fetch the complete email details using the getEmail function from email.js
        const email = await getEmail(message.id);
        
        // Extract the email headers (From, To, Subject)
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


        // Check if the sender has already been replied to
        if (repliedUsers.has(fromEmail)) {
          console.log(`Already replied to: ${fromEmail}`);
          continue;
        }

        // Fetch the thread to check if the email has any replies
        const thread = await gmail.users.threads.get({
          userId: "me",
          id: message.threadId,
        });

        const replies = thread.data.messages.slice(1);
         // If there are no replies

        if (replies.length === 0) {
        // Send an auto-reply email using the sendReplyEmail function from email.js
          await sendReplyEmail(toEmail, fromEmail, subject);


        // Add a label to the email using the createLabelIfNeeded function from gmailApi.js
          const labelName = "GmailBot";
          await gmail.users.messages.modify({
            userId: "me",
            id: message.id,
            requestBody: {
              addLabelIds: [await createLabelIfNeeded(labelName)],
            },
          });

          console.log(`Sent reply to email: ${fromEmail}`);

        // Add the sender's email to the repliedUsers set
          repliedUsers.add(fromEmail);
        }
      }
    } else {
      console.log("No unread messages found.");
    }
  } catch (error) {

    // Log any errors that occur during the process
    console.error("Error occurred:", error);
  }
};


// Function to generate a random interval between min and max values
const getRandomInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

console.log("Starting the Gmail auto-reply bot...");

//Execute the checkEmailsAndSendReplies function repeatedly based on the random interval
setInterval(checkEmailsAndSendReplies, getRandomInterval(45, 120) * 1000);

app.listen(8000, () => {
  console.log("server started at port 8000");
})
app.get('/' , (req,res) =>{
  res.send("Gmail Auto reply bot started.....")
})