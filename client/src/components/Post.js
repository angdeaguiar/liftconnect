// External Imports
import React, { useState } from 'react';
import axios from 'axios';

// Internal Imports
import useUserState from '../hooks/useUserState';
import Comment from './Comment';

const OPTIONS = { month: "long", day: "numeric", year: 'numeric'};

const Post = (props) => {
    const {user} = useUserState();

    const [error, setError] = useState('');

    const setDate = (date) => {
        return new Date(date).toLocaleString("en", OPTIONS);
    };

    const removePost = (id) => {
        axios.delete(`http://localhost:8080/api/posts/${id}`, { withCredentials: true })
        .then(() => {
            props.submit(true);
        })
        .catch((err) => setError(err));
        props.submit(false);
    };

    return (
        <div className="card card-container">
            {error && (
                <p>An error occurred</p>
            )}
            <div className="card-body">
                <div className="header-container">
                    <div className="fix">
                        <img alt="Profile" className="img-user" src="https://capenetworks.com/static/images/testimonials/user-icon.svg" />
                        <div className="header">
                            <div className="name">{props.post.user.first_name + " " + props.post.user.last_name}</div>
                            <p>{setDate(props.post.created_at)}</p>
                        </div>
                    </div>
                    {user.id === props.post.user_id && (
                        <button className="no-style-btn" onClick={() => removePost(props.post.id)}><i className="fa fa-trash fa-lg" aria-hidden="true"></i></button>
                    )}
                </div>
                <div className="content-container">
                    <h2 className="card-title">{props.post.title}</h2>
                    <p className="card-text">{props.post.content}</p>
                    {props.post.file_id && props.post.file.file_type === "image" && (
                        <img src={props.post.file.s3_url} alt="post" />
                    )}
                    {props.post.file_id && props.post.file.file_type === "video" && (
                        <video className="video" controls>
                            <source src={props.post.file.s3_url} type="video/mp4"></source>
                        </video>
                    )}
                </div>
            </div>
            <Comment post={props.post} comments={props.post.comments} submit={props.submit} setError={setError} />
        </div>
    );
};

export default Post;