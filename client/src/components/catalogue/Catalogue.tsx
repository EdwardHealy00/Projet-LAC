import React, { useMemo, useRef, useState } from "react";
import "./Catalogue.scss";
import SearchBar from "./SearchBar";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  InputBase,
  TextField,
  Typography,
  alpha,
  styled,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { Case } from "../../model/CaseStudy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Role } from "../../model/enum/Role";
import { UnlockAccess } from "../connection/UnlockAccess";
import { Download } from "@mui/icons-material";
import { Add } from "@mui/icons-material";
import { downloadCaseStudyTemplate } from "../../utils/FileDownloadUtil";
import Articles, { ArticlesRef } from "./Articles";

interface Filter {
  name: string;
  checkboxRef: EventTarget & HTMLInputElement;
}

export const Disciplines = [
  "Génie aérospatial",
  "Génie biomédical",
  "Génie chimique",
  "Génie civil",
  "Génie électrique",
  "Génie géologique",
  "Génie industriel",
  "Génie mécanique",
  "Génie des mines",
  "Mathématiques",
  "Sciences sociales",
];

export const Subjects = [
  "Automatisation",
  "Chaîne logistique",
  "Économie appliquée",
  "Entrepreneuriat",
  "Ergonomie du travail",
  "Gestion de projet",
  "Gestion de la qualité",
  "Gestion du changement",
  "Recherche opérationnelle",
  "Économie circulaire",
  "Développement durable",
];

