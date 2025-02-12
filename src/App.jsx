import React from 'react';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import Guard from './components/Guard';  // Use Guard instead of GuardPortal
import Student from './components/Student';
import Admin from './components/Admin';
import {ErrorPage} from './components/commons';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to="/student" />} />
        <Route path="/guard" element={<Guard />} />
        <Route path="/student" element={<Student />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<ErrorPage />} /> {/* Catch-all for errors */}
      </Routes>
    </Router>
  );
}

export default App;
