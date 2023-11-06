const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();


const oAuth2Client = new google.auth.OAuth2(process.env.MAIL_CLIENT_ID, process.env.MAIL_CLIENT_SECRET, process.env.MAIL_REDIRECT);

oAuth2Client.setCredentials({ refresh_token: process.env.MAIL_REFRESH_TOKEN });

module.exports = { oAuth2Client };
