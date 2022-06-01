import React, { useState } from 'react';
 import Catalogue from './Catalogue';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  // const [count, setCount] = useState(0);
  return (
    <div>
      {/* <Catalogue></Catalogue> */}
      {/* <Router> */}
        <Routes>
          <Route path="/catalogue" element={<Catalogue></Catalogue>} />
          {/* <Route path="/contact" element={< />} /> */}
        </Routes>
      {/* </Router> */}
    </div>
  );
}

export default App;
