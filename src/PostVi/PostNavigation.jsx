import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function PostNavigation({ prevPost, nextPost }) {
    const navigate = useNavigate();
    return (
        <div className='post-navigation'>
            {prevPost ? (
                <div className="nav-link-prev" onClick={() => navigate(`/post/${prevPost.boardNo}`)}>
                    <div className="nav-icon"><FaChevronLeft /></div>
                    <div className="nav-text-group">
                        <span className="nav-title">이전글</span>
                        <span className="nav-text">{prevPost.boardTitle}</span>
                    </div>
                </div>
            ) : (
                <div className="nav-link-disabled">이전 글이 없습니다.</div>
            )}
            {nextPost ? (
                <div className="nav-link-next" onClick={() => navigate(`/post/${nextPost.boardNo}`)}>
                    <div className="nav-text-group">
                        <span className="nav-title">다음글</span>
                        <span className="nav-text">{nextPost.boardTitle}</span>
                    </div>
                    <div className="nav-icon"><FaChevronRight /></div>
                </div>
            ) : (
                <div className="nav-link-disabled">다음 글이 없습니다.</div>
            )}
        </div>
    );
}

export default PostNavigation;