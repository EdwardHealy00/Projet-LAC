import React from "react";
import '../../styles/LightCatalogue.scss';
import '../img/normal_search.svg';
import SearchIcon from "../common/SearchIcon";
import Results from "./Results";
import { Accordion, AccordionDetails, AccordionSummary, InputAdornment, TextField, Typography } from "@mui/material";
import axios from "axios";
import { CaseStudy } from "../../model/CaseStudy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Catalogue() {

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
            {/* TODO: insert div for tags here */}
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
                  </Typography>
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
