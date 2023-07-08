# Gmail-Bot

The Email Auto-Reply Bot is a Node.js application that automatically sends a predefined reply to emails. It integrates with the Gmail API to fetch unread messages, identify emails that have not been replied to, and send auto-replies to those emails.

## Prerequisites

Before using the Email Auto-Reply Bot, you need to set up a project in the Google Cloud Console and obtain the necessary credentials. Here are the steps:

1. Create a project in the Google Cloud Console (https://console.cloud.google.com).
2. Enable the Gmail API for the project.
3. Create OAuth 2.0 credentials (Client ID and Client Secret) for the project.
4. Configure the authorized redirect URI in the credentials settings.
5. Generate a refresh token by using the OAuth Playground (https://developers.google.com/oauthplayground). Authorize the https://mail.google.com scope for the Gmail API using the client ID and client secret. Exchange the authorization code for a refresh token.
