import React from "react";
import "./Results.scss";
import StarIcon from "@mui/icons-material/Star";
import { Button } from "@mui/material";

interface Props {
  //   onClick: () => void;
  title: React.ReactNode;
  auteurs: React.ReactNode;
  content: React.ReactNode;
  date: React.ReactNode;
  page: React.ReactNode;
  discipline: React.ReactNode;
  tags: string[];
  className: React.ReactNode;
  classNumber: React.ReactNode;
  rating: React.ReactNode;
  vote: React.ReactNode;
}

const Results: React.FC<Props> = ({
  // onClick,
  title,
  auteurs,
  content,
  date,
  page,
  discipline,
  tags,
  className,
  classNumber,
  rating,
  vote,
}) => {
  return (
    <div id="viewArticles">
      <div id="first">
        <div id="title">{title}</div>
        <div id="authors">Auteurs : {auteurs}</div>
        <div id="preview">{content}</div>
        <div id="date"> Date : {date}</div>
        <div id="page"> Nombre de pages : {page}</div>
        <div id="placement">
          <div id="discipline"> Discipline : {discipline}</div>
          <div id="positionButton">
            <Button className="consulter">Consulter</Button>
          </div>
        </div>
        <div id="tags"> Sujet(s) : {tags.join(", ")}</div>
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
