import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Both } from '../utils/api/BoardApi';
import './PostView.css';
import PostContent from './PostContent';
import PostActions from './PostActions';
import PostNavigation from './PostNavigation';
import CommentSection from './CommentSection';

function PostView() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [post, setPost] = useState(null);         // ← 원본 스키마 그대로
  const [postIndex, setPostIndex] = useState(-1);
  const [apiPosts, setApiPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { boardNo } = useParams();
  const navigate = useNavigate();

  // (선택) Dev 모드 중복 증가 방지 용도
  const viewedOnceRef = useRef(false);

  // 1) 목록: 내비게이션용으로만 사용 (원본 데이터 유지)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await Both.BothList();
        if (!alive) return;
        if (Array.isArray(list)) {
          setApiPosts(list);
          const idx = list.findIndex(p => String(p.boardNo) === String(boardNo));
          setPostIndex(idx);
        } else {
          setApiPosts([]);
          setPostIndex(-1);
        }
      } catch (e) {
        console.error('목록 로딩 실패:', e);
        if (!alive) return;
        setApiPosts([]);
        setPostIndex(-1);
      }
    })();
    return () => { alive = false; };
  }, [boardNo]);

  // 2) 상세: 조회수 증가 트리거 (원본 필드명 그대로 setPost)
  useEffect(() => {
    let alive = true;
    setIsLoading(true);
    (async () => {
      try {
        // 서버에서 이 호출 시 views++ 처리된다고 가정
        const detail = await Both.BothInfo(boardNo);
        if (!alive) return;
        setPost(detail);            // ← boardTitle/boardDetail/... 원본 그대로
        viewedOnceRef.current = true;
      } catch (e) {
        console.error('상세 로딩 실패:', e);
        if (!alive) return;
        setPost(null);
      } finally {
        if (alive) setIsLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [boardNo]);

  if (isLoading) return <div className="outer">게시글을 불러오는 중...</div>;
  if (!post)     return <div className="outer">게시글을 찾을 수 없어.</div>;

  const prevPost = postIndex > 0 ? apiPosts[postIndex - 1] : null;
  const nextPost = postIndex >= 0 && postIndex < apiPosts.length - 1 ? apiPosts[postIndex + 1] : null;

  const handleGoBack = () => navigate('/post');
  const handleCommentChange = (e) => setNewComment(e.target.value);
  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    const nextId = comments.length ? comments[comments.length - 1].boardNo + 1 : 1;
    const date = new Date().toLocaleDateString('ko-KR');
    const time = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    setComments([...comments, { boardNo: nextId, author: '익명', content: newComment, date, time }]);
    setNewComment('');
  };

  return (
    <div className='post-view'>
      {/* PostContent는 post.boardTitle / post.boardDetail / post.views / post.createdAt 그대로 사용 */}
      <PostContent post={post} comments={comments} />
      <PostActions handleGoBack={handleGoBack} />
      <PostNavigation prevPost={prevPost} nextPost={nextPost} />
      <CommentSection
        comments={comments}
        newComment={newComment}
        handleCommentChange={handleCommentChange}
        handleCommentSubmit={handleCommentSubmit}
      />
    </div>
  );
}

export default PostView;
