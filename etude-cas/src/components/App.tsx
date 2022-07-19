import React, { useState } from 'react';
 import Catalogue from './catalogue/Catalogue';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CaseStudyWconnection from './caseStudy/CaseStudyWconnection';
import NavBar from './common/NavBar';
import CollaborativeSpace from './collaborativeSpace/collaborativeSpace';
import DashboardPaidCase from './deputy/dashboard/dashboardPaidCase';
import Approval from './deputy/approval/Approval';
import Home from './home/Home';

function App() {
  // const [count, setCount] = useState(0);
  return (
    <div id="main">
      <NavBar />
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
        {/* <Route
          path="/espace-de-collaboration/etude-de-cas"
          element={<CaseStudy />}
        /> */}
      </Routes>
    </div>
  );
}

export default App;
