import React from 'react';

// The CommentSection component displays a list of comments and an input area for new comments.
function CommentSection({ comments, newComment, handleCommentChange, handleCommentSubmit }) {

    // A safety check to ensure comments is an array before proceeding.
    // This prevents the 'Cannot read properties of undefined' error.
    if (!Array.isArray(comments)) {
        return <div className='comments-section'>댓글 정보를 불러올 수 없습니다.</div>;
    }

    return (
        <div className='comments-section'>
            <h3>댓글 ({comments.length})</h3>
            <div className='comment-input-area'>
                <textarea
                    placeholder='댓글을 입력하세요...'
                    value={newComment}
                    onChange={handleCommentChange}
                ></textarea>
                <button onClick={handleCommentSubmit}>등록</button>
            </div>
            {/* Conditionally render the comment list or a 'no comments' message */}
            {comments.length > 0 ? (
                <div className='comment-list'>
                    {/* Map through the comments array to render each comment. */}
                    {/* The key is now set to comment.boardNo, which is a unique ID created in PostView.js. */}
                    {comments.map((comment) => (
                        <div key={comment.boardNo} className='comment-item'>
                            <div className='comment-meta'>
                                <span>{comment.author}</span>
                                <span>{comment.date} {comment.time}</span>
                            </div>
                            <div className='comment-content-text'>
                                {comment.content}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='no-comments'>
                    아직 댓글이 없어.
                </div>
            )}
        </div>
    );
}

export default CommentSection;
