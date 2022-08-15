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

    private sendEmail(mailOptions: nodemailer.SendMailOptions) {
        this.transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(info);
                console.log("Email sent");
            }
        }
        );
    }

    sendWelcomeEmail(userEmail: string, userName: string) {
        const mailOptions = {
            from: EMAIL_USERNAME,
            to: userEmail,
            subject: "Welcome",
            text: "Welcome to LAC " + userName,
        }
        this.sendEmail(mailOptions);
    }

    sendNewUserEmail() {
        const mailOptions = {
            from: EMAIL_USERNAME,
            to: "yanis.toubal@hotmail.com",
            subject: "New teacher signed up",
            text: "A new teacher signed up, please check your account to validate it",
        };
        this.sendEmail(mailOptions);
    }

    sendResetPasswordEmail(userEmail: string, resetToken: string) {
        const mailOptions = {
            from: EMAIL_USERNAME,
            to: userEmail,
            subject: "Reset your password",
            text: `To reset your password, please click on the following link: http://localhost:3000/reset-password/${resetToken}`,
        }
        this.sendEmail(mailOptions);
    }

    sendConfirmPasswordReset(userEmail: string) {
        const mailOptions = {
            from: EMAIL_USERNAME,
            to: userEmail,
            subject: "Password reset",
            text: "Your password has been successfully reset",
        }
        this.sendEmail(mailOptions);
    }
}
