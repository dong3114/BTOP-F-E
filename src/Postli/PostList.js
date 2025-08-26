// Postli/PostList.jsx
import React, { useEffect, useState } from 'react';
// posts.js에서 더미 데이터를 불러옵니다.
import posts from '../posts';
// CSS 파일은 PostList.css 하나만 필요합니다.
import './PostList.css';
// 분리된 컴포넌트들을 불러옵니다.
import SearchBar from './SearchBar';
import PostTable from './PostTable';
import Pagination from './Pagination';
import { Both } from '../utils/api/BoardApi';

// 게시글 목록 페이지의 메인 컴포넌트입니다.
function PostList() {
    const [postsData, setPostsData] = useState([]); 
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [SelectedPostId, setSelectedPostId] = useState(null);
    const [searchCategory, setSearchCategory] = useState('title');
    const postsPerPage = 10;

    // 중복된 선언 제거하고, postsData 기준으로 필터링
const safePosts = Array.isArray(postsData) ? postsData : [];
const filteredPosts = safePosts.filter(post => {
    if (searchTerm === '') {
        return true;
    }
    const target = searchCategory === 'boardTitle' ? post.boardTitle : post.memberNo;
    return target?.toString().toLowerCase().includes(searchTerm.toLowerCase());
});

    useEffect(() => {
        Both.BothList().then((data) => {
            // data가 배열인지 확인
            if (Array.isArray(data)) {
                setPostsData(data);
                console.log(postsData,"sdfdsfdsfdsfdsgwg");
                
            } else {
                console.log("서버 응답이 배열이 아님:", data);
                setPostsData([]);
            }
        });
    }, []);

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

    const handlePostClick = (postId) => {
    const updatedPosts = postsData.map(post =>
        post.id === postId ? { ...post, views: post.views + 1 } : post
    );
    setPostsData(updatedPosts);
    setSelectedPostId(postId);

    };

    return (
        <div className='width'>
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
                onPostClick={handlePostClick}
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
        </div>
    );
}

export default PostList;