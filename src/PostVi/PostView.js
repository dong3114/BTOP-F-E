import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate 추가
import posts from '../posts';
import './PostView.css';
import PostContent from './PostContent';
import PostActions from './PostActions';
import PostNavigation from './PostNavigation';
import CommentSection from './CommentSection';

function PostView() {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [post, setPost] = useState([]);
    const [postIndex, setPostIndex] = useState(-1);

    const { id } = useParams();
    const navigate = useNavigate(); // navigate 생성

    useEffect(() => {
        const currentIndex = posts.findIndex((p) => p.id === parseInt(id));
        setPostIndex(currentIndex);

        if (currentIndex !== -1) {
            setPost(posts[currentIndex]);
        } else {
            setPost(null);
        }
    }, [id]);

    if (!post) {
        return <div className="outer">게시글을 찾을 수 없어.</div>;
    }

    const prevPost = postIndex > 0 ? posts[postIndex - 1] : null;
    const nextPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : null;

    // 목록으로 돌아가기 버튼 수정
    const handleGoBack = () => {
        navigate('/post'); // 항상 PostList로 이동
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