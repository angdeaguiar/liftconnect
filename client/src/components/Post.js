import React, { useState } from 'react';
import useUserState from '../hooks/useUserState'
import axios from 'axios';

const OPTIONS = { month: "long", day: "numeric" }

const Post = (props) => {
    const {user} = useUserState();

    const [content, setContent] = useState('');

    const setDate = (date) => {
        return new Date(date).toLocaleString("en", OPTIONS)
    };

    const createComment = () => {
        axios.post('http://localhost:8080/api/posts/comment', {
            post_id: props.post.id,
            user_id: user.id,
            content
        }, { withCredentials: true }).then(() => {
            setContent('');
            props.submit(true);
        });
    };

    return (
        <div className="card">
            <div className="card-body">
                <h6 className="card-subtitle mb-2">{props.post.user.first_name + " " + props.post.user.last_name}</h6>
                <p>{setDate(props.post.created_at)}</p>
                    <h5 className="card-title">{props.post.title}</h5>
                    <p className="card-text">{props.post.content}</p>
            </div>
            <div className="card-footer">
                {props.post.comments && props.post.comments.map(comment => (
                    <div>
                        <p>{comment.user.first_name + " " + comment.user.last_name}</p>
                        <p>{setDate(comment.created_at)}</p>
                        <p>{comment.content}</p>
                    </div>
                ))}
                <textarea
                    id="post-text-area"
                    className="textarea"
                    placeholder="Add comment..."
                    rows="4"
                    onChange={e => setContent(e.target.value)}
                    value={content}
                >
                </textarea>
                <button onClick={createComment}>Comment</button>
            </div>
        </div>
    );
};

export default Post;