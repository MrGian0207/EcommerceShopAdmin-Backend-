import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
import { Response, NextFunction } from 'express';

const hbs = require('nodemailer-express-handlebars');

const transporter = nodemailer.createTransport({
   host: 'smtp.gmail.com',
   port: 465,
   secure: true, // use SSL
   auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
   },
});

// Configure Handlebars plugin in Nodemailer
const hbsOptions = {
   viewEngine: {
      partialsDir: 'src/views',
      layoutsDir: 'src/views',
      defaultLayout: 'baseMessage',
   },
   viewPath: 'src/views',
};

transporter.use('compile', hbs(hbsOptions));

export default async function sendEmail(
   res: Response,
   next: NextFunction,
   to: string,
   subject: string,
   template: string,
   context: {},
) {
   //Configure email options like from, to, subject, message, attachments, template...
   const mailOptions = {
      from: 'MrGianStore',
      to,
      subject,
      template,
      context,
   };

   // Send email options using the transporter
   await transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
         res.status(404).json({
            status: 'Error',
            message: 'Email send failed! Please try again',
         });
         next();
      } else {
         console.log('Message sent successfully!');
         next();
      }
   });
}
