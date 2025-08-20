import './App.css';
import { BrowserRouter } from 'react-router-dom';
import MainLayout from './pages/mainlayout';
import AppRoutes from './utils/Routes';
import { ToastContainer } from 'react-toastify';

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <AppRoutes />
      </MainLayout>

      {/* 전역 토스트 (사용 안 하면 삭제해도 됨) */}
      <ToastContainer position="top-right" autoClose={2000} newestOnTop />
    </BrowserRouter>
  );
}
