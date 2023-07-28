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
            subject: "Bienvenue",
            text: "Bienvenue sur la plateforme LAC " + userName,
        }
        this.sendEmail(mailOptions);
    }

    sendNewUserEmail() {
        const mailOptions = {
            from: EMAIL_USERNAME,
            to: "yanis.toubal@hotmail.com",
            subject: "Un nouvel enseignant s'est enregistré",
            text: "Un nouvel enseignant s'est enregistré, veuillez consultez votre compte pour évaluer celui-ci",
        };
        this.sendEmail(mailOptions);
    }

    sendResetPasswordEmail(userEmail: string, resetToken: string) {
        const mailOptions = {
            from: EMAIL_USERNAME,
            to: userEmail,
            subject: "Réinitialiser votre mot de passe",
            text: `Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant: http://localhost:3000/reset-password/${resetToken}`,
        }
        this.sendEmail(mailOptions);
    }

    sendConfirmPasswordReset(userEmail: string) {
        const mailOptions = {
            from: EMAIL_USERNAME,
            to: userEmail,
            subject: "Mot de passe réinitialisé",
            text: "Votre mot de passe a été réinitialisé avec succès",
        }
        this.sendEmail(mailOptions);
    }

    sendApprovalResultToTeacher(userEmail: string, isApproved: boolean) {
        const mailOptions = {
            from: EMAIL_USERNAME,
            to: userEmail,
            subject: "Votre preuve d'identité a été évaluée",
            text: isApproved ? "Votre compte a été approuvée" : "Votre compte a été rejetée"
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
            subject: `L'étude de cas nommée ${caseStudy.title}` + (isPreApproved ? `a été pré-approuvée` : `a été rejetée par l'adjoint administratif`), 
            text: `Votre étude de cas nommée ${caseStudy.title} et écrite par ${caseStudy.authors}` + 
                    (isPreApproved ? ` est maintenant prête à être évalué par le comité scientifique.`
                                   : ` requiert des changements. Les critères suivants n'étaient pas respectés: \n\n` +`${criteriaText}`) +
                    `\n\n Cliquez sur le lien suivant pour modifier celle-ci: http://localhost:3000/my-pending-case-studies`

        }
        this.sendEmail(mailOptions);
    }

    sendReviewResultToUser(email: string, caseStudy: CaseStudy, isApproved: boolean, decision: string, feedback: CaseFeedback[]) {
        let decisionText = '';
        switch(decision){
            case 'minor': decisionText = 'requiert des changements mineurs.'; break;
            case 'major': decisionText = 'requiert des changements majeurs.'; break;
            case 'rejected': decisionText = 'a été rejetée.';
        }

        let feedbackText = '';
        for (var element of feedback) {
            feedbackText += element.criteria + ': ' + (element.rating? element.rating + '/5': '') + '\n' +  (element.comments? element.comments + '\n': '') + '\n';
        }
    
        const mailOptions = {
            from: EMAIL_USERNAME,
            to: email,
            subject: `Votre étude de cas nommée ${caseStudy.title} a été revue`, 
            text: `Votre étude de cas nommée ${caseStudy.title}, écrite par ${caseStudy.authors}` + 
                    (isApproved ? ` a été approuvée par le comité scientifique.`
                                : `${decisionText} Consultez l'évaluation complète ci-dessous: \n\n${feedbackText}`) + 
                    `\n\n Cliquez-ci pour y consulter son statut: http://localhost:3000/my-pending-case-studies` 
        }
        this.sendEmail(mailOptions);
    }

    sendNotifyCaseStudyPublishedToUser(email: string, caseStudy: CaseStudy) {
        const mailOptions = {
            from: EMAIL_USERNAME,
            to: email,
            subject: `Votre étude de cas nommée ${caseStudy.title} a été publiée`,
            text: `Votre étude de cas nommée ${caseStudy.title} et écrite par ${caseStudy.authors} a été approuvée par la Presse Internationale de Polytechnique. \n\n Vous pouvez accédez à sa version publiée au lien suivant: http://localhost:3000/catalogue`
        }
        this.sendEmail(mailOptions);
    }

    sendPreApprovalNeededToDeputies(deputies: Array<User>, caseStudy: CaseStudy) {
        for(var deputy of deputies) {
            const mailOptions = {
                from: EMAIL_USERNAME,
                to: deputy.email,
                subject: "Une nouvelle étude de cas requiert votre attention",
                text: `Une nouvelle étude de cas nommée ${caseStudy.title} et écrite par ${caseStudy.authors} est en attente de pré-approbation. \n\n Vous pouvez y accéder au lien suivant: http://localhost:3000/approval`
            }
            this.sendEmail(mailOptions);
        }
    }

    sendReviewNeededToComity(commity: Array<User>, caseStudy: CaseStudy) {
        for(var committeeMember of commity) {
            const mailOptions = {
                from: EMAIL_USERNAME,
                to: committeeMember.email,
                subject: "Une étude de cas pré-approuvée requiert votre attention",
                text: `Une étude de cas pré-approuvée nommée ${caseStudy.title} et écrite par ${caseStudy.authors} est en attente de revue. \n\n Vous pouvez y accéder au lien suivant: http://localhost:3000/approval`
            }
            this.sendEmail(mailOptions);
        }
    }

    sendWaitingForFinalConfirmationToPolyPress(polyPress: Array<User>, caseStudy: CaseStudy) {
        for(var polyPressMember of polyPress) {
            const mailOptions = {
                from: EMAIL_USERNAME,
                to: polyPressMember.email,
                subject: "Une étude de cas revue requiert votre attention",
                text: `Une étude de cas revue nommée ${caseStudy.title} et écrite par ${caseStudy.authors} est en attente de confirmation finale. \n\n Vous pouvez y accéder au lien suivant: http://localhost:3000/approval`
            }
            this.sendEmail(mailOptions);
        }
    }
}
