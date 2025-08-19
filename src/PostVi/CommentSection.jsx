import React from 'react';

function CommentSection({ comments, newComment, handleCommentChange, handleCommentSubmit }) {
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
            {comments.length > 0 ? (
                <div className='comment-list'>
                    {comments.map((comment) => (
                        <div key={comment.id} className='comment-item'>
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