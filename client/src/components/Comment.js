// External Imports
import React, { useState } from 'react';
import axios from 'axios';

// Internal Imports
import useUserState from '../hooks/useUserState';

const OPTIONS = { month: "long", day: "numeric", year: 'numeric'};

const Comment = (props) => {
    const {user} = useUserState();

    const [content, setContent] = useState('');

    const setDate = (date) => {
        return new Date(date).toLocaleString("en", OPTIONS);
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
        .catch((err) => props.setError(err));
        props.submit(false);
    };

    const removeComment = (id) => {
        axios.delete(`http://localhost:8080/api/posts/comment/${id}`, { withCredentials: true })
        .then(() => {
            setContent('');
            props.submit(true);
        })
        .catch((err) => props.setError(err));
        props.submit(false);
    };

    return (
        <div className="card-footer footer-container">
            {props.comments && props.comments.map(comment => (
                <div className="cmt-container">
                    <div className="header-container">
                        <div className="fix">
                            <img alt="Profile" className="cmt-img-user" src="https://capenetworks.com/static/images/testimonials/user-icon.svg" />
                            <div className="header">
                                <p className="less-btm">{comment.user.first_name + " " + comment.user.last_name}</p>
                                <div>{setDate(comment.created_at)}</div>
                            </div>
                        </div>
                        {user.id === comment.user_id && (
                            <button className="no-style-btn" onClick={() => removeComment(comment.id)}><i className="fa fa-trash fa-lg" aria-hidden="true"></i></button>
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
    );
};

export default Comment;