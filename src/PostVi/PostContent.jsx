import React from 'react';
import { FaThumbsUp, FaRegComment, FaHeart } from "react-icons/fa";

// 게시글의 제목, 메타 정보, 본문, 그리고 반응 버튼을 렌더링하는 컴포넌트
function PostContent({ post, comments }) {
    return (
        <>
            <h2>{post.title}</h2>
            <div className='post-meta'>
                <span>작성자: {post.author}</span>
                <span className="separator">|</span>
                <span>작성일: {post.date}</span>
                <span className="separator">|</span>
                <span>조회수: {post.views}</span>
            </div>
            <hr />
            <div className='post-content'>
                <p>{post.content}</p>
            </div>
            <div className='post-reactions'>
                <button className='reaction-button like'>
                    <FaThumbsUp className='reaction-icon' /> 추천
                </button>
                <button className='reaction-button heart'>
                    <FaHeart className='reaction-icon' /> 좋아요
                </button>
                <button className='reaction-button comment'>
                    <FaRegComment className='reaction-icon' /> 댓글 ({comments.length})
                </button>
            </div>
        </>
    );
}

export default PostContent;