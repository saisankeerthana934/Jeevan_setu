
// const nodemailer = require('nodemailer');

// const sendEmail = async (options) => {
//   // 1. Create a transporter that correctly uses your .env variables
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   // 2. Define the email options
//   const mailOptions = {
//     from: '"JeevanSetu Support" <no-reply@jeevansetu.com>',
//     to: options.email,
//     subject: options.subject,
//     // --- 🔽 THIS IS THE FIX 🔽 ---
//     // We use 'html' instead of 'text' to make the link clickable
//     html: options.message, 
//     // --- 🔼 END OF FIX 🔼 ---
//   };

//   // 3. Send the email
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create the transporter using your .env credentials
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER, // This is your admin sending email
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: `"${options.name}" <no-reply@jeevansetu.com>`, // Show the user's name, but send from a no-reply address
    to: process.env.EMAIL_USER, // THIS IS THE FIX: Always send the email TO your admin address
    subject: options.subject,
    html: `<p>You have a new contact message from:</p>
           <ul>
             <li><b>Name:</b> ${options.name}</li>
             <li><b>Email:</b> ${options.email}</li>
           </ul>
           <p><b>Message:</b></p>
           <p>${options.message}</p>`,
    replyTo: options.email, // IMPORTANT: This lets you click "Reply" to message the user directly
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
