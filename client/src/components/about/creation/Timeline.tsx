import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import "./Timeline.scss";

export default function CustomizedTimeline() {
  return (
    <Timeline position="alternate">
      <TimelineItem>
        <TimelineOppositeContent>
          <b>Printemps et été 2021</b>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: "12px", px: 2 }}>
          <Typography>
            <ul>
              <li>Idéation</li>
              <li>Demande de subventions</li>
              <li>Création de l'équipe projet</li>
            </ul>
          </Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent>
          <b>Septembre 2021</b>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: "12px", px: 2 }}>
          <div className="eventsList">
            <ul>
              <li>Étude de marché des centres de cas existants</li>
              <li>Identification des parties prenantes du LAC</li>
            </ul>
          </div>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineOppositeContent>
          <b>Octobre 2021</b>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: "12px", px: 2 }}>
          <Typography>
            <ul>
              <li>Rédaction des questionnaires et des guides d’entretien</li>
            </ul>
          </Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent>
          <b>Novembre 2021</b>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: "12px", px: 2 }}>
          <div className="eventsList">
            <ul>
              <li>
                <a
                  href="http://localhost:3001/api/images/revue-de-litterature.png"
                  target="_blank"
                >
                  Revue de la littérature
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:3001/api/images/sondage-et-entrevues.png"
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
        <TimelineOppositeContent>
          <b>Décembre 2021</b>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: "12px", px: 2 }}>
          <Typography>
            <ul>
              <li>
                <a
                  href="http://localhost:3001/api/images/methodologie-conception.png"
                  target="_blank"
                >
                  Définition des fonctions utilisateurs de la plateforme et la
                  méthdologie pour la conception
                </a>
              </li>
            </ul>
          </Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent>
          <b>Janvier 2022</b>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: "12px", px: 2 }}>
          <div className="eventsList">
            <ul>
              <li>
                <a
                  href="http://localhost:3001/api/images/processus.png"
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
        <TimelineOppositeContent>
          <b>Février 2022</b>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: "12px", px: 2 }}>
          <Typography>
            <ul>
              <li>Rédaction du plan d’affaires</li>
            </ul>
          </Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent>
          <b>Mars 2022</b>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: "12px", px: 2 }}>
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
          <b>Été 2022</b>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: "12px", px: 2 }}>
          <Typography>
            <ul>
              <li>Développement de la plateforme numérique (site web)</li>
              <li>Création des gabarit pour les cas</li>
              <li>Création du comité scientifique</li>
            </ul>
          </Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent>
          <b>Automne 2022</b>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ py: "12px", px: 2 }}>
          <div className="eventsList">
            <ul>
              <li>Édition des premiers cas</li>
              <li>Lancement de la plateforme à l’interne (phase 1)</li>
            </ul>
          </div>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
