import React from "react";
import "./../fonts.scss";
import "./AboutPage.scss";
import LandingNavBar from "./landingNavBar/LandingNavBar";
import LandingValueGroupParagraph from "./landingValueGroupParagraph/LandingValueGroupParagraph";
import BrainSeparator from "./brainSeparator/BrainSeparator";
import ColoredTag from "./coloredTag/ColoredTag";
export default function AboutPage() {
    return <div>
            <LandingNavBar></LandingNavBar>
            <header className="student-banner"></header>
            <div className="landing-segment-container">
                <div className="landing-segment-column-left">
                    <h1>À propos</h1>
                    <div className="value-paragraphs-container">
                        <LandingValueGroupParagraph content="des connaissances grâce à une plateforme collaborative" title={"Partager".toUpperCase()}></LandingValueGroupParagraph>
                        <LandingValueGroupParagraph content="à un catalogue d’études de cas gratuites et payantes pour faciliter l’enseignement par les cas" title={"Accéder".toUpperCase()}></LandingValueGroupParagraph>
                        <LandingValueGroupParagraph content="les compétences entre génie et sciences sociales pour faire le pont entre le milieu universitaire et la pratique" title={"Jumeler".toUpperCase()}></LandingValueGroupParagraph>
                        <LandingValueGroupParagraph content="la communauté étudiante et professorale pour déployer des solutions d’apprentissage renouvelées et innovantes" title={"Rassembler".toUpperCase()}></LandingValueGroupParagraph>
                    </div>
                </div>
            </div>
            <BrainSeparator></BrainSeparator>
            <div className="landing-segment-container">
                <div className="landing-segment-column-left">
                    <h1>Mission, vision, pertinence et compétences promues</h1>
                    <div className="mission-container">
                        <ColoredTag tag="MISSION" backgroundColor="#379321"></ColoredTag>
                    </div>
                </div>
            </div>
        </div>;
}
