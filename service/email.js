// const nodemailer = require('nodemailer');
// const dotenv = require('dotenv');
// dotenv.config();

// // Create a transporter object using SMTP transport
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });
// function sendEmail(email, subject, html){
//   try{
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: subject,
//       html: html
//     };
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.error('Error sending email:', error);
//         } else {
//           console.log('Email sent:', info.response);
//         }
//     });
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// }

// module.exports = sendEmail;
