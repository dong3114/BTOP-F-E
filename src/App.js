import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from './pages/mainlayout';
import AppRoutes from './utils/Routes';
import { ToastContainer } from 'react-toastify';
import AdminMain from './pages/admin/AdminMain';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBoards from './pages/admin/AdminBoards';

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