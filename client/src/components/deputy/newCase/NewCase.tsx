import {
  Typography,
  Card,
  styled,
  useTheme,
  Button,
} from "@mui/material";
import React from "react";
import "./NewCase.scss";
import { Case } from "../../../model/CaseStudy";
import { useLocation } from "react-router-dom";
import NewCaseTable from "./NewCaseTable";
import axios from "axios";
import { CaseStep } from "../../../model/enum/CaseStatus";
import PreApproveFeedback from "../../roles/approval/deputy/PreApproveFeedback";
import ComityFeedback from "../../roles/approval/comity/Feedback";
import AddToCatalogueFeedback from "../../roles/approval/deputy/AddToCatalogueFeedback";
import { createCaseFromData } from "../../../utils/ConvertUtils";
import { Role } from "../../../model/enum/Role";
import ComityDirectorFeedback from "../../roles/approval/comityDirector/Feedback";
import { UnlockAccess } from "../../connection/UnlockAccess";

function NewCase() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  let [caseStudy, SetCaseStudy] = React.useState<Case>();

  React.useEffect(() => {
    getCaseStudy(id);
  }, [id]);

  const getCaseStudy = (id: string | null) => {
    if (!id) return;
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/` + id, {
        withCredentials: true,
      })
      .then((res) => {
        caseStudy = createCaseFromData(
          res.data._id,
          res.data.title,
          res.data.desc,
          res.data.authors,
          res.data.submitter,
          res.data.date,
          res.data.page,
          res.data.status,
          res.data.isPaidCase,
          res.data.classId,
          res.data.discipline,
          res.data.subjects,
          res.data.files,
          res.data.reviewGroups,
          res.data.version,
          res.data.approvalDecision,
          res.data.comments,
          res.data.ratings,
          res.data.votes
        );

        SetCaseStudy({ ...caseStudy });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const theme = useTheme();
  const ColoredTypography = styled(Typography)({
    color: theme.palette.primary.main, // Apply your custom styles here
  });

  return (
    <div>
      <UnlockAccess
        role={[Role.Deputy, Role.ComityDirector]}
        children={
          <Button href="/approval">
            &gt; Retour au tableau de cas
          </Button>
        }></UnlockAccess>
      {caseStudy && (
        <div id="newCase">
          <Typography variant="h4">Informations sur le cas</Typography>
          <Card id="generalCaseInfo">
            <div>
                  <Typography>
                    {caseStudy.date.substring(0, 10)}
                  </Typography>
                    <ColoredTypography variant="h3">
                      {caseStudy.title}
                    </ColoredTypography>
                  <Typography variant="h5">Par {caseStudy.authors}</Typography>
              </div>
              <div>
                <Typography variant="body1">
                  {" "}
                  <b>Description : </b> {caseStudy.desc}
                </Typography>
                <Typography variant="body1">
                  {" "}
                  <b>Discipline : </b>
                  {caseStudy.discipline}
                </Typography>
                <Typography variant="body1">
                  {" "}
                  <b>Cours : </b>
                  {caseStudy.classId}
                </Typography>
                <Typography variant="body1">
                  {" "}
                  <b>Sujet(s) : </b>
                  {caseStudy.subjects.join(", ")}
                </Typography>
                <Typography variant="body1">
                  {" "}
                  <b>Nombre de pages : </b>
                  {caseStudy.page}
                </Typography>
              </div>
          </Card>

          <div id="documents">
            <Typography variant="h4">Documents soumis par l'auteur</Typography>
            <NewCaseTable documents={caseStudy.files} />
          </div>

          <div id="feedback">
          {/* PREAPPROVAL */}
          <UnlockAccess
            role={[Role.Deputy]}
            children={
              (caseStudy as Case).status == CaseStep.WaitingPreApproval && (
                <PreApproveFeedback caseData={caseStudy as Case}></PreApproveFeedback>
              )
            }
          ></UnlockAccess>

          {/* COMITY APPROVAL */}
          <UnlockAccess
            role={[Role.Comity]}
            children={
              (caseStudy as Case).status == CaseStep.WaitingComity && (
                <ComityFeedback caseData={caseStudy as Case}></ComityFeedback>
              )
            }
          ></UnlockAccess>

          {/* COMITY DIRECTOR APPROVAL */}
          <UnlockAccess
            role={[Role.ComityDirector]}
            children={
              (caseStudy as Case).status == CaseStep.WaitingComity && (
                <ComityDirectorFeedback
                  caseData={caseStudy as Case}
                ></ComityDirectorFeedback>
              )
            }
          ></UnlockAccess>

          {/* CATALOGUE ADD SECTION*/}
          <UnlockAccess
            role={[Role.Deputy]}
            children={
              (caseStudy as Case).status == CaseStep.WaitingCatalogue && (
                <AddToCatalogueFeedback caseData={caseStudy as Case}></AddToCatalogueFeedback>
              )
            }
          ></UnlockAccess>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewCase;
