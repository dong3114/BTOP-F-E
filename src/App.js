import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import PostList from './PostList';
import PostView from './PostView';

function App() {
  let title = "BTOP 사투리";

  return (
    <BrowserRouter>
      <div className="App">
        <Header title={title}/>
        <div className="outer">
          <Routes>
            {/* 자유 게시판 페이지 */}
            <Route path="/" element={<PostList />} />
            {/* 게시글 상세 페이지 */}
            <Route path="/post/:id" element={<PostView />} />
            {/* 공지사항 페이지 (아직 내용 없음) */}
            <Route path="/notice" element={<h2>공지사항 페이지</h2>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;