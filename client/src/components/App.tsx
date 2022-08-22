import React, { useRef } from "react";
import Catalogue from "./catalogue/Catalogue";
import { Routes, Route } from "react-router-dom";
import CaseStudyWconnection from "./caseStudy/CaseStudyWconnection";
import NavBar from "./common/NavBar";
import CollaborativeSpace from "./collaborativeSpace/collaborativeSpace";
import DashboardPaidCase from "./deputy/dashboard/DashboardPaidCase";
import Approval from "./roles/approval/Approval";
import Home from "./home/Home";
import * as env from "dotenv";
import NewCase from "./deputy/newCase/newCase";
import Summary from "./about/Summary";
import Mission from "./about/Mission";
import Team from "./about/Team";
import Creation from "./about/creation/Creation";
import ResetPassword from "./connection/ResetPassword";
import axios from "axios";
import { ResponseSnackbar, SnackbarObject } from "../utils/ResponseSnackbar";

function App() {
  const snackBarRef = useRef<SnackbarObject>(null);

  axios.interceptors.response.use(
    (response) => {
      snackBarRef.current!.handleClick(
        false,
        "Votre requête a été traitée avec succès"
      );
      return response;
    },
    (error) => {
      console.group("Error");
      console.log(error);
      console.groupEnd();
      snackBarRef.current!.handleClick(
        true,
        "Une erreur s'est produite, veuillez réessayer"
      );
      return Promise.reject(error);
    }
  );

  return (
    <div id="main">
      <NavBar />
      <div id="content">
        <ResponseSnackbar ref={snackBarRef} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          {/* <Route path="/etude-de-cas" element={<CaseStudyWTconnection />} /> */}
          <Route path="/etude-de-cas" element={<CaseStudyWconnection />} />
          {/* <Route path="/contact" element={< />} /> */}
          <Route
            path="/espace-de-collaboration"
            element={<CollaborativeSpace />}
          />
          <Route path="/dashboard" element={<DashboardPaidCase />} />
          <Route path="/approval" element={<Approval />} />
          <Route path="/new-case-approval" element={<NewCase />} />
          {/* <Route
            path="/espace-de-collaboration/etude-de-cas"
            element={<CaseStudy />}
          /> */}
          <Route path="/summary" element={<Summary />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/team" element={<Team />} />
          <Route path="/creation" element={<Creation />} />
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPassword />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
