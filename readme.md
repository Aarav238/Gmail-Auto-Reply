# Gmail-Bot

The Email Auto-Reply Bot is a Node.js application that automatically sends a predefined reply to emails. It integrates with the Gmail API to fetch unread messages, identify emails that have not been replied to, and send auto-replies to those emails.

## Prerequisites

Before using the Email Auto-Reply Bot, you need to set up a project in the Google Cloud Console and obtain the necessary credentials. Here are the steps:

1. Create a project in the Google Cloud Console (https://console.cloud.google.com).
2. Enable the Gmail API for the project.
3. Create OAuth 2.0 credentials (Client ID and Client Secret) for the project.
4. Configure the authorized redirect URI in the credentials settings.
5. Generate a refresh token by using the OAuth Playground (https://developers.google.com/oauthplayground). Authorize the https://mail.google.com scope for the Gmail API using the client ID and client secret. Exchange the authorization code for a refresh token.

## Configuration

Before running the application, make sure to set up the following configuration variables:

- `CLIENT_ID`: The Client ID obtained from the Google Cloud Console.
- `CLIENT_SECRET`: The Client Secret obtained from the Google Cloud Console.
- `REDIRECT_URI`: The authorized redirect URI configured in the Google Cloud Console.
- `REFRESH_TOKEN`: The refresh token obtained from the OAuth Playground.

Create a `.env` file in the project directory and populate it with the above configuration variables:

```
CLIENT_ID=<your-client-id>
CLIENT_SECRET=<your-client-secret>
REDIRECT_URI=<your-redirect-uri>
REFRESH_TOKEN=<your-refresh-token>
```
You can also take reference from the `.env.example` file.
## Installation

To install the required dependencies, run the following command:
```
npm install
 ```

## Usage

To start the Email Auto-Reply Bot, run the following command:
```
npm start
```
for development server:
```
npm run dev
```


The bot will connect to the Gmail API using the provided credentials and start monitoring for unread emails. It will send an auto-reply to each unread email that meets the criteria.

## Auto-Reply Message

The auto-reply message is a predefined response that will be sent to the recipients of the incoming emails. It can be customized according to your needs. By default, the message says:
```
From: [sender-email]
to: [recipient-email]
Subject: [email-subject]

I am acknowledging your message and I will respond as soon as possible.
```

## Console logs

The application provides detailed console logs to keep you informed about its activities. Here are the key log messages:

- "Starting the email auto-reply bot...": Indicates that the bot has started and is ready to process incoming emails.
- "Gmail Bot Started...": Indicates that the Gmail API connection is established.
- "Total unread messages: [count]": Displays the total number of unread messages found.
- "Processing email from: [sender-email]": Indicates that the bot is processing an email from a specific sender.
- "Sent reply to email: [sender-email]": Indicates that an auto-reply has been sent to the specified sender's email.
- "Already replied to: [sender-email]": Indicates that the sender has already received an auto-reply and will be skipped.
