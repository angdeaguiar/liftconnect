import React, { useState } from 'react';
import axios from 'axios';

import useUserState from '../hooks/useUserState'

const OPTIONS = { month: "long", day: "numeric" }

const Post = (props) => {
    const {user} = useUserState();

    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    const setDate = (date) => {
        return new Date(date).toLocaleString("en", OPTIONS)
    };

    const createComment = () => {
        axios.post('http://localhost:8080/api/posts/comment', {
            post_id: props.post.id,
            user_id: user.id,
            content
        }, { withCredentials: true })
        .then(() => {
            setContent('');
            props.submit(true);
        })
        .catch((err) => setError(err));
    };

    const removeComment = (id) => {
        axios.delete(`http://localhost:8080/api/posts/comment/${id}`, { withCredentials: true })
        .then(() => {
            setContent('');
            props.submit(true);
        })
        .catch((err) => setError(err));
    }

    const removePost = (id) => {
        axios.delete(`http://localhost:8080/api/posts/${id}`, { withCredentials: true })
        .then(() => {
            setContent('');
            props.submit(true);
        })
        .catch((err) => setError(err));
    }

    return (
        <div className="card card-container">
            <div className="card-body">
                <div className="header-container">
                    <div className="fix">
                        <img className="img-user" src="https://capenetworks.com/static/images/testimonials/user-icon.svg" />
                        <div className="header">
                            <div className="name">{props.post.user.first_name + " " + props.post.user.last_name}</div>
                            <p>{setDate(props.post.created_at)}</p>
                        </div>
                    </div>
                    {user.id === props.post.user_id && (
                        <button className="no-style-btn" onClick={() => removePost(props.post.id)}><i class="fa fa-trash fa-lg" aria-hidden="true"></i></button>
                    )}
                </div>
                <div className="content-container">
                    <h2 className="card-title">{props.post.title}</h2>
                    <p className="card-text">{props.post.content}</p>
                </div>
            </div>
            <div className="card-footer footer-container">
                {props.post.comments && props.post.comments.map(comment => (
                    <div className="cmt-container">
                        <div className="header-container">
                            <div className="fix">
                                <img className="cmt-img-user" src="https://capenetworks.com/static/images/testimonials/user-icon.svg" />
                                <div className="header">
                                    <p className="less-btm">{comment.user.first_name + " " + comment.user.last_name}</p>
                                    <div>{setDate(comment.created_at)}</div>
                                </div>
                            </div>
                            {user.id === comment.user_id && (
                                <button className="no-style-btn" onClick={() => removeComment(comment.id)}><i class="fa fa-trash fa-lg" aria-hidden="true"></i></button>
                            )}
                        </div>
                        <div className="cmt-container">
                            <p>{comment.content}</p>
                        </div>
                    </div>
                ))}
                <textarea
                    id="post-text-area"
                    className="textarea"
                    placeholder="Add comment..."
                    onChange={e => setContent(e.target.value)}
                    value={content}
                >
                </textarea>
                <button className="cmt-btn" onClick={createComment}>Comment</button>
            </div>
        </div>
    );
};

export default Post;