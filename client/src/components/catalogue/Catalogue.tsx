import React from "react";
import "./Catalogue.scss";
import SearchIcon from "@mui/icons-material/Search";
import Results from "./Results";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { CaseStudy } from "../../model/CaseStudy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddPaidCaseStudy from "./AddPaidCaseStudy";
import AddFreeCaseStudy from "./AddFreeCaseStudy";
import { Role } from "../../model/enum/Role";
import { UnlockAccess } from "../connection/UnlockAcess";

interface Filter {
  name: string;
  checkboxRef: EventTarget & HTMLInputElement;
}

export default function Catalogue() {
  const disciplines = [
    "aérospatiale",
    "biomédical",
    "chimique",
    "civil",
    "électrique",
    "géologique",
    "industriel",
    "mécanique",
    "des mines",
  ];
  const subjects = [
    "Automatisation",
    "Chaîne logistique",
    "Économie appliqué",
    "Entreprenariat",
    "Ergonomie du travail",
    "Gestion de projet",
    "Gestion de la qualité",
    "Gestion du changement",
    "Recherche opérationnelle",
  ];
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
  const [disciplineFilters, setDisciplineFilters] = React.useState<string[]>(
    []
  );
  const [subjectFilters, setSubjectFilters] = React.useState<string[]>([]);
  const [dateFilters, setDateFilters] = React.useState<string[]>([]);
  const [numberPagesFilters, setNumberPagesFilters] = React.useState<string[]>(
    []
  );

  const [caseStudies, setCaseStudies] = React.useState<CaseStudy[]>([]);

  const [showCaseStudies, setShowCaseStudies] = React.useState<CaseStudy[]>([]);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;

    if (search.length > 0) {
      const filteredCaseStudies = caseStudies
        .filter((caseStudy) => {
          return onFilter(caseStudy, search);
        })
        .slice(0, 10);
      setShowCaseStudies(filteredCaseStudies);
    } else {
      setShowCaseStudies(caseStudies);
    }
  };

  const onFilter = (caseStudy: CaseStudy, searchFilter: string) => {
    for (const property in caseStudy) {
      if (caseStudy.hasOwnProperty(property)) {
        if (
          caseStudy[property as keyof typeof caseStudy]
            .toString()
            .toLowerCase()
            .includes(searchFilter.toLowerCase())
        ) {
          return true;
        }
      }
    }
  };

  const onResetFilters = () => {
    for (const filter of filters) {
      filter.checkboxRef.click();
    }
    setFilters([]);
    setDisciplineFilters([]);
    setSubjectFilters([]);
    setDateFilters([]);
    setNumberPagesFilters([]);
    setShowCaseStudies(caseStudies);
  };

  const onCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    filtersType: string[]
  ) => {
    const checked = e.target.checked;
    const value = e.target.labels![0].innerText;
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

  React.useEffect(() => {
    onFilterChange();
  }, [disciplineFilters, subjectFilters, dateFilters, numberPagesFilters]);

  const onFilterChange = () => {
    let caseStudiesToFilter = [...caseStudies];

    if (disciplineFilters.length > 0) {
      caseStudiesToFilter = caseStudiesToFilter.filter((caseStudy) => {
        return disciplineFilters.includes(caseStudy.discipline.toLowerCase());
      });
    }

    if (subjectFilters.length > 0) {
      caseStudiesToFilter = caseStudiesToFilter.filter((caseStudy) => {
        return subjectFilters.some((subject) => {
          console.log(caseStudy.tags, subject);
          return (
            caseStudy.tags.find(
              (tag) => tag.toLowerCase() === subject.toLowerCase()
            ) !== undefined
          );
        });
      });
    }

    if (dateFilters.length > 0) {
      caseStudiesToFilter = caseStudiesToFilter.filter((caseStudy) => {
        return verifyDates(caseStudy.date, dateFilters);
      });
    }

    if (numberPagesFilters.length > 0) {
      caseStudiesToFilter = caseStudiesToFilter.filter((caseStudy) => {
        return verifyPages(caseStudy.page, numberPagesFilters);
      });
    }

    setShowCaseStudies(caseStudiesToFilter);
  };

  const verifyPages = (page: number, pageFilters: string[]) => {
    //TODO: check if there is a better way to do it
    for (const numberPage of pageFilters) {
      if (numberPage.includes("4") && page >= 1 && page <= 4) {
        return true;
      } else if (numberPage.includes("10") && page >= 5 && page <= 10) {
        return true;
      } else if (numberPage.includes("11") && page >= 11) {
        return true;
      }
    }
    return false;
  };

  const verifyDates = (date: string, dateFilters: string[]) => {
    //TODO: check if there is a better way to do it
    for (const filter of dateFilters) {
      const dateToCompare = new Date(date);
      const today = new Date();
      const fourMonthsAgo = new Date(
        today.getFullYear(),
        today.getMonth() - 4,
        today.getDate()
      );
      const nineMonthsAgo = new Date(
        today.getFullYear(),
        today.getMonth() - 9,
        today.getDate()
      );
      const oneYearAgo = new Date(
        today.getFullYear() - 1,
        today.getMonth(),
        today.getDate()
      );
      const threeYearsAgo = new Date(
        today.getFullYear() - 3,
        today.getMonth(),
        today.getDate()
      );
      const sevenYearsAgo = new Date(
        today.getFullYear() - 7,
        today.getMonth(),
        today.getDate()
      );

      if (filter.includes("0-3") && +dateToCompare >= +fourMonthsAgo) {
        return true;
      } else if (
        filter.includes("4-8") &&
        +dateToCompare < +fourMonthsAgo &&
        +dateToCompare >= +nineMonthsAgo
      ) {
        return true;
      } else if (
        filter.includes("9-12") &&
        +dateToCompare < +nineMonthsAgo &&
        +dateToCompare >= +oneYearAgo
      ) {
        return true;
      } else if (
        filter.includes("1-2") &&
        +dateToCompare < +oneYearAgo &&
        +dateToCompare >= +threeYearsAgo
      ) {
        return true;
      } else if (
        filter.includes("3-6") &&
        +dateToCompare < +threeYearsAgo &&
        +dateToCompare >= +sevenYearsAgo
      ) {
        return true;
      } else if (filter.includes("7") && +dateToCompare < +sevenYearsAgo) {
        return true;
      }
    }
    return false;
  };

  const getCaseStudies = async () => {
    axios.get("http://localhost:3001/api/casestudies/").then((res) => {
      setShowCaseStudies(res.data);
      setCaseStudies(res.data);
    });
  };

  React.useEffect(() => {
    getCaseStudies();
  }, []);

  const onDeleteChip = (filter: Filter) => {
    const newFilters = [...filters];
    filter.checkboxRef.click();
    newFilters.splice(filters.indexOf(filter), 1);
    setFilters(newFilters);
  };

  return (
    <div>
      <div id="content">
        <div id="rectangle">
          <div id="catalogue-des-cas">Catalogue des cas</div>
          <div id="searchField">
            <TextField
              onChange={onSearch}
              label="Rechercher dans le catalogue"
              id="searchBar"
              variant="filled"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>
        <UnlockAccess
          role={[Role.Admin, Role.Professor]}
          children={
            <div id="addCaseRectangle">
              <AddPaidCaseStudy />
              <AddFreeCaseStudy />
            </div>
          }
        ></UnlockAccess>

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
          <div id="results"> {showCaseStudies.length} résultats</div>
        </div>
        <div id="rows">
          <div id="rectangleFilter">
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
                    {disciplines.map((discipline) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={onCheckboxChangeDiscipline}
                            key={discipline}
                          />
                        }
                        label={"Génie " + discipline}
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
                  {subjects.map((subject) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={onCheckboxChangeSubject}
                          key={subject}
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
                        <Checkbox onChange={onCheckboxChangeDate} key={date} />
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
                          key={nbPage}
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
                <Typography>TODO</Typography>
              </AccordionDetails>
            </Accordion>
          </div>
          <div id="articles">
            {showCaseStudies.map((caseStudy) => (
              <Results
                title={caseStudy.title}
                auteurs={caseStudy.authors}
                content={caseStudy.content}
                date={caseStudy.date}
                page={caseStudy.page}
                discipline={caseStudy.discipline}
                tags={caseStudy.tags}
                classNumber={caseStudy.classIds}
                className={caseStudy.classNames}
                rating={caseStudy.ratings}
                vote={caseStudy.votes}
              ></Results>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
