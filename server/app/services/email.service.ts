import { Service } from 'typedi';
import * as nodemailer from 'nodemailer';
import { EMAIL_USERNAME, EMAIL_PASSWORD } from '@app/constant/constant';
import { CaseStudy } from '@app/models/caseStudy.model';
import { User } from '@app/models/user.model';
import { ApprovalDecision } from '@app/models/ApprovalDecision';

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
                    `\n\n Cliquez sur le lien suivant pour modifier celle-ci: http://localhost:3000/my-pending-case-studies/case-edit?id=${caseStudy._id}`,

        }
        this.sendEmail(mailOptions);
    }

    sendReviewResultToUser(email: string, caseStudy: CaseStudy, isApproved: boolean, decision: ApprovalDecision, feedback: string) {
        let decisionText = '';
        switch(decision){
            case ApprovalDecision.MINOR_CHANGES: decisionText = 'requiert des changements mineurs.'; break;
            case ApprovalDecision.MAJOR_CHANGES: decisionText = 'requiert des changements majeurs.'; break;
            case ApprovalDecision.REJECT: decisionText = 'a été rejetée.'; break;
            case ApprovalDecision.APPROVED: decisionText = 'a été approuvée par le comité scientifique.';
        }
    
        const mailOptions = {
            from: EMAIL_USERNAME,
            to: email,
            subject: `Votre étude de cas nommée ${caseStudy.title} a été revue`, 
            text: `Votre étude de cas nommée ${caseStudy.title}, écrite par ${caseStudy.authors}` + 
                    `${decisionText} Consultez l'évaluation complète ci-dessous: \n\n${feedback}` + 
                    `\n\n Cliquez-ci pour y consulter son statut: http://localhost:3000/my-pending-case-studies/case-edit?id=${caseStudy._id}`,
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

    sendPreApprovalNeededToDeputies(deputies: Array<User>, caseStudy: CaseStudy, isModifiedCaseStudy: boolean) {
        for(var deputy of deputies) {
            const mailOptions = {
                from: EMAIL_USERNAME,
                to: deputy.email,
                subject: isModifiedCaseStudy? `Une étude de cas modifiée requiert votre attention à nouveau`: `Une nouvelle étude de cas requiert votre attention`,
                text: isModifiedCaseStudy? `Une étude de cas modifiée`: `Une nouvelle étude de cas`+ `nommée ${caseStudy.title} et écrite par ${caseStudy.authors} est en attente de pré-approbation. \n\n Vous pouvez y accéder au lien suivant: http://localhost:3000/approval/new-case?id=${caseStudy._id}`,
            }
            this.sendEmail(mailOptions);
        }
    }

    sendReviewNeededToDirector(directors: Array<User>, caseStudy: CaseStudy) {
        for(var director of directors) {
            const mailOptions = {
                from: EMAIL_USERNAME,
                to: director.email,
                subject: "Une étude de cas pré-approuvée requiert votre attention",
                text: `Une étude de cas pré-approuvée nommée ${caseStudy.title} et écrite par ${caseStudy.authors} est en attente de revue. \n\n Vous pouvez y accéder au lien suivant: http://localhost:3000/approval/new-case?id=${caseStudy._id}`,
            }
            this.sendEmail(mailOptions);
        }
    }

    sendWaitingForFinalConfirmationToDeputies(deputies: Array<User>, caseStudy: CaseStudy) {
        for(var deputy of deputies) {
            const mailOptions = {
                from: EMAIL_USERNAME,
                to: deputy.email,
                subject: "Une étude de cas revue requiert votre attention",
                text: `Une étude de cas revue nommée ${caseStudy.title} et écrite par ${caseStudy.authors} est en attente de confirmation finale. \n\n Vous pouvez y accéder au lien suivant: http://localhost:3000/approval/new-case?id=${caseStudy._id}`,
            }
            this.sendEmail(mailOptions);
        }
    }

    sendNewReviewSubmittedToComityDirector(directors: Array<User>, caseStudy: CaseStudy, reviewAuthor: string) {
        for(var director of directors) {
            const mailOptions = {
                from: EMAIL_USERNAME,
                to: director.email,
                subject: `Une nouvelle revue a été complétée pour l'étude de cas ${caseStudy.title}`,
                text: `Une nouvelle revue a été complétée par ${reviewAuthor} pour l\'étude de cas nommée ${caseStudy.title}. \n\n Vous pouvez y accéder au lien suivant: http://localhost:3000/approval/new-case?id=${caseStudy._id}`,
            }
            this.sendEmail(mailOptions);
        }
    }
}
