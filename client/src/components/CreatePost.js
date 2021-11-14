// External Imports
import React, { useState } from 'react';
import useUserState from '../hooks/useUserState'
import axios from 'axios';

const acceptedMedia = "image/png, image/jpeg, video/mp4";

const CreatePost = (props) => {
    const {user} = useUserState();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedFile, setSelectedFile] = useState('');
    const [expand, setExpand] = useState(false);

    const submit = () => {
        const formData = new FormData()
        formData.append('file', selectedFile)

        const type = selectedFile.type.split("/")

        if (selectedFile) {
            axios.post(`http://localhost:8080/api/posts/upload/${type[0]}`, formData,
            { headers: { "Content-type": "multipart/form-data" } },
            { withCredentials: true }).then((res) => {
                createPost(res.data.data.id);
            });
        } else {
            createPost('');
        }
    };

    const createPost = (fileId) => {
        console.log(fileId);
        axios.post('http://localhost:8080/api/posts', {
            user_id: user.id,
            file_id: fileId,
            title,
            content
        }, { withCredentials: true }).then(() => {
            setTitle(''); setContent(''); selectedFile(''); setExpand(false);
            props.submit(true);
        });
    };

    const uploadHandler = (event) => {
        setSelectedFile(event.target.files[0]);
    };

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
                {expand && (
                   <input type="file" id="file" name="post-file" accept={acceptedMedia} onChange={uploadHandler}></input>
                )}
                <div className="post-footer">
                    <button className="no-style-btn" onClick={() => setExpand(!expand)}><i class="fa fa-upload fa-2x icon-grey"></i></button>
                    <button className="ps-button" onClick={submit}>Submit Post</button>
                </div>
            </div>
        </section>
    );
};

export default CreatePost;