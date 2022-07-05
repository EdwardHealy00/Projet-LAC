import React, { useState } from 'react';
 import Catalogue from './Catalogue';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CaseStudyWTconnection from './CaseStudyWTconnection';
import CaseStudyWconnection from './CaseStudyWconnection';

function App() {
  // const [count, setCount] = useState(0);
  return (
    <div>
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
