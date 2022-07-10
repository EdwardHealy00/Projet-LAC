import React, { useState } from 'react';
 import Catalogue from './catalogue/Catalogue';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CaseStudyWTconnection from './caseStudy/CaseStudyWTconnection';
import CaseStudyWconnection from './caseStudy/CaseStudyWconnection';
import NavBar from './common/NavBar';

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
        </Routes>
    </div>
  );
}

export default App;
