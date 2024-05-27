"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const hbs = require('nodemailer-express-handlebars');
const transporter = nodemailer_1.default.createTransport({
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
function sendEmail(res, next, to, subject, template, context) {
    return __awaiter(this, void 0, void 0, function* () {
        //Configure email options like from, to, subject, message, attachments, template...
        const mailOptions = {
            from: 'MrGianStore',
            to,
            subject,
            template,
            context,
        };
        // Send email options using the transporter
        yield transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                res.status(404).json({
                    status: 'Error',
                    message: 'Email send failed! Please try again',
                });
                next();
            }
            else {
                console.log('Message sent successfully!');
                next();
            }
        });
    });
}
exports.default = sendEmail;
