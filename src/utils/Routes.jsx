import { Routes, Route } from 'react-router-dom';
import MicStreamerPage from '../pages/mic_streamer';
import PostList from '../Postli/PostList';
import PostView from '../PostVi/PostView';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MicStreamerPage />} />
      <Route path="/home" element={<MicStreamerPage />} />
      {/* 작성자 선승정 */}
      <Route path="/post" element={<PostList />} />
      <Route path="/post/:id" element={<PostView />} />
      <Route path="/notice" element={<h2>공지사항 페이지</h2>} />
    </Routes>

  );
}
