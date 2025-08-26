import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Both } from '../utils/api/BoardApi'; // API 호출을 위해 Both 객체를 가져옴
import './PostView.css';
import PostContent from './PostContent';
import PostActions from './PostActions';
import PostNavigation from './PostNavigation';
import CommentSection from './CommentSection';

// 단일 게시글을 보는 메인 컴포넌트
function PostView() {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [post, setPost] = useState(null); // 게시글 상태
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

    const { boardNo } = useParams();
    const navigate = useNavigate();

    // boardNo 파라미터를 기반으로 게시글 상세 정보를 가져오는 이펙트
    useEffect(() => {
        // API로부터 게시글 상세 정보를 가져오는 함수
        const fetchPostInfo = async () => {
            try {
                // Both.BothInfo 함수를 사용하여 특정 게시글 정보 가져오기
                const postData = await Both.BothInfo(boardNo);
                setPost(postData);
            } catch (error) {
                console.error("게시글 상세 정보를 가져오는 중 오류 발생:", error);
                setPost(null);
            } finally {
                setIsLoading(false); // 로딩 완료
            }
        };
        fetchPostInfo();
    }, [boardNo]); // boardNo가 변경될 때마다 이 이펙트 재실행

    // 로딩 중일 때 메시지 표시
    if (isLoading) {
        return <div className="outer">게시글을 불러오는 중...</div>;
    }

    // 게시글을 찾지 못했을 때 메시지 표시
    
    if (!post) {
        return <div className="outer">게시글을 찾을 수 없어.</div>;
    }

    const handleGoBack = () => {
        navigate('/post');
    };

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = () => {
        if (newComment.trim() !== '') {
            const commentId = comments.length > 0 ? comments[comments.length - 1].boardNo + 1 : 1;
            const date = new Date().toLocaleDateString('ko-KR');
            const time = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

            const newCommentData = {
                boardNo: commentId,
                author: '익명',
                content: newComment,
                date: date,
                time: time
            };

            setComments([...comments, newCommentData]);
            setNewComment('');
        }
    };

    // API를 통해 이전/다음 게시글을 가져오려면 추가적인 API 호출이 필요합니다.
    // 현재는 이 기능을 구현하지 않았으므로, PostNavigation은 제외하거나 빈 값으로 전달합니다.
    const prevPost = null;
    const nextPost = null;

    return (
        <div className='post-view'>
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
