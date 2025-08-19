// Postli/PostList.jsx
import React, { useState } from 'react';
// posts.js에서 더미 데이터를 불러옵니다.
import posts from '../posts';
// CSS 파일은 PostList.css 하나만 필요합니다.
import './PostList.css';
// 분리된 컴포넌트들을 불러옵니다.
import SearchBar from './SearchBar';
import PostTable from './PostTable';
import Pagination from './Pagination';

// 게시글 목록 페이지의 메인 컴포넌트입니다.
function PostList() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState('title');
    const postsPerPage = 10;

    // 검색어와 카테고리에 따라 게시글을 필터링합니다.
    const filteredPosts = posts.filter(post => {
        if (searchTerm === '') {
            return true;
        }
        const target = searchCategory === 'title' ? post.title : post.author;
        return target.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // 필터링된 게시글을 페이지네이션에 맞게 자릅니다.
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // 페이지 변경 함수
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // 이전 페이지로 이동하는 함수
    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // 다음 페이지로 이동하는 함수
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <>
            {/* 검색바 컴포넌트 */}
            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchCategory={searchCategory}
                setSearchCategory={setSearchCategory}
            />
            {/* 게시글 표 컴포넌트 */}
            <PostTable
                currentPosts={currentPosts}
            />
            {/* 페이지네이션 컴포넌트 */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageNumbers={pageNumbers}
                paginate={paginate}
                goToPrevPage={goToPrevPage}
                goToNextPage={goToNextPage}
                filteredPosts={filteredPosts}
            />
        </>
    );
}

export default PostList;