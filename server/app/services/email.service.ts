import { Service } from 'typedi';
import * as nodemailer from 'nodemailer';
import { EMAIL_USERNAME, EMAIL_PASSWORD } from '@app/constant/constant';
import { CaseStudy } from '@app/models/caseStudy.model';
import { User } from '@app/models/user.model';
import { ApprovalDecision } from '@app/models/ApprovalDecision';
import { Role } from '@app/models/Role';

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
                console.log("Email sent from " + mailOptions?.from + " to " + mailOptions?.to + " with subject " + mailOptions?.subject);
            }
        }
        );
    }

    sendWelcomeEmail(userEmail: string, userName: string, userRole: string) {
        if(userRole == Role.ProfessorNotApproved) {
            const mailOptions = {
                from: EMAIL_USERNAME, 
                to: userEmail,
                subject: 'Bienvenue au Laboratoire d\'Apprentissage par les Cas (LAC) !',
                html: `
                    <p>Cher(e) ${userName},</p>
                    <br>
                    <p>Nous sommes ravis de vous accueillir au sein du Laboratoire d'Apprentissage par les Cas (LAC) en tant que professeur(e)! 🚀 </p>
                    <br>   
                    <p>Notre adjoint administratif ne devrait pas tarder à réviser votre preuve de statut! En attendant, nous vous recommandons fortement de jeter un coup d'oeil à nos <a href="${process.env.REACT_APP_BASE_API_URL}/guide}" target="_blank">guide pédagogiques</a>.</p>
                    <p>Ceux-ci ont été soigneusement élaborés pour vous accompagner dans la rédaction et l'animation d'étude de cas</p>
                    <br>
                    <p>Vous pouvez sans plus tarder consulter l'entiereté de nos études de cas à l'adresse suivante:  ${process.env.REACT_APP_BASE_API_URL}/catalogue</p>
                    <br>
                    <p>Bienvenue au Laboratoire d'Apprentissage par les Cas !
                    <br>
                    <p>Cordialement,<br>L'Équipe du LAC</p>
                `,
            };
            this.sendEmail(mailOptions);
        }
        else {
            const mailOptions = {
                from: EMAIL_USERNAME, 
                to: userEmail,
                subject: 'Bienvenue au Laboratoire d\'Apprentissage par les Cas (LAC) !',
                html: `
                    <p>Cher(e) ${userName},</p>
                    <br>
                    <p>Nous sommes ravis de vous accueillir au sein du Laboratoire d'Apprentissage par les Cas (LAC) en tant qu'étudiant! 🚀</p>
                    <br>
                    <p>Vous pouvez sans plus tarder consulter l'entiereté de nos études de cas à l'adresse suivante:  ${process.env.REACT_APP_BASE_API_URL}/catalogue</p>
                    <br>
                    <p>Bienvenue au Laboratoire d'Apprentissage par les Cas !
                    <br>
                    <p>Cordialement,<br>L'Équipe du LAC</p>
                `,
            };
            this.sendEmail(mailOptions);
        }
    }

    sendNewUserEmail(deputies: Array<User>) {
        for(var deputy of deputies) {
            const mailOptions = {
                from: EMAIL_USERNAME,
                to: deputy.email,
                subject: "Un nouvel enseignant s'est enregistré",
                text: 
                    `Cher(e) ${deputy.email},`+
                    `\n\nUn nouvel enseignant s'est enregistré à la plateforme et nécessite la vérification de son statut de professeur.`+
                    `\n\nRendez-vous à l'adresse suivante pour effectuer celle-ci: ${process.env.REACT_APP_BASE_API_URL}/dashboard</p>`+
                    `\n\nCordialement,`+
                    `\n\nL'Équipe du LAC`,
            };
            this.sendEmail(mailOptions);
        }
    }

    sendResetPasswordEmail(userEmail: string, resetToken: string) {
        const mailOptions = {
            from: EMAIL_USERNAME,
            to: userEmail,
            subject: "Réinitialiser votre mot de passe",
            text: 
                `Cher(e) ${userEmail},`+
                `\n\nUne demande de réinitialisation du mot de passe a été réclamé pour le compte LAC associé à cette adresse courriel.` +
                `\n\nPour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant : ${process.env.REACT_APP_BASE_API_URL}/reset-password/${resetToken}` +
                `\n\nCordialement,`+
                `\n\nL'Équipe du LAC`,
        }
        this.sendEmail(mailOptions);
    }

    sendConfirmPasswordReset(userEmail: string) {
        const mailOptions = {
            from: EMAIL_USERNAME,
            to: userEmail,
            subject: "Mot de passe réinitialisé",
            text: 
                `Cher(e) ${userEmail},\n\n `+
                `\n\nVotre mot de passe a été réinitialisé avec succès.` +
                `\n\nCordialement,`+
                `\n\nL'Équipe du LAC`,
        }
        this.sendEmail(mailOptions);
    }

    sendApprovalResultToTeacher(userEmail: string, isApproved: boolean) {
        const mailOptions = {
            from: EMAIL_USERNAME,
            to: userEmail,
            subject: "Votre preuve d'identité a été évaluée",
            text: `Cher(e) ${userEmail},\n\n `+
                isApproved ? `Votre compte a été approuvé. Vous pouvez dès maintenant déposer votre première étude de cas sur notre plateforme: ${process.env.REACT_APP_BASE_API_URL}/catalogue .` : `Votre compte a été rejeté. Veuillez nous contacter directement pour nous faire parvenir une seconde preuve.`+
                `\n\nCordialement,`+
                `\n\nL'Équipe du LAC`
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
            subject: `L'étude de cas nommée ${caseStudy.title}` + (isPreApproved ? ` a été préapprouvée` : ` a été rejetée par l'adjoint administratif`), 
            text: `Cher(e) ${email},`+
                    `\n\nVotre étude de cas nommée ${caseStudy.title} et écrite par ${caseStudy.authors}` + 
                    (isPreApproved ? ` est maintenant prête à être évaluée par le comité scientifique.`
                                   : ` requiert des changements. Les critères suivants n'étaient pas respectés : \n\n` +`${criteriaText}`) +
                    `\n\nCliquez sur le lien suivant pour consulter celle-ci : ${process.env.REACT_APP_BASE_API_URL}/my-pending-case-studies/case-edit?id=${caseStudy._id}`+
                    `\n\nCordialement,`+
                    `\n\nL'Équipe du LAC`
                    ,
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
            text: `Cher(e) ${email},
                    \n\nVotre étude de cas nommée ${caseStudy.title}, écrite par ${caseStudy.authors}` + 
                    `${decisionText} Consultez l'évaluation complète ci-dessous: \n\n${feedback}` + 
                    `\n\nCliquez ici pour y consulter son statut: ${process.env.REACT_APP_BASE_API_URL}/my-pending-case-studies/case-edit?id=${caseStudy._id}`+
                    `\n\nCordialement,`+
                    `\n\nL'Équipe du LAC`,
        }
        this.sendEmail(mailOptions);
    }

    sendNotifyCaseStudyPublishedToUser(email: string, caseStudy: CaseStudy) {
        const mailOptions = {
            from: EMAIL_USERNAME,
            to: email,
            subject: `Votre étude de cas nommée ${caseStudy.title} a été publiée`,
            text: `Cher(e) ${email},`+
                    `\n\nFélicitations! Votre étude de cas nommée ${caseStudy.title} et écrite par ${caseStudy.authors} a terminé avec succès le processus d'approbation et est désormais publiée sur notre plateforme. \n\n Vous pouvez accéder à sa version publiée au lien suivant: ${process.env.REACT_APP_BASE_API_URL}/catalogue`+
                    `\n\nCordialement,`+
                    `\n\nL'Équipe du LAC`,
        }
        this.sendEmail(mailOptions);
    }

    sendPreApprovalNeededToDeputies(deputies: Array<User>, caseStudy: CaseStudy, isModifiedCaseStudy: boolean) {
        for(var deputy of deputies) {
            const mailOptions = {
                from: EMAIL_USERNAME,
                to: deputy.email,
                subject: isModifiedCaseStudy? `Une étude de cas modifiée requiert votre attention à nouveau`: `Une nouvelle étude de cas requiert votre attention`,
                text: `Cher(e) ${deputy.email},` +
                (isModifiedCaseStudy? `Une étude de cas modifiée`: `Une nouvelle étude de cas`) + `nommée ${caseStudy.title} et écrite par ${caseStudy.authors} est en attente de préapprobation.`+
                `\n\nCliquez sur le lien suivant pour y accéder : ${process.env.REACT_APP_BASE_API_URL}/approval/new-case?id=${caseStudy._id}`+
                `\n\nCordialement,`+
                `\n\nL'Équipe du LAC`,
            }
            this.sendEmail(mailOptions);
        }
    }

    sendReviewNeededToDirector(directors: Array<User>, caseStudy: CaseStudy) {
        for(var director of directors) {
            const mailOptions = {
                from: EMAIL_USERNAME,
                to: director.email,
                subject: "Une étude de cas préapprouvée requiert votre attention",
                text: `Cher(e) ${director.email},` +
                `\n\nUne étude de cas préapprouvée nommée ${caseStudy.title} et écrite par ${caseStudy.authors} est en attente de révision.` + 
                `\n\n Vous pouvez y accéder par le lien suivant : ${process.env.REACT_APP_BASE_API_URL}/approval/new-case?id=${caseStudy._id}`+
                `\n\nCordialement,`+
                `\n\nL'Équipe du LAC`,
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
                text: `Cher(e) ${deputy.email},`+
                `\n\nUne étude de cas revue, nommée ${caseStudy.title} et écrite par ${caseStudy.authors}, est en attente de confirmation finale.`+
                `\n\n Vous pouvez y accéder au lien suivant : ${process.env.REACT_APP_BASE_API_URL}/approval/new-case?id=${caseStudy._id}`+
                `\n\nCordialement,`+
                `\n\nL'Équipe du LAC`,
            }
            this.sendEmail(mailOptions);
        }
    }

    sendNewReviewSubmittedToComityDirector(directors: Array<User>, caseStudy: CaseStudy, reviewAuthor: string) {
        for(var director of directors) {
            const mailOptions = {
                from: EMAIL_USERNAME,
                to: director.email,
                subject: `Une nouvelle révision a été complétée pour l'étude de cas ${caseStudy.title}`,
                text: `Cher(e) ${director.email},`+
                `\n\nUne nouvelle révision a été complétée par ${reviewAuthor} pour l\'étude de cas nommée ${caseStudy.title}.`+
                `\n\n Vous pouvez y accéder par le lien suivant : ${process.env.REACT_APP_BASE_API_URL}/approval/new-case?id=${caseStudy._id}`+
                `\n\nCordialement,`+
                `\n\nL'Équipe du LAC`,
            }
            this.sendEmail(mailOptions);
        }
    }

    sendReviewConvertedToFreeToUser(email: string, caseStudy: CaseStudy, comments: string) {
        const mailOptions = {
            from: EMAIL_USERNAME,
            to: email,
            subject: `Votre étude de cas nommée ${caseStudy.title} a été rejetée`,
            text: `Cher(e) ${email},`+
            `\n\nVotre étude de cas nommée ${caseStudy.title}, écrite par ${caseStudy.authors} a été rejetée. Celle-ci a été redirigée vers le processus d'approbation des études de cas gratuites. Consultez l'évaluation complète ci-dessous :`+
            `\n\n${comments}` + 
            `\n\n Cliquez ici pour y consulter son statut : ${process.env.REACT_APP_BASE_API_URL}/my-pending-case-studies/case-edit?id=${caseStudy._id}`+
            `\n\nCordialement,`+
            `\n\nL'Équipe du LAC`,
        }
        this.sendEmail(mailOptions);
    }
    sendReviewDeletedToUser(email: string, caseStudy: CaseStudy, comments: string) {
        const mailOptions = {
            from: EMAIL_USERNAME,
            to: email,
            subject: `Votre étude de cas nommée ${caseStudy.title} a été rejetée`,
            text: `Cher(e) ${email},`+
            `\n\nVotre étude de cas nommée ${caseStudy.title}, écrite par ${caseStudy.authors} a été rejetée. Celle-ci a été retirée du processus d'approbation. Consultez l'évaluation complète ci-dessous : \n\n${comments}` +
            `\n\nCordialement,`+
            `\n\nL'Équipe du LAC`,
        }
        this.sendEmail(mailOptions);
    }
}
