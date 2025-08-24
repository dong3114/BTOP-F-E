import { Routes, Route, Outlet } from 'react-router-dom';
import MicStreamerPage from '../pages/mic_streamer';
import PostList from '../Postli/PostList';
import PostView from '../PostVi/PostView';
import AdminMain from '../pages/admin/AdminMain';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminBoards from '../pages/admin/AdminBoards';
import AdminLogin from '../pages/admin/AdminLogin';
import MainLayout from '../pages/mainlayout';
import MemberRegister from '../pages/register';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLogin />}></Route>
      <Route path="/admin/main" element={<AdminMain />}>
        <Route path="" element={<AdminDashboard />}></Route>
        <Route path="users" element={<AdminUsers />}></Route>
        <Route path="boards" element={<AdminBoards />}></Route>
      </Route>

      <Route element={<MainLayout><Outlet /></MainLayout>}>
        <Route path="/" element={<MicStreamerPage />} />
        <Route path="/home" element={<MicStreamerPage />} />
        {/* 회원관련 라우팅 포인트 */}
        <Route path='member' element={<Outlet />}>
          <Route path='register' element={<MemberRegister />} />
        </Route>
        {/* 작성자 선승정 */}
        <Route path="/post" element={<PostList />} />
        <Route path="/post/:id" element={<PostView />} />
        <Route path="/notice" element={<h2>공지사항 페이지</h2>} />
      </Route>
    </Routes>



  );
}
