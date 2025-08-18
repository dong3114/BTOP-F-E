import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import posts from './posts';
import './App.css';
import { FaThumbsUp, FaRegComment, FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function PostView() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [post, setPost] = useState(null);
  const [postIndex, setPostIndex] = useState(-1);

  const { id } = useParams();
  const navigate = useNavigate();

  // useEffect 훅을 사용하여 id가 변경될 때마다 게시글 정보를 업데이트
  useEffect(() => {
    // URL의 id 파라미터를 기반으로 현재 게시글의 인덱스를 찾습니다.
    const currentIndex = posts.findIndex((p) => p.id === parseInt(id));
    setPostIndex(currentIndex);

    // 게시글이 존재하면 post 상태를 업데이트합니다.
    if (currentIndex !== -1) {
      setPost(posts[currentIndex]);
    } else {
      setPost(null);
    }
    // id가 바뀔 때마다 useEffect를 다시 실행하도록 의존성 배열에 id를 추가합니다.
  }, [id]);
  
  // 게시글이 존재하지 않으면 오류 메시지를 반환합니다.
  if (!post) {
    return <div className="outer">게시글을 찾을 수 없어.</div>;
  }
  
  // 이전/다음 게시글을 찾습니다.
  const prevPost = postIndex > 0 ? posts[postIndex - 1] : null;
  const nextPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : null;

  const handleGoBack = () => {
    navigate('/');
  };
  
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };
  
  const handleCommentSubmit = () => {
    if (newComment.trim() !== '') {
      const commentId = comments.length > 0 ? comments[comments.length - 1].id + 1 : 1;
      const date = new Date().toLocaleDateString('ko-KR');
      const time = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
      const newCommentData = {
        id: commentId,
        author: '익명',
        content: newComment,
        date: date,
        time: time
      };
      setComments([...comments, newCommentData]);
      setNewComment('');
    }
  };
  
  return (
    <div className='post-view'>
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
      <div className='post-actions'>
        <button className="btn-edit">수정</button>
        <button className="btn-delete">삭제</button>
        <button onClick={handleGoBack} className="btn-list">목록으로</button>
      </div>

      {/* 이전 글/다음 글 네비게이션 */}
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
    </div>
  );
}

export default PostView;