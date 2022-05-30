import React from "react";
import '../../styles/LightResults.css';

interface Props {
//   onClick: () => void;
  title: React.ReactNode;
  auteurs: React.ReactNode;
  content: React.ReactNode;
  date: React.ReactNode;
  page: React.ReactNode;
  children:React.ReactNode;
  discipline: React.ReactNode;
  tags: React.ReactNode;
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
  }) => { 
  return (
    <div id="viewArticles"> 
        <div id="title">{title}</div>
        <div id="authors">Auteurs : {auteurs}</div>
        <div id="preview">{content}</div>
        <div id="date"> Date : {date}</div>
        <div id="page"> Nombre de pages : {page}</div>
        <div id="discipline"> Discipline : {discipline}</div>
        <div id="tags"> Sujet(s) : {tags}</div>
    </div>
  );
}

export default Results;