import React from "react";
import logo from "../../img/logo-lac.png";
import "./Team.scss";
import "./About.scss";
import { TeamMember } from "../../model/Team";

export default function Team() {

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

  return (
    <div id="team">
      <div className="aboutHeader">
        <h2>Équipe de gestion</h2>
        <img src={logo} alt="LAC logo" />
      </div>
      <div className="teamContent">
        <div className="teamList">
          {teamMembersManagement.map((member) => (
            <div key={member.id}>
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
      </div>

      <div>
        Avec l’appui du:
        <div>Bureau d’Appui et d’Innovation Pédagogique (BAIP)</div>
        <div>Presses Internationales Polytechnique</div>
      </div>

      <div className="aboutHeader">
        <h2>Comité scientifique</h2>
        <img src={logo} alt="LAC logo" />
      </div>
      <div className="teamContent">
        <div className="teamList">
          {teamMembersComity.map((member) => (
            <div key={member.id}>
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
      </div>
    </div>
  );
}
