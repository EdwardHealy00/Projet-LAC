import React from "react";
import logo from "../../img/logo-lac.png";
import "./Mission.scss";
import "./About.scss";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import DescriptionIcon from "@mui/icons-material/Description";
import HubIcon from "@mui/icons-material/Hub";
import ApartmentIcon from "@mui/icons-material/Apartment";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import StarRateIcon from "@mui/icons-material/StarRate";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import WorkspacesIcon from "@mui/icons-material/Workspaces";

export default function Mission() {
  return (
    <div id="mission">
      <div className="aboutHeader">
        <h2>Mission, vision et compétences promues</h2>
        <img src={logo} alt="LAC logo" />
      </div>
      <div id="missionContent">
        <p>
          <b>Mission:</b> Accroître l’apprentissage de nouvelles compétences à
          acquérir pour les ingénieures et les ingénieurs de demain, en rendant
          la formation plus <b>professionnalisante</b> et plus axée sur
          les&nbsp;
          <b>aspects humains</b>.
          <SchoolIcon />
        </p>
        <br />
        <p>
          <b>Vision:</b> Devenir une référence en innovation pédagogique
          en&nbsp;
          <b>génie et sciences sociales</b> au sein de Polytechnique (2023-2024)
          et dans la francophonie (2025-2026).
          <GroupsIcon />
        </p>
        <div id="competenceSection">
          <b>Compétences promues</b>
          <div id="competenceList">
            <ul>
              <li>Adaptabilité</li>
              <li>Communication</li>
              <li>Collaboration</li>
              <li>Éthique</li>
              <li>Empathie</li>
            </ul>
            <ul>
              <li>Leadership</li>
              <li>Ouverte d'esprit</li>
              <li>Pensée critique</li>
              <li>Persuasion</li>
              <li>Résolution de problème</li>
            </ul>
          </div>
        </div>
        <div>
          <h2>Besoins auxquels répond le LAC</h2>
          <ul>
            <li>
              Le laboratoire d’apprentissage par les cas (LAC) s’inscrit dans le
              développement des nouvelles compétences à acquérir pour les
              ingénieures et ingénieurs de demain. À la lumière des tendances
              qui affecteront la profession de génie, le plus récent
              <a href="https://www.oiq.qc.ca/wp-content/uploads/documents/public/Etude_OIQ_Profil_Ing_2021.pdf">
                rapport de l’Ordre des ingénieurs
              </a>
              &nbsp; (2021) confirme que la communauté étudiante devra non
              seulement maîtriser des compétences techniques inhérentes à chaque
              discipline de génie, mais aussi des&nbsp;
              <b>compétences sociales</b> qui se retrouveront&nbsp;
              <b>au cœur du travail de l’ingénieur</b>. Par ailleurs, ces
              compétences sociales ne semblent pas être totalement maîtrisées
              par les futurs ingénieures et ingénieurs. En effet, lors d’un
              sondage mené par l’Ordre des ingénieurs (2021), un constat est
              frappant : « malgré une solide formation universitaire sur le plan
              des compétences dites dures, plusieurs ont mentionné ne pas être
              suffisamment outillés à la sortie de l’université pour gérer cette
              complexité d’un point de vue humain » (p.91). C’est pour répondre
              à ces défis que le LAC a été crée.
            </li>
            <br />
            <li>
              L’apprentissage par les cas offre des <b>avantages uniques</b> :
              il met l’accent sur le développement des compétences sociales,
              favorise les échanges d’idées et permet d’analyser de réelles
              problématiques organisationnelles et industrielles dans le but
              d’accélérer l’entrée sur le marché du travail des étudiantes et
              étudiants et leur prise de décision dans les organisations.
            </li>
          </ul>
        </div>
        <div>
          <h2>Spécifités du LAC</h2>
          <div id="specificityList">
            <div>
              <div>
                <CastForEducationIcon fontSize="large" />
                Promouvoir <b>l'enseignement par les cas</b>
              </div>
              <div>
                <LibraryBooksIcon fontSize="large" />
                Proposer une <b>variété de format</b> (cas court, cas long,
                multimedia, podcase…)
              </div>
              <div>
                <DescriptionIcon fontSize="large" />
                Offrir un <b>catalogue de cas</b> (payant et en libre accès)
              </div>
            </div>

            <div>
              <div>
                <HubIcon fontSize="large" />
                Promouvoir <b>l'enseignement par les cas</b>
              </div>
              <div>
                <ApartmentIcon fontSize="large" />
                Proposer une <b>variété de format</b> (cas court, cas long,
                multimedia, podcase…)
              </div>
              <div>
                <DoubleArrowIcon fontSize="large" />
                Offrir un <b>catalogue de cas</b> (payant et en libre accès)
              </div>
            </div>

            <div>
              <div>
                <StarRateIcon fontSize="large" />
                Donner <b>son appreciation</b> sur les cas pour offrir de la&nbsp;
                <b>retroaction</b> aux auteurs de cas
              </div>
              <div>
                <SplitscreenIcon fontSize="large" />
                Jumeler l’expérience entre <b>génie et sciences sociales</b>
              </div>
              <div>
                <WorkspacesIcon fontSize="large" />
                <b>Créer des ponts</b> entre les enseignants, les étudiants
                et les organisations
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
