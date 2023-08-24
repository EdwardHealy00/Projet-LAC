import React from "react";
import { SingleCaseProp } from "../../../../model/CaseStudy";
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, FormControl, FormLabel, TextField, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
            url: urlValue
          },
          {
            withCredentials: true,
          }
        )
        .then(() => {
          navigate("/approval");
        });
    };

    return (
        <Card className="director-comments">
            <Typography variant="h5">Ajouter au catalogue</Typography>
            <br />
            <Typography>
              <div>
                <b>
                  À noter que cette étape est irréversible; l'étude de cas sera disponible dans le catalogue
                  après avoir confirmé. <br /> <br />
                </b>
              </div>
              {(newCase.isPaidCase &&
              <FormControl>
                <FormLabel>Comme l'étude de cas est payante, veuillez entrer l'URL de la page PIP correspondante :</FormLabel>
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
              <Button disabled={urlValue.trim() === "" && newCase.isPaidCase} variant="contained" onClick={() => sendCaseStudyResponse()}>
                Confirmer
              </Button>
            </Typography>
        </Card>
    );
}