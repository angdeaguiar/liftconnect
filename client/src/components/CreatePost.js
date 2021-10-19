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
            <div>
                <input
                    id="create-post-title"
                    placeholder="Post title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <textarea
                    id="post-text-area"
                    placeholder="Start typing to create post..."
                    rows="6"
                    cols="100"
                    onChange={e => setContent(e.target.value)}
                    value={content}
                >
                </textarea>
            </div>
            <button onClick={createPost}>Post Something</button>
        </section>
    );
};

export default CreatePost;