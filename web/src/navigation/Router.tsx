import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import GamePage from '../pages/GamePage';
import PrizesPage from '../pages/PrizesPage';

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/game" element={<GamePage />} />
      <Route path="/prizes" element={<PrizesPage />} />
      <Route path="/" element={<Navigate to="/game" replace />} />
    </Routes>
  );
};

export default Router;
