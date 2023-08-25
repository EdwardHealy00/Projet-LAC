import React, {useRef} from "react";
import "./../fonts.scss";
import "./AboutPage.scss";
import LandingNavBar from "./landingNavBar/LandingNavBar";
import LandingValueGroupParagraph from "./landingValueGroupParagraph/LandingValueGroupParagraph";
import BrainSeparator from "./brainSeparator/BrainSeparator";
import ColoredTag from "./coloredTag/ColoredTag";
import CircleIcon from "./circleIcon/CircleIcon";
import TEACH from "../../img/icons/teach.svg";
import CATALOG from "../../img/icons/catalog.svg";
import HEART from "../../img/icons/heart.svg";
import LIGHT from "../../img/icons/light.svg";
import MEDIA from "../../img/icons/media.svg";
import PENCIL from "../../img/icons/pencil.svg";
import SPELL from "../../img/icons/spell.svg";
import Login, {LoginRef} from "../connection/Login";
import {TeamMember} from "../../model/Team";
import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
export default function AboutPage() {

    const loginRef = useRef<LoginRef | null>(null);
    const teamMembersManagement: TeamMember[] = [
        {
            id: 1,
            name: "Virginie Francoeur",
            title: "Ph.D",
            role: "Fondatrice et directrice du LAC",
            occupation: "Professeure adjointe, gestion du changement",
            picture: "./img/member1.jpg",
        },
        {
            id: 2,
            name: "Grégoire Banse",
            role: "Adjoint à la direction",
            occupation: "Étudiant, génie industriel",
            picture: "./img/member2.jpg",
        },
        {
            id: 3,
            name: "Olivier Gendreau",
            title: "Ph.D",
            role: "Gestion du volet technologique",
            occupation: "Maître d'enseignement, génie logiciel",
            picture: "./img/member3.jpg",
        },
    ];

    const teamMembersComity: TeamMember[] = [
        {
            id: 1,
            name: "Virginie Francoeur",
            title: "Ph.D",
            occupation: "Professeure adjointe, gestion du changement",
            picture: "./img/member1.jpg",
        },
        {
            id: 4,
            name: "Samira Keivanpour",
            title: "Ph.D",
            occupation: "Professeure adjointe, sujet",
            picture: "./img/member4.jpg",
        },
        {
            id: 5,
            name: "Fabiano Armellini",
            title: "Ph.D",
            occupation: "Professeur agrégé, entrepreunariat technologique",
            picture: "./img/member5.jpg",
        },
    ];
    const studentsPrisme: TeamMember[] = [
        {
            id: 1,
            name: "Annabelle Auger",
            picture: "./img/student1.png",
        },
        {
            id: 2,
            name: "Arlo Demsepy",
            picture: "./img/student2.png",
        },
        {
            id: 3,
            name: "Aurélie Dumont-Lavoie",
            picture: "./img/student3.png",
        },
        {
            id: 4,
            name: "David Jiang",
            picture: "./img/student4.png",
        },
        {
            id: 5,
            name: "Cristian Samson",
            picture: "./img/student5.png",
        },
        {
            id: 6,
            name: "Anthony Prost-A-Petit",
            picture: "./img/student6.png",
        },
    ];

    const studentsLog: TeamMember[] = [
        {
            id: 7,
            name: "Sophie Baillargeon-Laporte",
            picture: "./img/student7.png",
        },
        {
            id: 8,
            name: "Yanis Toubal",
            picture: "./img/student8.png",
        },
        {
            id: 9,
            name: "Jimmy Bell",
            title: "B. Ing., CPI",
            picture: "./img/member2.jpg",
        },
        {
            id: 10,
            name: "Charles Poulin",
            picture: "./img/member2.jpg",
        },
        {
            id: 11,
            name: "Edward Haley",
            picture: "./img/member2.jpg",
        },
    ];
    return <div>
            <LandingNavBar></LandingNavBar>
            <header className="student-banner">
                <div></div>
                <div id="access-platform">
                    <Login ref={loginRef}/>
                </div>
            </header>
            <div className="landing-segment-container">
                <div className="landing-segment-column-left">
                    <h1 id="a-propos">À propos</h1>
                    <div className="value-paragraphs-container">
                        <LandingValueGroupParagraph content="des connaissances grâce à une plateforme collaborative" title={"Partager".toUpperCase()}></LandingValueGroupParagraph>
                        <LandingValueGroupParagraph content="à un catalogue d’études de cas pour faciliter l’enseignement par les cas" title={"Accéder".toUpperCase()}></LandingValueGroupParagraph>
                        <LandingValueGroupParagraph content="les compétences entre génie et sciences sociales pour faire le pont entre le milieu universitaire et la pratique" title={"Jumeler".toUpperCase()}></LandingValueGroupParagraph>
                        <LandingValueGroupParagraph content="la communauté étudiante et professorale pour déployer des solutions d’apprentissage renouvelées et innovantes" title={"Rassembler".toUpperCase()}></LandingValueGroupParagraph>
                    </div>
                </div>
            </div>
            <BrainSeparator></BrainSeparator>
            <div className="landing-segment-container">
                <div className="landing-segment-column-left">
                    <h1 id="mission">Mission, vision, pertinence et compétences promues</h1>
                    <div className="mission-container">
                        <div className="colored-tag-pair-container">
                            <ColoredTag tag="MISSION" backgroundColor="#FA961E"></ColoredTag>
                            <div>Proposer des approches pédagogiques diversifiées et adaptées afin de favoriser l’acquisition de nouvelles compétences par les ingénieures et ingénieurs et les gestionnaires de demain en rendant la formation plus professionnalisante et plus axée sur les aspects humains et environnementaux.</div>
                        </div>
                        <div className="colored-tag-pair-container">
                            <ColoredTag tag="VISION" backgroundColor="#7FC348"></ColoredTag>
                            <div>Devenir une référence en innovation pédagogique en génie et sciences sociales au sein de Polytechnique Montréal et dans la francophonie.</div>
                        </div>
                        <div className="colored-tag-pair-container">
                            <ColoredTag tag="PERTINENCE" backgroundColor="#C3272E"></ColoredTag>
                            <div>Les tendances technologiques, principalement la robotisation, la numérisation et l’intelligence artificielle entraîneront une transformation des milieux de travail et des relations entre les personnes. Ces changements nécessiteront une adaptation, une agilité et une flexibilité des étudiantes et étudiants, et c’est notamment par l’entremise des études de cas que ces compétences pourront être acquises plus rapidement.</div>
                        </div>
                        <div className="colored-tag-pair-container">
                            <ColoredTag tag="COMPÉTENCES" backgroundColor="#FA961E"></ColoredTag>
                            <div className="bullet-lists-container">
                                <ul>
                                    <li>Adaptabilité</li>
                                    <li>Communication</li>
                                    <li>Collaboration</li>
                                    <li>Éthique</li>
                                    <li>Empathie</li>
                                </ul>
                                <ul>
                                    <li>Leadership</li>
                                    <li>Ouverture d'esprit</li>
                                    <li>Pensée critique</li>
                                    <li>Persuasion</li>
                                    <li>Résolution de problèmes</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <h1 id="besoin">Besoins auxquels répond le LAC</h1>
                    <div className="needs-container">
                        <p className="paragraph-font">
                            À la lumière des nombreuses tendances qui influent sur la pratique de l’ingénierie, un <a href="https://www.oiq.qc.ca/wp-content/uploads/documents/public/Etude_OIQ_Profil_Ing_2021.pdf" target="_blank">récent rapport de l’Ordre des ingénieurs du Québec (2021)</a> soutient que les diplômé·e·s devront non seulement maîtriser des compétences techniques inhérentes à leur discipline, mais devront également déployer de nombreuses autres compétences relevant davantage du champ des sciences sociales et humaines. Le rôle des ingénieures et ingénieurs est résolument transversal, il ne se limite plus à la compréhension et à la maîtrise des enjeux techniques, mais englobent également des enjeux sociaux.
                        </p>
                        <p className="paragraph-font">
                            Par ailleurs, les compétences sociales ne semblent pas être totalement maîtrisées par les futurs ingénieures et ingénieurs. En effet, lors d’un sondage mené par l’Ordre des ingénieurs (2021), un constat est frappant : « malgré une solide formation universitaire sur le plan des compétences dites dures, plusieurs ont mentionné ne pas être suffisamment outillés à la sortie de l’université pour gérer cette complexité d’un point de vue humain » (p.91). C’est pour répondre à ces défis que le LAC a été créé.
                        </p>
                        <p className="paragraph-font">
                            L’apprentissage par les cas offre des avantages uniques : il met l’accent sur le développement des compétences sociales et humaines, favorise les échanges d’idées et permet d’analyser de réelles problématiques organisationnelles et industrielles dans le but d’accélérer l’entrée sur le marché du travail des étudiantes et étudiants et leur prise de décision dans les organisations.
                        </p>
                    </div>
                </div>
            </div>
            <BrainSeparator></BrainSeparator>
            <div className="landing-segment-container">
                <div className="landing-segment-column-left">
                    <h1 id="mission">Spécificités du LAC</h1>
                    <div className="all-items-margins">
                        <div className="item-lists-container">
                            <CircleIcon color="#C3272E" href={TEACH}></CircleIcon>
                            <div className="item-font">Promouvoir l'enseignement par les cas</div>
                        </div>
                        <div className="item-lists-container">
                            <CircleIcon color="#FA961E" href={MEDIA}></CircleIcon>
                            <div className="item-font">Proposer une variété de format (cas court, cas long, multimédia, podcase…)</div>
                        </div>
                        <div className="item-lists-container">
                            <CircleIcon color="#7FC348" href={CATALOG}></CircleIcon>
                            <div className="item-font">Offrir un catalogue de cas (payant et en libre accès)</div>
                        </div>
                        <div className="item-lists-container">
                            <CircleIcon color="#C3272E" href={SPELL}></CircleIcon>
                            <div className="item-font">Collaborer avec un éditeur reconnu, les Presses internationales Polytechnique, qui assure une révision linguistique rigoureuse</div>
                        </div>
                        <div className="item-lists-container">
                            <CircleIcon color="#41AAE6" href={HEART}></CircleIcon>
                            <div className="item-font">Donner son appréciation sur les cas pour offrir de la rétroaction aux autrices et auteurs de cas</div>
                        </div>
                        <div className="item-lists-container">
                            <CircleIcon color="#FA961E" href={PENCIL}></CircleIcon>
                            <div className="item-font">Jumeler l’expérience entre génie et sciences sociales et humaines</div>
                        </div>
                        <div className="item-lists-container">
                            <CircleIcon color="#7FC348" href={LIGHT}></CircleIcon>
                            <div className="item-font">Créer des ponts entre les enseignant·e·s, les étudiant·e·s et tous les types d'organisation (privé, public, parapublic, organisme sans but lucratif)</div>
                        </div>
                    </div>
                    </div>
            </div>
        <BrainSeparator></BrainSeparator>
        <div className="landing-segment-container">
            <div className="landing-segment-column-left">
                <h1 id="equipe">Équipe derrière le LAC</h1>
                <p className="item-font">Vous pouvez sélectionner les onglets pour découvrir les différentes personnes impliquées.</p>
                <div className="all-items-margins">
                    <Accordion sx={{ background: 'transparent' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Gestion
                        </AccordionSummary>
                        <AccordionDetails>
                                <div className="teamContent">
                                        {teamMembersManagement.map((member) => (
                                            <div className="team-list-item" key={member.id}>
                                                <img
                                                    src={member.picture}
                                                    alt={member.name}
                                                    className="teamMemberPicture"
                                                />
                                                <div>
                                                    {member.name}
                                                    {member.title && ", " + member.title} <br />
                                                    {member.role && (
                                                        <>
                                                            <b>{member.role}</b>
                                                            <br />
                                                        </>
                                                    )}
                                                    {member.occupation}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion sx={{ background: 'transparent' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Comité scientifique
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="teamContent">
                                    {teamMembersComity.map((member) => (
                                        <div className="team-list-item" key={member.id}>
                                            <img
                                                src={member.picture}
                                                alt={member.name}
                                                className="teamMemberPicture"
                                            />
                                            <div>
                                                {member.name}
                                                {member.title && ", " + member.title} <br />
                                                {member.role && (
                                                    <>
                                                        <b>{member.role}</b>
                                                        <br />
                                                    </>
                                                )}
                                                {member.occupation}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion sx={{ background: 'transparent' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Étudiants PRISME
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="teamContent">
                                {studentsPrisme.map((member) => (
                                    <div className="team-list-item" key={member.id}>
                                        <img
                                            src={member.picture}
                                            alt={member.name}
                                            className="teamMemberPicture"
                                        />
                                        <div>
                                            {member.name}
                                            {member.title && ", " + member.title} <br />
                                            {member.role && (
                                                <>
                                                    <b>{member.role}</b>
                                                    <br />
                                                </>
                                            )}
                                            {member.occupation}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion sx={{ background: 'transparent' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Étudiants en génie logiciel (développement)
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="teamContent">
                                {studentsLog.map((member) => (
                                    <div className="team-list-item" key={member.id}>
                                        <img
                                            src={member.picture}
                                            alt={member.name}
                                            className="teamMemberPicture"
                                        />
                                        <div>
                                            {member.name}
                                            {member.title && ", " + member.title} <br />
                                            {member.role && (
                                                <>
                                                    <b>{member.role}</b>
                                                    <br />
                                                </>
                                            )}
                                            {member.occupation}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AccordionDetails>
                    </Accordion>

                </div>
            </div>
        </div>
        </div>;
}