export default function Catalogue() {
  const dates = [
    "0-3 mois",
    "4-8 mois",
    "9-12 mois",
    "1-2 ans",
    "3-6 ans",
    "7+ ans",
  ];
  const numberPages = ["1 à 4 pages", "5 à 10 pages", "11+ pages"];
  const [filters, setFilters] = React.useState<Filter[]>([]);
  const [typeFilters, setTypeFilters] = React.useState<string[]>([]);
  const [disciplineFilters, setDisciplineFilters] = React.useState<string[]>(
    []
  );
  const [subjectFilters, setSubjectFilters] = React.useState<string[]>([]);
  const [dateFilters, setDateFilters] = React.useState<string[]>([]);
  const [numberPagesFilters, setNumberPagesFilters] = React.useState<string[]>(
    []
  );
  const [authorsFilters, setAuthorsFilters] = React.useState<string[]>([]);
  const [caseStudyAuthors, setCaseStudyAuthors] = React.useState<string[]>([]);

  const articlesRef = useRef<ArticlesRef | null>(null);

  const onResetFilters = () => {
    for (const filter of filters) {
      filter.checkboxRef.click();
    }
    setFilters([]);
    setTypeFilters([]);
    setDisciplineFilters([]);
    setSubjectFilters([]);
    setDateFilters([]);
    setNumberPagesFilters([]);
    setAuthorsFilters([]);
  };

  const onCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    filtersType: string[]
  ) => {
    const checked = e.target.checked;
    const value = e.target.name;
    const newFilters = [...filters];
    const filtersToUpdate = [...filtersType];
    const filter: Filter = { name: value, checkboxRef: e.target };

    if (checked) {
      newFilters.push(filter);
      setFilters(newFilters);
      filtersToUpdate.push(value.toLowerCase());
    } else {
      newFilters.splice(newFilters.indexOf(filter), 1);
      setFilters(newFilters);
      filtersToUpdate.splice(filtersType.indexOf(value.toLowerCase()), 1);
    }
    return filtersToUpdate;
  };

  const onCheckboxChangeType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTypeFilters = onCheckboxChange(e, typeFilters);
    setTypeFilters(newTypeFilters);
  };

  const onCheckboxChangeDiscipline = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const displineFilters = onCheckboxChange(e, disciplineFilters);
    setDisciplineFilters(displineFilters);
  };

  const onCheckboxChangeSubject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSubjectFilters = onCheckboxChange(e, subjectFilters);
    setSubjectFilters(newSubjectFilters);
  };

  const onCheckboxChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateFilters = onCheckboxChange(e, dateFilters);
    setDateFilters(newDateFilters);
  };

  const onCheckboxChangeNumberPages = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newNumberPagesFilters = onCheckboxChange(e, numberPagesFilters);
    setNumberPagesFilters(newNumberPagesFilters);
  };

  const onCheckboxChangeAuthorName = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newAuthorsFilters = onCheckboxChange(e, authorsFilters);
    setAuthorsFilters(newAuthorsFilters);
  };

  const onDeleteChip = (filter: Filter) => {
    const newFilters = [...filters];
    filter.checkboxRef.click();
    newFilters.splice(filters.indexOf(filter), 1);
    setFilters(newFilters);
  };

  const theme = useTheme();
  const WhiteTypography = styled(Typography)({
    color: theme.palette.primary.contrastText, 
  });
  const WhiteButton = styled(Button)({
    color: theme.palette.primary.contrastText, 

    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.15), // Change to the desired hover color
    },
  });

  const getCaseStudyAuthors = async () => {
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/api/casestudies/authors`)
      .then((res) => {
        setCaseStudyAuthors(res.data);
      });
  };

  React.useEffect(() => {
    getCaseStudyAuthors();
  }, []);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!articlesRef.current) return;
    articlesRef.current.onSearch(e);
  };

  return (
    <div>
      <div
        id="rectangle"
        style={{ backgroundColor: theme.palette.primary.main }}
      >
        <WhiteTypography variant="h2" id="catalogue-title">
          Catalogue d'études de cas
        </WhiteTypography>
        <div id="search-bar">
          <SearchBar onFilter={onSearch}></SearchBar>
        </div>
        <UnlockAccess
          role={[Role.Professor]}
          children={
            <div id="addCaseRectangle">
              <WhiteButton
                variant="outlined"
                onClick={() => downloadCaseStudyTemplate()}
              >
                <Download></Download>
                Télécharger le gabarit
              </WhiteButton>
              <WhiteButton variant="contained" href="/create">
                <Add></Add>
                Ajouter une étude de cas
              </WhiteButton>
            </div>
          }
        ></UnlockAccess>
      </div>

      <div className="smallRectangle">
        <div id="type-de-contenu">Type de contenu :</div>
        {filters.map((filter) => (
          <Chip
            label={filter.name}
            variant="outlined"
            onDelete={() => onDeleteChip(filter)}
          />
        ))}
        <div id="effacer-tous-les-fil" onClick={onResetFilters}>
          Effacer tous les filtres
        </div>
      </div>
      <div className="smallRectangle">
        <div id="filtrer-par">Filtrer par</div>
      </div>
      <div id="rows">
        <div id="rectangleFilter">
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>TYPE DE CAS</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox onChange={onCheckboxChangeType} name="Libre" />
                    }
                    label="Libre d'accès"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox onChange={onCheckboxChangeType} name="Payant" />
                    }
                    label="Payant"
                  />
                </FormGroup>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>DISCIPLINE</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <FormGroup>
                  {Disciplines.map((discipline) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={onCheckboxChangeDiscipline}
                          name={discipline}
                        />
                      }
                      label={discipline}
                    />
                  ))}
                </FormGroup>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>SUJET</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {Subjects.map((subject) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={onCheckboxChangeSubject}
                        name={subject}
                      />
                    }
                    label={subject}
                  />
                ))}
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>DATE DE PARUTION</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {dates.map((date) => (
                  <FormControlLabel
                    control={
                      <Checkbox onChange={onCheckboxChangeDate} name={date} />
                    }
                    label={date}
                  />
                ))}
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>NOMBRE DE PAGES</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {numberPages.map((nbPage) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={onCheckboxChangeNumberPages}
                        name={nbPage}
                      />
                    }
                    label={nbPage}
                  />
                ))}
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>AUTEUR</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {caseStudyAuthors.map((author) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={onCheckboxChangeAuthorName}
                        name={author}
                      />
                    }
                    label={author}
                  />
                ))}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
        <Articles
          ref={articlesRef}
          typeFilters={typeFilters}
          disciplineFilters={disciplineFilters}
          subjectFilters={subjectFilters}
          dateFilters={dateFilters}
          numberPagesFilters={numberPagesFilters}
          authorsFilters={authorsFilters}
        />
      </div>
    </div>
  );
}
