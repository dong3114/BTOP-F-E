import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function PostNavigation({ prevPost, nextPost }) {
    const navigate = useNavigate();
    return (
        <div className='post-navigation'>
            {prevPost ? (
                <div className="nav-link-prev" onClick={() => navigate(`/post/${prevPost.id}`)}>
                    <div className="nav-icon"><FaChevronLeft /></div>
                    <div className="nav-text-group">
                        <span className="nav-title">이전글</span>
                        <span className="nav-text">{prevPost.title}</span>
                    </div>
                </div>
            ) : (
                <div className="nav-link-disabled">이전 글이 없습니다.</div>
            )}
            {nextPost ? (
                <div className="nav-link-next" onClick={() => navigate(`/post/${nextPost.id}`)}>
                    <div className="nav-text-group">
                        <span className="nav-title">다음글</span>
                        <span className="nav-text">{nextPost.title}</span>
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