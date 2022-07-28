import React from "react";
import '../../styles/LightCatalogue.scss';
import '../img/normal_search.svg';
import SearchIcon from "../common/SearchIcon";
import Results from "./Results";
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, Chip, FormControlLabel, FormGroup, InputAdornment, TextField, Typography } from "@mui/material";
import axios from "axios";
import { CaseStudy } from "../../model/CaseStudy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Catalogue() {

    const disciplines = ["aérospatiale", "biomédical", "chimique", "civil", "électrique", "géologique", "industriel", "mécanique", "des mines"];
    const subjects = ["Automatisation", "Chaîne logistique", "Économie appliqué", "Enteprenariat", "Ergonomie du travail", "Gestion de projet", "Gestion de la qualité", "Gestion du changement", "Recherche opérationnelle"]
    const dates = ["0-3 mois", "4-8 mois", "9-12 mois", "1-2 ans", "2-3 ans", "3-6 ans", "5-6 ans", "7+ ans"];
    const numberPages = ["1 à 4 pages", "5 à 10 pages", "11+ pages"];

    const [filters, setFilters] = React.useState<string[]>([]);

    const [caseStudies, setCaseStudies] = React.useState<CaseStudy[]>([]);

    const [showCaseStudies, setShowCaseStudies] = React.useState<CaseStudy[]>([]);


    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value;
 
        if (search.length > 0) {
            const filteredCaseStudies = caseStudies.filter(caseStudy => {
                return onFilter(caseStudy, search);
            }).slice(0, 10);
            setShowCaseStudies(filteredCaseStudies);  
        } else {
            setShowCaseStudies(caseStudies);
        }
    }

    const onFilter = (caseStudy: CaseStudy, searchFilter: string) => {
        for (const property in caseStudy) {
            if (caseStudy.hasOwnProperty(property)) {
                if (caseStudy[property as keyof typeof caseStudy].toString().toLowerCase().includes(searchFilter.toLowerCase())) {
                    return true;
                }
            }
        }
    }

    const onCheckboxChangeDiscipline = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        const value = e.target.labels![0].innerText;
        const newFilters = [...filters];
        
        if (checked) {
            newFilters.push(value);
            setFilters(newFilters);
        } else {
            newFilters.splice(newFilters.indexOf(value), 1);
            setFilters(newFilters);
        }
    }

    const getCaseStudies = async () => { 
        axios.get("http://localhost:3001/api/casestudies/").then((res) => {
          setShowCaseStudies(res.data);
          setCaseStudies(res.data);
        });
    };

    React.useEffect(() => {
        getCaseStudies();
    }, []);

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
          <div className="smallRectangle">
            <div id="type-de-contenu">Type de contenu :</div>
            {filters.map((filter) => (
                <Chip label={filter} variant="outlined" onDelete={() => {}} />
            ))}
            <div id="effacer-tous-les-fil">Effacer tous les filtres</div>
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
                            <Checkbox onChange={onCheckboxChangeDiscipline} />
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
                        control={<Checkbox />}
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
                      <FormControlLabel control={<Checkbox />} label={date} />
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
                      <FormControlLabel control={<Checkbox />} label={nbPage} />
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
