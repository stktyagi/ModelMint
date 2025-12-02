import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Workspace from './pages/Workspace';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/workspace/new" element={<Workspace />} />
          <Route path="/workspace/:projectId" element={<Workspace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
