import { Service } from 'typedi';
import * as nodemailer from 'nodemailer';
import { EMAIL_USERNAME, EMAIL_PASSWORD } from '@app/constant/constant';
import { CaseStudy } from '@app/models/caseStudy.model';
import { User } from '@app/models/user.model';
import { CaseFeedback } from '@app/models/CaseFeedback';

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

    sendApprovalResultToTeacher(userEmail: string, isApproved: boolean) {
        const mailOptions = {
            from: EMAIL_USERNAME,
            to: userEmail,
            subject: "Your proof of identity has been reviewed",
            text: isApproved ? "Your account has been approved" : "Your account has been rejected"
        }
        this.sendEmail(mailOptions);
    }

    sendPreApprovalResultToUser(email: string, caseStudy: CaseStudy, isPreApproved: boolean, failedCriterias: string[]) {
        let criteriaText = '';
        for (var criteria of failedCriterias) {
          criteriaText += criteria + '\n';
        }

        const mailOptions = {
            from: EMAIL_USERNAME,
            to: email,
            subject: `You case study named ${caseStudy.title}` + (isPreApproved ? `has been pre-approved` : `has been declined by a deputy`), 
            text: `Your case study named ${caseStudy.title}, authored by ${caseStudy.authors}` + 
                    (isPreApproved ? ` is now ready to get reviewed by the scientific committee.`
                                   : ` requires changes for its pre-approval. The following criterias were not respected: \n\n` +`${criteriaText}`) +
                    `\n\n Click here to see its status: http://localhost:3000/my-pending-case-studies`

        }
        this.sendEmail(mailOptions);
    }

    sendReviewResultToUser(email: string, caseStudy: CaseStudy, isApproved: boolean, decision: string, feedback: CaseFeedback[]) {
        let decisionText = '';
        switch(decision){
            case 'minor': decisionText = 'requires minor changes.'; break;
            case 'major': decisionText = 'requires major changes.'; break;
            case 'rejected': decisionText = 'has been rejected.';
        }

        let feedbackText = '';
        for (var element of feedback) {
            feedbackText += element.criteria + ': ' + (element.rating? element.rating + '/5': '') + '\n' +  (element.comments? element.comments + '\n': '') + '\n';
        }
    
        const mailOptions = {
            from: EMAIL_USERNAME,
            to: email,
            subject: `You case study named ${caseStudy.title} has been reviewed`, 
            text: `Your case study named ${caseStudy.title}, authored by ${caseStudy.authors}` + 
                    (isApproved ? ` has been approved by the scientific committee.`
                                : `${decisionText} See the full review below: \n\n${feedbackText}`) + 
                    `\n\n Click here to see its status: http://localhost:3000/my-pending-case-studies` 
        }
        this.sendEmail(mailOptions);
    }

    sendNotifyCaseStudyPublishedToUser(email: string, caseStudy: CaseStudy) {
        const mailOptions = {
            from: EMAIL_USERNAME,
            to: email,
            subject: `Your case study named ${caseStudy.title} has been published`,
            text: `Your case study named ${caseStudy.title}, authored by ${caseStudy.authors} has been approved by PolyPress. \n\n You can access to its published version here: http://localhost:3000/catalogue`
        }
        this.sendEmail(mailOptions);
    }

    sendPreApprovalNeededToDeputies(deputies: Array<User>, caseStudy: CaseStudy) {
        for(var deputy of deputies) {
            const mailOptions = {
                from: EMAIL_USERNAME,
                to: deputy.email,
                subject: "A new case study needs your attention",
                text: `A new case study named ${caseStudy.title}, authored by ${caseStudy.authors} is waiting for pre-approval. \n\n You can access it here: http://localhost:3000/approval`
            }
            this.sendEmail(mailOptions);
        }
    }

    sendReviewNeededToComity(commity: Array<User>, caseStudy: CaseStudy) {
        for(var committeeMember of commity) {
            const mailOptions = {
                from: EMAIL_USERNAME,
                to: committeeMember.email,
                subject: "A pre-approved case study needs your attention",
                text: `A pre-approved case study named ${caseStudy.title}, authored by ${caseStudy.authors} is waiting for review. \n\n You can access it here: http://localhost:3000/approval`
            }
            this.sendEmail(mailOptions);
        }
    }

    sendWaitingForFinalConfirmationToPolyPress(polyPress: Array<User>, caseStudy: CaseStudy) {
        for(var polyPressMember of polyPress) {
            const mailOptions = {
                from: EMAIL_USERNAME,
                to: polyPressMember.email,
                subject: "A reviewed case study needs your attention",
                text: `A reviewed case study named ${caseStudy.title}, authored by ${caseStudy.authors} is waiting for final confirmation. \n\n You can access it here: http://localhost:3000/approval`
            }
            this.sendEmail(mailOptions);
        }
    }
}
