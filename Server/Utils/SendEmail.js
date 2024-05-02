import nodemailer from 'nodemailer';

// Function to send email using Nodemailer
const sendEmail = async (email, token) => {

    // Creating a transporter for Gmail
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODEMAILER_USER, // Your Gmail email address
            pass: process.env.NODEMAILER_PASS // Your Gmail password or App Password
        }
    });
    // Email content
    const verificationLink = `${process.env.VERIFICATION_LINK}`;
    let mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: email,
        subject: 'Reset your password', // Subject line
        html: `<h1>Thaku you </h1>
        <a href="${verificationLink}">Click here to reset your password</a>
        <p> otp for reset you password ${token} </p>
        `
    };

    try {
        // Sending email
        let info = await transporter.sendMail(mailOptions);
        // console.log('Email sent successfully!');
        // console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('Error occurred:', error.message);
    }
};


// Exporting the function
export default sendEmail;
