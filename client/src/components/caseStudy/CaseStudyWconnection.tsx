import React, { useCallback } from "react";
import "./CaseStudy.scss";
import Button from "@mui/material/Button";
import "../img/normal_search.svg";
import { PieChart } from "react-minimal-pie-chart";
import Table from './Table';
import { useLocation, useNavigate } from 'react-router-dom';
import { Case } from "../../model/CaseStudy";

const CaseStudyWTconnection = () => {
  const state = useLocation().state as any;
  const newCase = state ? (state.caseData as Case) : state;

 const navigate = useNavigate();
 const handleOnClick = useCallback(() => navigate('/catalogue'), [navigate]);

  return (
    <div>
      <div id="main-line"></div>
      <div>
        <Button className="return" onClick={handleOnClick}>
          &gt; Retour au catalogue
        </Button>
        <div className="section">
          <div className="section-line"></div>
          <div id="first">
            <div id="title">{newCase.title}</div>
            <br />
            <div id="information">
              <div>{newCase.desc}</div>
              <div>
                <div>
                  <b>Auteurs :</b> {newCase.authors}
                </div>
                <div>
                  <b>Discipline :</b> Génie {newCase.discipline}
                </div>
                <div>
                  <b>Sujet(s) :</b> {newCase.subjects.join(", ")}
                </div>
                <div>
                  <b>Nombre de pages :</b> {newCase.page}
                </div>
                <div>
                  <b>Date :</b> {newCase.date.substring(0, 10)}
                </div>
              </div>
            </div>
          </div>

          <Button
            id="use-case"
            variant="contained"
            onClick={() => console.log("You clicked (use case)")}
          >
            Utiliser ce cas
          </Button>
          <Button variant="outlined" onClick={() => console.log("You clicked (consulter)")}>
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
