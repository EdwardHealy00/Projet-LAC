import React from "react";
import "./Results.scss";
import { AttachMoney, Download, ZoomIn, Launch } from "@mui/icons-material";
import {
  Button,
  ButtonBase,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  Rating,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { handleFileDownload } from "../../utils/FileDownloadUtil";

interface Props {
  caseData: any;
}

const Results: React.FC<Props> = ({ caseData }) => {
  const navigate = useNavigate();

  const [infoDialogOpen, setOpenInfoDialog] = React.useState(false);
  const openInfoDialog = () => {
    setOpenInfoDialog(true);
  };
  const handleInfoDialogClose = () => {
    setOpenInfoDialog(false);
  };

  const [downloadDialogOpen, setOpenDownloadDialog] = React.useState(false);
  const openDownloadDialog = () => {
    setOpenDownloadDialog(true);
  };
  const handleDownloadDialogClose = () => {
    setOpenDownloadDialog(false);
  };

  const onCaseClick = () => {
    if (caseData.isPaidCase) {
      window.open(caseData.url as string, "_blank");
    } else {
      openInfoDialog();
    }
  };

  const onActionClick = (event: any) => {
    event.stopPropagation();
    if (caseData.isPaidCase) {
      window.open(caseData.url as string, "_blank");
    } else {
      openDownloadDialog();
    }
  };

  const theme = useTheme();
  const ColoredTypography = styled(Typography)({
    color: theme.palette.primary.main, // Apply your custom styles here
  });

  return (
    <Card className="catalogue-article">
      <ButtonBase className="clickable-card" onClick={openInfoDialog}>
        <CardContent className="article-content">
          <div className="top-info">
            <div className="leftside-info">
              <Typography variant="caption">
                {caseData.date.substring(0, 10)}
              </Typography>
              <div className="title-and-icon">
                <ColoredTypography variant="h4" className="field">
                  {caseData.title}
                </ColoredTypography>
                {caseData.isPaidCase && <AttachMoney className="dollar-icon" />}
              </div>
              <Typography variant="h5">Par {caseData.authors}</Typography>
            </div>
            <div className="rightside-info">
              <Rating value={caseData.ratings} readOnly size="small"></Rating>
              <Typography variant="caption">
                ({caseData.votes} votes)
              </Typography>
            </div>
          </div>
          <div className="secondary-info">
            <Typography variant="body2" className="description-text">
              {" "}
              <b>Description : </b> {caseData.desc}
            </Typography>
            <div className="info-actions-flex">
              <div>
                <Typography variant="body2" className="info-text field">
                  {" "}
                  <b>Discipline : </b>
                  {caseData.discipline}
                </Typography>
                <Typography variant="body2" className="info-text field">
                  {" "}
                  <b>Cours : </b>
                  {caseData.classId}
                </Typography>
                <Typography variant="body2" className="info-text field">
                  {" "}
                  <b>Sujet(s) : </b>
                  {caseData.subjects.join(", ")}
                </Typography>
                <Typography variant="body2" className="info-text field">
                  {" "}
                  <b>Nombre de pages : </b>
                  {caseData.page}
                </Typography>
              </div>
              <div className="actions">
                <Button onClick={openInfoDialog}>
                  <ZoomIn></ZoomIn>
                </Button>
                <Button onClick={onActionClick}>
                  {caseData.isPaidCase && <Launch></Launch>}
                  {!caseData.isPaidCase && <Download></Download>}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </ButtonBase>

      <Dialog
        open={downloadDialogOpen}
        onClose={handleDownloadDialogClose}
        fullWidth={true}
      >
        <DialogTitle>Consulter les fichiers</DialogTitle>

        <DialogContent>
          {caseData.files.map((file: { originalname: string }, index: number) => (
            <div key={index} className="file-row">
              <div>{file.originalname}</div>
              <Button onClick={() => handleFileDownload(file)}>
                <Download />
                Télécharger
              </Button>
            </div>
          ))}
        </DialogContent>

        <DialogActions>
          <Button variant="contained" onClick={handleDownloadDialogClose}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={infoDialogOpen}
        onClose={handleInfoDialogClose}
        fullWidth={true}
      >
        <DialogContent>
          <div className="article-content">
            <div className="top-info">
              <div className="leftside-info">
                <Typography variant="caption">
                  {caseData.date.substring(0, 10)}
                </Typography>
                <div className="title-and-icon">
                  <ColoredTypography variant="h3">
                    {caseData.title}{caseData.isPaidCase && <AttachMoney className="dollar-icon inline" />}
                  </ColoredTypography>
                </div>
                <Typography variant="h5">Par {caseData.authors}</Typography>
              </div>
              <div className="rightside-info">
                <Rating value={caseData.ratings} readOnly></Rating>
                <Typography variant="caption">
                  ({caseData.votes} votes)
                </Typography>
              </div>
            </div>
            <div className="secondary-info">
              <Typography variant="body1" className="spaced">
                {" "}
                <b>Description : </b> {caseData.desc}
              </Typography>
              <Typography variant="body1" className="spaced">
                {" "}
                <b>Discipline : </b>
                {caseData.discipline}
              </Typography>
              <Typography variant="body1" className="spaced">
                {" "}
                <b>Cours : </b>
                {caseData.classId}
              </Typography>
              <Typography variant="body1" className="spaced">
                {" "}
                <b>Sujet(s) : </b>
                {caseData.subjects.join(", ")}
              </Typography>
              <Typography variant="body1" className="spaced">
                {" "}
                <b>Nombre de pages : </b>
                {caseData.page}
              </Typography>
            </div>
            <div>

              {!caseData.isPaidCase &&
                caseData.files.map((file: { originalname: string }, index: number) => (
                  <div key={index} className="file-row">
                    <div>{file.originalname}</div>
                    <Button onClick={() => handleFileDownload(file)}>
                      <Download />
                      Télécharger
                    </Button>
                  </div>
                ))}
              {}
            </div>
          </div>
        </DialogContent>

        <DialogActions className="dialog-actions">
        {caseData.isPaidCase && (
                <Button variant="contained" color="primary" onClick={onActionClick}>
                  <Launch></Launch>Accéder à l'étude de cas
                </Button>
              )}
          <Button variant="contained" color="error" onClick={handleInfoDialogClose}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default Results;
