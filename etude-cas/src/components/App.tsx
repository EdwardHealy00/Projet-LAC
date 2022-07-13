import React, { useState } from 'react';
 import Catalogue from './catalogue/Catalogue';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CaseStudyWTconnection from './caseStudy/CaseStudyWTconnection';
import CaseStudyWconnection from './caseStudy/CaseStudyWconnection';
import NavBar from './common/NavBar';
import CollaborativeSpace from './collaborativeSpace/collaborativeSpace';
import CaseStudy from './collaborativeSpace/caseStudy/CaseStudy';
import DashboardPaidCase from './deputy/dashboard/dashboardPaidCase';

function App() {
  // const [count, setCount] = useState(0);
  return (
    <div id="main">
      <NavBar />
      <Routes>
        <Route path="/" element={<Catalogue />} />
        <Route path="/catalogue" element={<Catalogue />} />
        {/* <Route path="/etude-de-cas" element={<CaseStudyWTconnection />} /> */}
        <Route path="/etude-de-cas" element={<CaseStudyWconnection />} />
        {/* <Route path="/contact" element={< />} /> */}
        <Route
          path="/espace-de-collaboration"
          element={<CollaborativeSpace />}
        />
        <Route path="/dashboard" element={<DashboardPaidCase />} />
        {/* <Route
          path="/espace-de-collaboration/etude-de-cas"
          element={<CaseStudy />}
        /> */}
      </Routes>
    </div>
  );
}

export default App;
