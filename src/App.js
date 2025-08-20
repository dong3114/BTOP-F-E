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
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminMain />}>
            <Route path="" element={<AdminDashboard />}></Route>
            <Route path="users" element={<AdminUsers />}></Route>
            <Route path="boards" element={<AdminBoards />}></Route>
        </Route>
        <Route path="/" element={<MainLayout><AppRoutes /></MainLayout>} />
      </Routes>

      {/* 전역 토스트 (사용 안 하면 삭제해도 됨) */}
      <ToastContainer position="top-right" autoClose={2000} newestOnTop />
    </BrowserRouter>
  );
}