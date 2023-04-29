import React from "react";
import "./../fonts.scss";
import "./AboutPage.scss";
import LandingNavBar from "./landingNavBar/LandingNavBar";
import LandingValueGroupParagraph from "./landingValueGroupParagraph/LandingValueGroupParagraph";
export default function AboutPage() {
    return <div>
        <LandingNavBar></LandingNavBar>
        <header className="student-banner"></header>

            <div className="value-paragraphs-container">
                <LandingValueGroupParagraph content="des connaissances grâce à une plateforme collaborative" title={"Partager".toUpperCase()}></LandingValueGroupParagraph>
                <LandingValueGroupParagraph content="à un catalogue d’études de cas gratuites et payantes pour faciliter l’enseignement par le cas" title={"Accéder".toUpperCase()}></LandingValueGroupParagraph>
                <LandingValueGroupParagraph content="l’expérience entre génie et sciences sociales pour faire le pont entre le milieu universitaire et la pratique" title={"Jumeler".toUpperCase()}></LandingValueGroupParagraph>
                <LandingValueGroupParagraph content="la communauté pour déployer des solutions d’apprentissage renouvelées et innovantes" title={"Rassembler".toUpperCase()}></LandingValueGroupParagraph>
            </div>
        </div>;
}
