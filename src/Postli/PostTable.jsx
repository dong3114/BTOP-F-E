import React from 'react';
import { Link } from 'react-router-dom';

function PostTable({ currentPosts, onPostClick }) {
    console.log("dsfdsfsdffdfddf",currentPosts);
    
    return (
        <table className='list-table'>
            <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>조회수</th>
                </tr>
            </thead>
            <tbody>
                {currentPosts.length > 0 ? (
                    currentPosts.map((post) => (
                        <tr key={post.boardNo} >
                            <td>{post.boardNo}</td>
                            <td className="post-link-cell" onClick={() => onPostClick(post.boardNo)}>
                                <Link to={`/post/${post.boardNo}`} className="post-link">
                                {post.boardTitle}
                                </Link>
                            </td>
                            <td>{post.memberNo}</td>
                            <td>{post.createdAt}</td>
                            <td>{post.views}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="no-results">검색 결과가 없습니다.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default PostTable;