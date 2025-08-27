import React from 'react';

function PostActions({ handleGoBack }) {
    return (
        <div className='post-actions'>
            {/*
            <button className="btn-edit">수정</button>
            <button className="btn-delete">삭제</button>
            */}
            <button onClick={handleGoBack} className="btn-list">목록으로</button>
        </div>
    );
}

export default PostActions;