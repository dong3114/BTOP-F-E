import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import MainLayout from './pages/mainlayout';
import AppRoutes from './utils/Routes';


export default function App() {
  return (
    <div>
      <BrowserRouter>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </BrowserRouter>
    </div>    
  );
}