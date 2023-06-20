import React from "react";
import "./Results.scss";
import StarIcon from "@mui/icons-material/Star";
import { AttachMoney } from "@mui/icons-material";
import { Button } from "@mui/material";

interface Props {
  isPaid: React.ReactNode;
  title: React.ReactNode;
  auteurs: React.ReactNode;
  content: React.ReactNode;
  date: React.ReactNode;
  page: React.ReactNode;
  discipline: React.ReactNode;
  subjects: string[];
  className: React.ReactNode;
  classNumber: React.ReactNode;
  rating: React.ReactNode;
  vote: React.ReactNode;
  url: React.ReactNode;
}

const Results: React.FC<Props> = ({
  isPaid,
  title,
  auteurs,
  content,
  date,
  page,
  discipline,
  subjects,
  className,
  classNumber,
  rating,
  vote,
  url
}) => {
  return (
    <div id="viewArticles">
      <div id="first">
        <div id="title">
          <div>{title}</div>
          {(isPaid && <AttachMoney id="dollar-icon" />)}
        </div>
        <div id="authors">Auteurs : {auteurs}</div>
        <div id="preview">{content}</div>
        <div id="date"> Date : {date}</div>
        <div id="page"> Nombre de pages : {page}</div>
        <div id="placement">
          <div id="discipline"> Discipline : {discipline}</div>
          <div id="positionButton">
            {isPaid && <Button className="consulter" onClick={() => window.open(url as string, "_blank")}>Consulter</Button>}
            {!isPaid && <Button className="consulter">Consulter</Button>}
          </div>
        </div>
        <div id="tags"> Sujet(s) : {subjects.join(", ")}</div>
      </div>
      <div id="second">
        <div id="ratings">
          <div><StarIcon />{rating}</div>
          <div id="votes">({vote} votes)</div>
        </div>
        <div id="usedClass">Actuellement utilisé dans le cours : </div>
        <div id="name">
          <div>{classNumber}</div>
          <div>{className}</div>
          <button id="info">Plus d'info</button>
        </div>
      </div>
    </div>
  );
};

export default Results;
