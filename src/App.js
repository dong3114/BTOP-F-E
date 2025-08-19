import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Header from './components/layouts/Header';
import PostList from './Postli/PostList';
import PostView from './PostVi/PostView';

// 메인 페이지
function HomePage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>환영합니다! BTOP 사투리 메인 페이지입니다.</h1>
      {/* 자유게시판으로 이동하는 링크를 SPA 방식으로 */}
      <p>
        아직 개발 중인 페이지입니다. <Link to="/post">자유게시판으로 이동</Link>
      </p>
    </div>
  );
}

function App() {
  let title = "BTOP 사투리";

  return (
    <BrowserRouter>
      <div className="App">
        <Header title={title} />
        <div className="outer">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/post" element={<PostList />} />
            <Route path="/post/:id" element={<PostView />} />
            <Route path="/notice" element={<h2>공지사항 페이지</h2>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;