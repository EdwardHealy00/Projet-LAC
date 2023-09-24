import React, { useState } from "react";
import { FormControlLabel, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import "./PaidSwitch.scss";


interface Prop {
    onChange: (checked: boolean) => void;
  }

  export default function PaidSwitch(prop: Prop) {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    prop.onChange(event.target.checked);
  };

  const paidLabel = isChecked
    ? "Étude de cas payante"
    : "Étude de cas gratuite";
  const infoText = isChecked
    ? "En choisissant la formule payante, votre étude de cas sera soumise à un processus de révision approfondi, impliquant un adjoint administratif, le comité scientifique  ainsi que les Presses Internationales de Polytechnique. À la suite de  son approbation, les informations relatives à cette étude de cas seront publiées sur cette plateforme  ; toutefois, l'utilisateur sera dirigé vers les Presses Internationales de Polytechnique pour conclure la transaction."
    : "En optant pour la formule gratuite, votre étude de cas bénéficiera d'une révision par un adjoint administratif et le comité scientifique. Une fois approuvée, celle-ci sera publiée et directement accessible sur cette plateforme.";

  const MaterialUISwitch = styled(Switch)(() => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 23 25"><path fill="${encodeURIComponent(
            "#fff"
          )}" d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>')`,
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: "#006400",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: "#228B22",
      width: 32,
      height: 32,
      "&:before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 25 25"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M12.5 6.9c1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-.53.12-1.03.3-1.48.54l1.47 1.47c.41-.17.91-.27 1.51-.27zM5.33 4.06L4.06 5.33 7.5 8.77c0 2.08 1.56 3.21 3.91 3.91l3.51 3.51c-.34.48-1.05.91-2.42.91-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c.96-.18 1.82-.55 2.45-1.12l2.22 2.22 1.27-1.27L5.33 4.06z"/></svg>')`,
      },
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: "#aab4be",
      borderRadius: 20 / 2,
    },
  }));

  return (
    <div className="paid-switch">
      <FormControlLabel
        control={
          <MaterialUISwitch
            checked={isChecked}
            onChange={handleSwitchChange}
            sx={{ m: 0.5 }}
          />
        }
        label={paidLabel}
      />
      <Typography variant="body2">{infoText}</Typography>
    </div>
  );
}
