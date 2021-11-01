import React, { useState } from 'react';
import useUserState from '../hooks/useUserState'
import axios from 'axios';

const CreatePost = (props) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const {user} = useUserState();

    const createPost = () => {
        axios.post('http://localhost:8080/api/posts', {
            user_id: user.id,
            title,
            content
        }, { withCredentials: true }).then(() => {
            setTitle('');
            setContent('');
            props.submit(true);
        });
    }

    return (
        <section id="post-something">
            <div className="ps-container">
                <input
                    id="create-post-title"
                    placeholder="Post title..."
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="ps-input"
                />
                <textarea
                    id="post-text-area"
                    placeholder="Post content..."
                    rows="6"
                    onChange={e => setContent(e.target.value)}
                    value={content}
                    className="ps-textarea"
                >
                </textarea>
                <button className="ps-button" onClick={createPost}>Submit Post</button>
            </div>
        </section>
    );
};

export default CreatePost;