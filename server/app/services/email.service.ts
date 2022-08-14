import { Service } from 'typedi';
import * as nodemailer from 'nodemailer';
import { EMAIL_USERNAME, EMAIL_PASSWORD } from '@app/constant/constant';

@Service()
export class EmailService {

    transporter: nodemailer.Transporter;

    constructor() { 
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USERNAME,
                pass: EMAIL_PASSWORD,
            },
        });
    }

    sendEmail() {
        const mailOptions = {
            from: EMAIL_USERNAME,
            to: "yanis.toubal@hotmail.com",
            subject: "New teacher signed up",
            text: "A new teacher signed up, please check your account to validate it",
        };
        this.transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log(info);
            }
        });
    }
}
