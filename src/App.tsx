import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import AnnigatoHomepage from './pages/AnnigatoHomePage';
import EspaceParentPage from './pages/EspaceParentPage';
import CreateCakePage from './pages/CreateCakePage';
import AdminSettingsPage from './pages/AdminSettingsPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AnnigatoHomepage />} />
      <Route path="/creer" element={<CreateCakePage />} />
      <Route path="/admin/settings" element={<AdminSettingsPage />} />
      <Route path="/espace-parent" element={<EspaceParentPage />} />
    </Routes>
  );
}

export default App;
