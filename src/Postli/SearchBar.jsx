import React from 'react';

function SearchBar({ searchTerm, setSearchTerm, searchCategory, setSearchCategory }) {
    // 검색어 변경 핸들러
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // 검색 카테고리 변경 핸들러
    const handleCategoryChange = (e) => {
        setSearchCategory(e.target.value);
    };

    return (
        <div className="list-header">
            {/* <h2>자유 게시판</h2> */}
            <h2>공지사항</h2>
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
    );
}

export default SearchBar;