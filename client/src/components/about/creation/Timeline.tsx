import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { downloadCaseStudyTemplate } from "../../../utils/FileDownloadUtil";
import "./Timeline.scss";

export default function CustomizedTimeline() {
  return (
    <Timeline position="alternate" className="timeline">
      <TimelineItem>
        <TimelineOppositeContent>
        <div className="eventsList">
          <b>Printemps et été 2021</b>
        </div>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
        <div className="eventsList">
            <ul>
              <li>Idéation</li>
              <li>Demande de subventions</li>
              <li>Création de l'équipe projet</li>
            </ul>
          </div>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent>
        <div className="eventsList">
          <b>Automne 2021</b>
        </div>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <div className="eventsList">
            <ul>
              <li>Étude de marché des centres de cas existants</li>
              <li>Identification des parties prenantes du LAC</li>
            </ul>
          </div>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <div className="eventsList">
            <ul>
              <li>Rédaction des questionnaires et des guides d’entretien</li>
            </ul>
          </div>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <div className="eventsList">
            <ul>
              <li>
                <a
                  href={`${process.env.REACT_APP_BASE_API_URL}/api/images/revue-de-litterature.png`}
                  target="_blank"
                >
                  Revue de la littérature
                </a>
              </li>
              <li>
                <a
                  href={`${process.env.REACT_APP_BASE_API_URL}/api/images/sondage-et-entrevues.png`}
                  target="_blank"
                >
                  Sondages et entrevues avec les parties prenantes
                </a>
              </li>
              <li>Analyse des résultats</li>
              <li>Définition des besoins du LAC</li>
            </ul>
          </div>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <div className="eventsList">
            <ul>
              <li>
                <a
                  href={`${process.env.REACT_APP_BASE_API_URL}/api/images/methodologie-conception.png`}
                  target="_blank"
                >
                  Définition des fonctions utilisateurs de la plateforme et la
                  méthdologie pour la conception
                </a>
              </li>
            </ul>
          </div>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent>
        <div className="eventsList">
          <b>Hiver 2022</b>
        </div>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <div className="eventsList">
            <ul>
              <li>
                <a
                  href={`${process.env.REACT_APP_BASE_API_URL}/api/images/processus.png`}
                  target="_blank"
                >
                  Cartographies des processus
                </a>
              </li>
            </ul>
          </div>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <div className="eventsList">
            <ul>
              <li>Rédaction du plan d’affaires</li>
            </ul>
          </div>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <div className="eventsList">
            <ul>
              <li>Développement des schémas d’interface</li>
              <li>Évaluation des coûts</li>
            </ul>
          </div>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineOppositeContent>
          <div className="eventsList">
            <b>Été 2022</b>
          </div>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <div className="eventsList">
            <ul>
              <li>Développement de la plateforme numérique (site web)</li>
            </ul>
          </div>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent>
          <div className="eventsList">
            <b>Automne 2022</b>
          </div>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <div className="eventsList">
            <ul>
              <li>
                Création des{" "}
                <a onClick={() => downloadCaseStudyTemplate()} style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>
                  gabarits
                </a>{" "}
                pour les cas
              </li>
              <li>Création du comité scientifique</li>
            </ul>
          </div>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent>
          <div className="eventsList">
            <b>Hiver 2023</b>
          </div>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <div className="eventsList">
            <ul>
              <li>Édition des premiers cas</li>
            </ul>
          </div>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent>
          <div className="eventsList">
            <b>Été et automne 2023</b>
          </div>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <div className="eventsList">
            <ul>
              <li>
                Poursuite du développement de la plateforme (prétest et mise à
                jour)
              </li>
              <li>
                Création de{" "}
                <a href="/guide" target="_blank">
                  guides pédagogiques
                </a>{" "}
              </li>
            </ul>
          </div>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent>
          <div className="eventsList">
            <b>Hiver 2024</b>
          </div>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <div className="eventsList">
            <ul>
              <li>Lancement de la plateforme à l’interne</li>
            </ul>
          </div>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
