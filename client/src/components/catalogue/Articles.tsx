import React, { forwardRef, useImperativeHandle, useState } from "react";
import Results from "./Results";
import { Case } from "../../model/CaseStudy";
import axios from "axios";
import { Typography } from "@mui/material";
import "./Articles.scss";

interface ArticlesProps {
  typeFilters: string[];
  disciplineFilters: string[];
  subjectFilters: string[];
  dateFilters: string[];
  numberPagesFilters: string[];
  authorsFilters: string[];
}

export interface ArticlesRef {
  onSearch(e: React.ChangeEvent<HTMLInputElement>): void;
}

const PAID_STR: string = "Payant";
const FREE_STR: string = "Libre d'accès";

const Articles = forwardRef<ArticlesRef, ArticlesProps>((props, ref) => {
  useImperativeHandle(ref, () => ({
    onSearch(e: React.ChangeEvent<HTMLInputElement>) {
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
    },
  }));

  const [showCaseStudies, setShowCaseStudies] = React.useState<Case[]>([]);
  const [caseStudies, setCaseStudies] = React.useState<Case[]>([]);

  const onFilter = (caseStudy: Case, searchFilter: string) => {
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

  const onFilterChange = () => {
    let caseStudiesToFilter = [...caseStudies];

    if (props.typeFilters.length > 0) {
      caseStudiesToFilter = caseStudiesToFilter.filter((caseStudy) => {
        return (
          (props.typeFilters.includes(FREE_STR) &&
            !(caseStudy as Case).isPaidCase) ||
          (props.typeFilters.includes(PAID_STR) &&
            (caseStudy as Case).isPaidCase)
        );
      });
    }

    if (props.disciplineFilters.length > 0) {
      caseStudiesToFilter = caseStudiesToFilter.filter((caseStudy) => {
        if (!(caseStudy as Case).discipline) {
          return false;
        }
        return props.disciplineFilters.includes(
          (caseStudy as Case).discipline
        );
      });
    }

    if (props.subjectFilters.length > 0) {
      caseStudiesToFilter = caseStudiesToFilter.filter((caseStudy) => {
        return props.subjectFilters.some((subject) => {
          if (!(caseStudy as Case).subjects) {
            return false;
          }
          return (
            (caseStudy as Case).subjects.find(
              (tag) => tag.toLowerCase() === subject.toLowerCase()
            ) !== undefined
          );
        });
      });
    }

    if (props.dateFilters.length > 0) {
      caseStudiesToFilter = caseStudiesToFilter.filter((caseStudy) => {
        if (!(caseStudy as Case).date) {
          return false;
        }
        return verifyDates((caseStudy as Case).date, props.dateFilters);
      });
    }

    if (props.numberPagesFilters.length > 0) {
      caseStudiesToFilter = caseStudiesToFilter.filter((caseStudy) => {
        if (!(caseStudy as Case).page) {
          return false;
        }
        return verifyPages((caseStudy as Case).page, props.numberPagesFilters);
      });
    }

    if (props.authorsFilters.length > 0) {
      caseStudiesToFilter = caseStudiesToFilter.filter((caseStudy) => {
        if (!(caseStudy as Case).authors) {
          return false;
        }
        return verifyAuthors((caseStudy as Case).authors, props.authorsFilters);
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

  const verifyAuthors = (author: string, authorsFilters: string[]) => {
    for (const selectedAuthor of authorsFilters) {
      if (selectedAuthor.toLowerCase() === author.toLowerCase()) {
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
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/api/casestudies/all-catalog`)
      .then((res) => {
        setShowCaseStudies(res.data);
        setCaseStudies(res.data);
      });
  };

  React.useEffect(() => {
    getCaseStudies();
  }, []);

  React.useEffect(() => {
    onFilterChange();
  }, [
    props.typeFilters,
    props.disciplineFilters,
    props.subjectFilters,
    props.dateFilters,
    props.numberPagesFilters,
    props.authorsFilters,
  ]);

  return (
    <div id="articles">
      <Typography id="results-text"> {showCaseStudies.length} résultats</Typography>
      <div id="articles-results">
        {showCaseStudies.map((caseStudy, index) => (
          <Results key={index} caseData={caseStudy} />
        ))}
      </div>
    </div>
  );
});

export default Articles;
