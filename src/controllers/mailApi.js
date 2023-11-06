const { oAuth2Client } = require("../config/mail.config")
const nodemailer = require("nodemailer");

async function sendMail(mailOption) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: `OAUTH2`,
                user: `lnthai21@clc.fitus.edu.vn`,
                clientId: process.env.MAIL_CLIENT_ID,
                clientSecret: process.env.MAIL_CLIENT_SECRET,
                refreshToken: process.env.MAIL_REFRESH_TOKEN,
                accessToken: accessToken
            }
        })
        // const mailOption = {
        //     from: `LENGUYEN THAI <lnthai21@clc.fitus.edu.vn>`,
        //     to: `lnt0995449235@gmail.com`,
        //     subject: "Hello from gmail using API",
        //     text: "hello world",
        //     html: `<h1> Hello from gmail </h1>`
        // }

        const result = transport.sendMail(mailOption);

        return result;

    } catch (error) {
        return error
    }
}
module.exports = { sendMail };