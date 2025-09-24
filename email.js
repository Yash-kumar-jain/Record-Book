require('dotenv').config();
const sgMail = require('@sendgrid/mail');

// Setup SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * sendEmail
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} text - plain text body
 * @param {string} html - HTML body
 */
const sendEmail = async (to, subject, text, html) => {
  try {
    const recipients = Array.isArray(to) ? to : [to];

    await sgMail.send({
      to: recipients,
      from: process.env.EMAIL_USER,
      subject,
      text,
      html,
    });

    console.log('✅ Email sent successfully' );
    
  } catch (error) {
    // Log errors, don't throw
    console.warn('⚠️ Email not sent:', error.response?.body?.errors || error.message || error);
  }
};
module.exports = sendEmail;