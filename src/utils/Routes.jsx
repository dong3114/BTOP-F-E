import { Routes, Route } from 'react-router-dom';
import MicStreamerPage from '../pages/mic_streamer';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MicStreamerPage />} />
      <Route path="/home" element={<MicStreamerPage />} />
    </Routes>

  );
}
