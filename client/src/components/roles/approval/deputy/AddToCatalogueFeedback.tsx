import React from "react";
import { SingleCaseProp } from "../../../../model/CaseStudy";
import {
  Button,
  Card,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Feedback.scss";
import axios from "axios";
import { navToCorrectTab } from "../../../../utils/NavigationUtils";

export default function AddToCatalogueFeedback(caseData: SingleCaseProp) {
  const newCase = caseData.caseData;
  const navigate = useNavigate();

  const [urlValue, setURLValue] = React.useState("");

  const sendCaseStudyResponse = () => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_API_URL}/api/caseStudies/approvalResult`,
        {
          case: newCase.id_,
          approved: true,
          url: urlValue,
        },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        navToCorrectTab("/approval", navigate, newCase);
      });
  };

  return (
    <div>
      <Typography variant="h4">Ajouter au catalogue</Typography>
      <Card id="addtocatalogue-card">
        <br />
        <Typography>
          À noter que cette étape est <b>irréversible</b> ; l'étude de cas sera
          disponible dans le catalogue après avoir été confirmé. <br /> <br />
        </Typography>
        {newCase.isPaidCase && (
          <FormControl>
            <FormLabel>
              Comme l'étude de cas est payante, veuillez entrer l'URL de la page
              PIP correspondante :
            </FormLabel>
            <TextField
              margin="dense"
              label="URL"
              name="url"
              type="text"
              value={urlValue}
              onChange={(e) => setURLValue(e.target.value)}
            />
            <br />
          </FormControl>
        )}
        <div />
        <Button
          disabled={urlValue.trim() === "" && newCase.isPaidCase}
          variant="contained"
          onClick={() => sendCaseStudyResponse()}
        >
          Confirmer
        </Button>
      </Card>
    </div>
  );
}
