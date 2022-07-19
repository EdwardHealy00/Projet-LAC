import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "../../styles/Tabs.scss";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Aperçu" {...a11yProps(0)} />
          <Tab label="Matériels inclus" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <b>Portrait du milieu littéraire au Québec</b>
        <p>
          Le milieu littéraire est un écosystème en pleine effervescence dans
          l’économie des industries créatives. Des chantiers de transformation
          et des projets d’innovation sont en développement continu dans le
          secteur depuis l’avènement de la numérisation, nommons l’édition
          accessible, les activités littéraires en mode virtuel, l’impression de
          livres à la demande, le prêt numérique, les livres électroniques ou
          audio et sans oublier les tablettes qui ont accru l’accessibilité aux
          livres numériques.
        </p>
        <br />
        <b>Les impacts de la COVID-19</b>
        <br />
        Les acteurs du milieu littéraire soulignent les impacts de la pandémie
        sur leur pratique. « C’est un milieu culturel qui s’est relevé et qui a
        trouvé des solutions. Le secteur culturel qui a été le plus lucratif,
        c’est le secteur du livre. Il y a eu à la fois des retombées négatives
        et positives. Le fait qu’on a fermé les librairies, rouvert et refermé
        encore, ça a fait mal à l’industrie du livre », explique Claudia
        Larochelle, journaliste et autrice.
        <br />
        <br />
        <b>Objectifs pédagogiques</b>
        <br />
        <ol>
          <li>Identifier les déterminantes et la typologie du changement.</li>
          <li>
            Identifier et catégoriser les acteurs et les sources de pouvoir.
          </li>
          <li>
            Expliquer la résistance au changement et identifier des solutions.
          </li>
          <li>
            Décrire les impacts de la COVID-19 sur l’écosystème littéraire.
          </li>
          <li>
            Planifier et mettre en application des solutions en lien avec le
            changement.
          </li>
        </ol>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <h2>Informations utiles pour les responsables de cours</h2>
        <div id="infos">
          <div>
            <a href="/">Exemplaire gratuit de l’étude de cas pour l’enseignant *</a>
            <p>* Accéder à l’aperçu complet en vous connectant au compte éducateur</p>
          </div>
          <div>
            <a href="/">Notes pédagogiques *</a>
            <p>* Documentation complète sur la méthodologie pédagogique</p>
          </div>
          <div>
            <a href="/">Cas multimédia avec vidéos *</a>
            <p>* Liens aux vidéos sont inclus dans l’étude de cas</p>
          </div>
        </div>
      </TabPanel>
    </Box>
  );
}
