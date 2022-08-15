import { useParams } from "react-router-dom";
import React from "react";
import axios from "axios";
import { UserPasswordReset } from "../../model/User";
import { Button, TextField } from "@mui/material";

export default function ResetPassword() {
  const { resetToken } = useParams();

  const initialStateErrors = {
    password: "",
    confirmPassword: "",
  };

  const [error, setError] = React.useState(initialStateErrors);

  const handleSubmitNewPassword = (e: any) => {
    e.preventDefault();
    console.log(e.target.elements);
    const newPassword: UserPasswordReset = {
      reset_token: resetToken!,
      password: e.target.password.value,
    };
    sendNewPasswordForm(newPassword);
  };

  const sendNewPasswordForm = (user: UserPasswordReset) => {
    axios
      .post(`http://localhost:3001/api/auth/reset-password/`, user, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div>Choissisez un nouveau mot de passe</div>
      <form onSubmit={handleSubmitNewPassword}>
        <div>
          <TextField
            required
            autoFocus
            margin="dense"
            label="Mot de passe"
            type="password"
            variant="outlined"
            name="password"
          />
        </div>
        <div>
          <TextField
            required
            autoFocus
            margin="dense"
            label="Confirmer le mot de passe"
            type="password"
            variant="outlined"
            name="passwordConfirm"
          />
        </div>
        <Button type="submit" variant="contained">
          Valider
        </Button>
      </form>
    </div>
  );
}
