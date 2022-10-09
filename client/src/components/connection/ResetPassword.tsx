import { useParams } from "react-router-dom";
import React from "react";
import axios from "axios";
import { UserPasswordReset } from "../../model/User";
import {
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";

export default function ResetPassword() {
  const { resetToken } = useParams();

  const [passwordError, setPasswordError] = React.useState({
      isError: false,
      message: "",
  });

  const [showPassword, setShowPassword] = React.useState(false);

  const validatePassword = (password: string) => {
    const passwordError = {
      isError: false,
      message: "",
    };
    if (password.length < 8 || password.length > 32) {
      passwordError.isError = true;
      passwordError.message = "Le mot de passe doit contenir entre 8 et 32 caractères";
    }
    setPasswordError(passwordError);
    return passwordError.isError;
  };

  const handleSubmitNewPassword = (e: any) => {
    e.preventDefault();
    const password = e.target.password.value.trim();
    if (validatePassword(password)) return;
    const newPassword: UserPasswordReset = {
      reset_token: resetToken!,
      password: e.target.password.value,
    };
    sendNewPasswordForm(newPassword);
  };

  const sendNewPasswordForm = (user: UserPasswordReset) => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_API_URL}/api/auth/reset-password/`,
        user,
        {
          withCredentials: true,
        }
      )
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
        <FormControl variant="standard">
          <InputLabel htmlFor="standard-adornment-password">
            Nouveau mot de passe
          </InputLabel>
          <Input
            error={passwordError.isError}
            name="password"
            id="standard-adornment-password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        {passwordError.isError && (
          <div style={{ color: "red" }}>{passwordError.message}</div>
        )}
        <Button type="submit" variant="contained">
          Valider
        </Button>
      </form>
    </div>
  );
}
