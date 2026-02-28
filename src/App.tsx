import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import AnnigatoHomepage from './pages/AnnigatoHomePage';
import EspaceParentPage from './pages/EspaceParentPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AnnigatoHomepage />} />
      <Route path="/espace-parent" element={<EspaceParentPage />} />
    </Routes>
  );
}

export default App;
