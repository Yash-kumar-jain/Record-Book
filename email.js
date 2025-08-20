require('dotenv').config();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// Setup OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI 
);

// Set your refresh token (long-lived)
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// Create reusable transporter with auto-refreshed access token
async function createTransporter() {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });
  } catch (error) {
    console.error('❌ Error creating transporter:', error);
    throw error;
  }
}

// Verify connection once when server starts
(async () => {
  try {
    const transporter = await createTransporter();
    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
  } catch (error) {
    console.error('❌ Error connecting to email server:', error);
  }
})();

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail({
      from: `"Record Book" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log('📧 Message sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;
