import React, { FC, useEffect, useRef } from "react";
import "./Catalogue.scss";
import SearchBar from "./SearchBar";
import {
  Box,
  Button,
  Card,
  Chip,
  Collapse,
  FormControl,
  Icon,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
  alpha,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { Role } from "../../model/enum/Role";
import { UnlockAccess } from "../connection/UnlockAccess";
import { Download } from "@mui/icons-material";
import { Add } from "@mui/icons-material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { downloadCaseStudyTemplate } from "../../utils/FileDownloadUtil";
import Articles, { ArticlesRef } from "./Articles";
import AddCaseStudy, { AddCaseStudyDialogRef } from "./AddCaseStudy";
import ClearIcon from '@mui/icons-material/Clear';
import MenuIcon from '@mui/icons-material/Menu';

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
  "Génie informatique",
  "Génie logiciel",
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
  "Innovation",
];

export const Languages = [
  "Français",
  "Anglais"
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
  const [languageFilters, setLanguageFilters] = React.useState<string[]>([]);
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
  const addCaseStudyRef = useRef<AddCaseStudyDialogRef | null>(null);

  const openAddCaseStudyDialog = () => {
    if(addCaseStudyRef.current) {
      addCaseStudyRef.current.setDialogOpen();
    }
  }

  const OnChangeType = (event: SelectChangeEvent<any>) => {
    const { target: { value } } = event;
    setTypeFilters(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const OnChangeLanguage= (event: SelectChangeEvent<any>) => {
    const { target: { value } } = event;
    setLanguageFilters(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const OnChangeDiscipline = (event: SelectChangeEvent<any>) => {
    const { target: { value } } = event;
    setDisciplineFilters(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const OnChangeSubject= (event: SelectChangeEvent<any>) => {
    const { target: { value } } = event;
    setSubjectFilters(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const OnChangeDate = (event: SelectChangeEvent<any>) => {
    const { target: { value } } = event;
    setDateFilters(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const OnChangePages = (event: SelectChangeEvent<any>) => {
    const { target: { value } } = event;
    setNumberPagesFilters(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const OnChangeAuthor = (event: SelectChangeEvent<any>) => {
    const { target: { value } } = event;
    setAuthorsFilters(
      typeof value === "string" ? value.split(",") : value
    );
  };


  const onResetFilters = () => {
    for (const filter of filters) {
      filter.checkboxRef.click();
    }
    setFilters([]);
    setTypeFilters([]);
    setLanguageFilters([]);
    setDisciplineFilters([]);
    setSubjectFilters([]);
    setDateFilters([]);
    setNumberPagesFilters([]);
    setAuthorsFilters([]);
  };

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('lg'));
  const [isFilterMenuOpen, setIsFilterMenuOpen] = React.useState(false);

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  const WhiteTypography = styled(Typography)({
    color: theme.palette.primary.contrastText,
  });
  const WhiteButton = styled(Button)({
    color: theme.palette.primary.contrastText,

    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.15), // Change to the desired hover color
    },
  });

  const FilterMenuButton = styled(WhiteButton)(({ theme }) => ({
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
        backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
  }));

  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.up('md'));

  const FilterCard = () => (
    <Card id="filter-card">
          <div id="filter-header">
            <Typography variant="h5">Filtrer par:</Typography>
            <Button onClick={onResetFilters}>
              <u>Effacer tous les filtres</u>
            </Button>
          </div>
          <div className="filter-list">
            <div className="filter-form-container">
              <FormControl className="filter-form-control">
                <InputLabel id="type-select-label">Type de cas</InputLabel>
                <Select
                  labelId="type-select-label"
                  id="type-select"
                  multiple
                  value={typeFilters}
                  onChange={OnChangeType}
                  input={
                    <OutlinedInput
                      id="select-multiple-chip"
                      label="Type de cas"
                    />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value, index) => (
                        <Chip key={index} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem key={0} value={"Libre d'accès"}>
                    Libre d'accès
                  </MenuItem>
                  <MenuItem key={1} value={"Payant"}>
                    Payant
                  </MenuItem>
                </Select>
              </FormControl>
              <ClearButton filterArray={typeFilters} setFilterFunction={setTypeFilters} />
            </div>
            <div className="filter-form-container">
              <FormControl className="filter-form-control">
                <InputLabel id="type-select-label">Langue</InputLabel>
                <Select
                  labelId="type-select-label"
                  id="type-select"
                  multiple
                  value={languageFilters}
                  onChange={OnChangeLanguage}
                  input={
                    <OutlinedInput
                      id="select-multiple-chip"
                      label="Langue"
                    />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value, index) => (
                        <Chip key={index} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem key={0} value={"Français"}>
                    Français
                  </MenuItem>
                  <MenuItem key={1} value={"Anglais"}>
                    Anglais
                  </MenuItem>
                </Select>
              </FormControl>
              <ClearButton filterArray={languageFilters} setFilterFunction={setLanguageFilters  } />
            </div>
            <div className="filter-form-container">
              <FormControl className="filter-form-control">
                <InputLabel id="type-select-label">Discipline</InputLabel>
                <Select
                  labelId="type-select-label"
                  id="type-select"
                  multiple
                  value={disciplineFilters}
                  onChange={OnChangeDiscipline}
                  input={
                    <OutlinedInput id="select-multiple-chip" label="Discipline" />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value, index) => (
                        <Chip key={index} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {Disciplines.map((name, index) => (
                    <MenuItem key={index} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <ClearButton filterArray={disciplineFilters} setFilterFunction={setDisciplineFilters} />
            </div>
            <div className="filter-form-container">
              <FormControl className="filter-form-control">
                <InputLabel id="type-select-label">Sujet</InputLabel>
                <Select
                  labelId="type-select-label"
                  id="type-select"
                  multiple
                  value={subjectFilters}
                  onChange={OnChangeSubject}
                  input={
                    <OutlinedInput id="select-multiple-chip" label="Sujet" />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value, index) => (
                        <Chip key={index} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {Subjects.map((name, index) => (
                    <MenuItem key={index} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <ClearButton filterArray={subjectFilters} setFilterFunction={setSubjectFilters} />
            </div>
            <div className="filter-form-container">
              <FormControl className="filter-form-control">
                <InputLabel id="type-select-label">Date de parution</InputLabel>
                <Select
                  labelId="type-select-label"
                  id="type-select"
                  multiple
                  value={dateFilters}
                  onChange={OnChangeDate}
                  input={
                    <OutlinedInput
                      id="select-multiple-chip"
                      label="Date de parution"
                    />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value, index) => (
                        <Chip key={index} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {dates.map((name, index) => (
                    <MenuItem key={index} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <ClearButton filterArray={dateFilters} setFilterFunction={setDateFilters} />
            </div>
            <div className="filter-form-container">
              <FormControl className="filter-form-control">
                <InputLabel id="type-select-label">Nombre de pages</InputLabel>
                <Select
                  labelId="type-select-label"
                  id="type-select"
                  multiple
                  value={numberPagesFilters}
                  onChange={OnChangePages}
                  input={
                    <OutlinedInput
                      id="select-multiple-chip"
                      label="Nombre de pages"
                    />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value, index) => (
                        <Chip key={index} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {numberPages.map((name, index) => (
                    <MenuItem key={index} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <ClearButton filterArray={numberPagesFilters} setFilterFunction={setNumberPagesFilters} />
            </div>
            <div className="filter-form-container">
              <FormControl className="filter-form-control">
                <InputLabel id="type-select-label">Auteur</InputLabel>
                <Select
                  labelId="type-select-label"
                  id="type-select"
                  multiple
                  value={authorsFilters}
                  onChange={OnChangeAuthor}
                  input={
                    <OutlinedInput id="select-multiple-chip" label="Auteur" />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value, index) => (
                        <Chip key={index} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {caseStudyAuthors.map((name, index) => (
                    <MenuItem key={index} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <ClearButton filterArray={authorsFilters} setFilterFunction={setAuthorsFilters} />
            </div>
          </div>

    </Card>
  );

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

  window.addEventListener('resize', function () {
    arrangeNavBars();
  });

  useEffect(() => {
    arrangeNavBars();
  }, []);

  const arrangeNavBars = () => {
    const mainNavBar = document.querySelector('#nav-bar') as HTMLElement;
    const catalogueNavBar = document.querySelector('#rectangle') as HTMLElement;
    const mainContent = document.querySelector('#rows') as HTMLElement;

    if (mainNavBar && catalogueNavBar && mainContent) {
        const navbar1Height = mainNavBar.clientHeight;
        const navbar2Height = catalogueNavBar.clientHeight;

        catalogueNavBar.style.top = `${navbar1Height - 2}px`;
        mainContent.style.paddingTop = `${navbar2Height}px`;
    }
  }

  interface ClearButtonProps {
    filterArray: string[];
    setFilterFunction: React.Dispatch<React.SetStateAction<string[]>>;
  }
  
  const ClearButton: FC<ClearButtonProps> = ({ filterArray, setFilterFunction }) => (
    <Button
      style={{ visibility: filterArray.length !== 0 ? 'visible' : 'hidden' }}
      disabled={filterArray.length === 0}
      onClick={() => setFilterFunction([])}
    >
      <ClearIcon />
    </Button>
  );

  return (
    <div>
      <div
        id="rectangle"
        style={{ backgroundColor: theme.palette.primary.light }}
      >
        <div id="label-title">
          <WhiteButton variant="text">
            <MenuIcon/>
          </WhiteButton>
          <WhiteTypography variant="h2" id="catalogue-title">
            Catalogue d'études de cas
          </WhiteTypography>
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
                {isLargeScreen && 'Télécharger les gabarits'}
              </WhiteButton>
              <WhiteButton variant="contained" onClick={openAddCaseStudyDialog}>
                <Add></Add>
                {isLargeScreen && 'Ajouter une étude de cas'}
              </WhiteButton>
            </div>
          }
        ></UnlockAccess>
          <div id="search-bar">
          <FilterMenuButton
          variant="outlined"
          onClick={toggleFilterMenu}
        >
          {isFilterMenuOpen ? <FilterAltOffIcon/> : <FilterAltIcon/>}
          
        </FilterMenuButton>
          <SearchBar onFilter={onSearch}></SearchBar>
        </div>
      </div>
      <div id="rows">
        {
        matches ? (
          <Collapse in={isFilterMenuOpen}>
            <FilterCard />
          </Collapse>
        ) : (
          <FilterCard />
        )
        }
        <Articles
          ref={articlesRef}
          typeFilters={typeFilters}
          languageFilters={languageFilters}
          disciplineFilters={disciplineFilters}
          subjectFilters={subjectFilters}
          dateFilters={dateFilters}
          numberPagesFilters={numberPagesFilters}
          authorsFilters={authorsFilters}
        />
      </div>
      <AddCaseStudy ref={addCaseStudyRef}/>
    </div>
  );
}
