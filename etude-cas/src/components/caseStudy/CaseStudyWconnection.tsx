import React, { useCallback } from "react";
import "../../styles/LightCaseStudy.scss";
import Button from "@mui/material/Button";
import "../img/normal_search.svg";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { PieChart } from "react-minimal-pie-chart";
import Table from './Table';
import { useNavigate } from 'react-router-dom';

interface Props {}

const CaseStudyWTconnection: React.FC<Props> = ({}) => {
 const navigate = useNavigate();
 const handleOnClick = useCallback(() => navigate('/catalogue'), [navigate]);

  return (
    <div id="main">
      <div id="profile">
        <AccountCircle sx={{ verticalAlign: "middle", fontSize: "32px" }} />
        Professeur
      </div>
      <div id="main-line"></div>
      <div>
        <Button className="return" onClick={handleOnClick}>
          &gt; Retour au catalogue
        </Button>
        <div className="section">
          <div className="section-line"></div>
          <div id="first">
            <div id="title">
              Littéralement en changement
              <div id="subtitle">
                L’impact de la COVID-19 sur l’écosystème littéraire québécois
              </div>
            </div>
            <br />
            <div id="information">
              <div>
                Au début de l’année 2020, la pandémie de la COVID-19 a frappé de
                plein fouet le milieu littéraire. Fragilisé, l’écosystème
                littéraire a subi une énième vague de transformation. Les
                bibliothèques ont fermé. Les salons du livre, les lancements et
                les événements culturels ont été reportés ou carrément annulés.
                Les retards de paiement des éditeurs s’accumulent. Le droit de
                représentation empêche bon nombre d’auteurs et d’autrices de
                présenter leurs livres, même virtuellement. L’industrie du livre
                est-elle en crise?
              </div>
              <div>
                <div>
                  <b>Auteurs :</b> Virginie Francoeur, Annie Passalacqua
                </div>
                <div>
                  <b>Discipline :</b> Génie industriel
                </div>
                <div>
                  <b>Sujet(s) :</b> Gestion du changement
                </div>
                <div>
                  <b>Nombre de pages :</b> 9
                </div>
                <div>
                  <b>Date :</b> 2021-02-28
                </div>
              </div>
            </div>
          </div>

          <Button
            id="use-case"
            variant="contained"
            onClick={() => console.log("You clicked")}
          >
            Utiliser ce cas
          </Button>
          <Button variant="outlined" onClick={() => console.log("You clicked")}>
            Consulter
          </Button>
        </div>
        <div className="section">
          <div className="section-line"></div>
          <div id="usage-historic">
            <h3>Historique d'utilisation</h3>
            <PieChart className="pie-chart"
              data={[
                { title: "IND3202", value: 75, color: "#44546a" },
                { title: "IND8107", value: 25, color: "#C13C37" },
              ]} 
              label={({ dataEntry }) => `${Math.round(dataEntry.percentage)} %`}
            />

            <PieChart className="pie-chart"
              data={[
                { title: "Travail Dirigé (laboratoire)", value: 25, color: "#44546a" },
                { title: "Discussion en sous-groupes", value: 25, color: "#C13C37" },
                { title: "Devoir / Projet", value: 50, color: "#8396af" },
              ]} 
              label={({ dataEntry }) => `${Math.round(dataEntry.percentage)} %`}
            />
          </div>
        </div>
        <div className="section">
          <div className="section-line"></div>
          <Table></Table>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyWTconnection;
