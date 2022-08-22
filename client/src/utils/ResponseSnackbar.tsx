import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Alert } from "@mui/material";

export interface SnackbarObject {
  handleClick: (isError: boolean, message: string) => void;
}

export const ResponseSnackbar = React.forwardRef(
  (props, ref: React.Ref<SnackbarObject>) => {
    // The component instance will be extended
    // with whatever you return from the callback passed
    // as the second argument
    React.useImperativeHandle(ref, () => ({
      handleClick(isError: boolean, message: string) {
        setError(isError);
        setMessage(message);
        setOpen(true);
      },
    }));
    const [open, setOpen] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [message, setMessage] = React.useState("");

    const handleClose = (
      event: React.SyntheticEvent | Event,
      reason?: string
    ) => {
      if (reason === "clickaway") {
        return;
      }

      setOpen(false);
    };

    const action = (
      <React.Fragment>
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </React.Fragment>
    );

    return (
      <div>
        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={handleClose}
          action={action}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleClose}
            severity={error ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      </div>
    );
  }
);

//export default ResponseSnackbar;
