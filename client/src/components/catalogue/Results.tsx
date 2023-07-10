import React from "react";
import "./Results.scss";
import StarIcon from "@mui/icons-material/Star";
import { AttachMoney } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Case } from "../../model/CaseStudy";
import { useNavigate } from "react-router-dom";

interface Props {
  caseData: Case;
}

const Results: React.FC<Props> = ({
  caseData,
}) => {
  const navigate = useNavigate();
  const onFreeCaseClick = () => {
    navigate('/etude-de-cas', { state: { caseData } });
  }

  return (
    <div id="viewArticles">
      <div id="first">
        <div id="title">
          <div>{caseData.title}</div>
          {(caseData.isPaidCase && <AttachMoney id="dollar-icon" />)}
        </div>
        <div id="authors">Auteurs : {caseData.authors}</div>
        <div id="date"> Date : {caseData.date.substring(0, 10)}</div>
        <div id="page"> Nombre de pages : {caseData.page}</div>
        <div id="placement">
          <div id="discipline"> Discipline : {caseData.discipline}</div>
          <div id="positionButton">
            {caseData.isPaidCase && <Button className="consulter" onClick={() => window.open(caseData.url as string, "_blank")}>Consulter</Button>}
            {!caseData.isPaidCase && <Button className="consulter" onClick={onFreeCaseClick}>Consulter</Button>}
          </div>
        </div>
        <div id="tags"> Sujet(s) : {caseData.subjects.join(", ")}</div>
      </div>
      <div id="second">
        <div id="ratings">
          <div><StarIcon />{caseData.ratings}</div>
          <div id="votes">({caseData.votes} votes)</div>
        </div>
        <div id="usedClass">Actuellement utilisé dans le cours : </div>
        <div id="name">
          <div>{caseData.classId}</div>
          <div>{"Class name unknown"}</div>
          <button id="info">Plus d'info</button>
        </div>
      </div>
    </div>
  );
};

export default Results;
