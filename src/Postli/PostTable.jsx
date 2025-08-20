import React from 'react';
import { Link } from 'react-router-dom';

function PostTable({ currentPosts }) {
    return (
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
    );
}

export default PostTable;