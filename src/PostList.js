import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import posts from './posts';
import './App.css';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function PostList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('title');
  const postsPerPage = 10;
  
  // 검색어와 카테고리에 따라 게시글 필터링
  const filteredPosts = posts.filter(post => {
    if (searchTerm === '') {
      return true; // 검색어가 없으면 모든 게시글 표시
    }
    const target = searchCategory === 'title' ? post.title : post.author;
    return target.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // 필터링된 게시글을 기반으로 페이지네이션 적용
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 검색 시 1페이지로 돌아가기
  };

  const handleCategoryChange = (e) => {
    setSearchCategory(e.target.value);
    setCurrentPage(1);
  };
  
  return (
    <>
      <div className="list-header">
        <h2>자유 게시판</h2>
        {/* 검색 UI 추가 */}
        <div className="search-container">
          <select value={searchCategory} onChange={handleCategoryChange} className="search-category">
            <option value="title">제목</option>
            <option value="author">작성자</option>
          </select>
          <input
            type="text"
            placeholder="검색어를 입력하세요..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>
      <table className='list-table'>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>
                  <Link to={`/post/${post.id}`} className="post-link">
                    {post.title}
                  </Link>
                </td>
                <td>{post.author}</td>
                <td>{post.date}</td>
                <td><button>삭제</button></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-results">검색 결과가 없어.</td>
            </tr>
          )}
        </tbody>
      </table>
      {filteredPosts.length > 0 && (
        <div className='pagination'>
          <button onClick={goToPrevPage} disabled={currentPage === 1}>
            <IoIosArrowBack />
          </button>
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={currentPage === number ? 'active' : ''}
            >
              {number}
            </button>
          ))}
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>
            <IoIosArrowForward />
          </button>
        </div>
      )}
    </>
  );
}

export default PostList;