const nodemailer = require('nodemailer');
const emailConfig = require('../../config/email.config');

const transporter = nodemailer.createTransport(emailConfig);

const sendEmail = async ({ to, subject, text }) => {
    try {
        await transporter.sendMail({ from: emailConfig.auth.user, to, subject, text });
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};

module.exports = { sendEmail };