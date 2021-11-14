
// External Imports
import React, {useEffect, useState} from 'react';
import {Redirect} from "react-router-dom";
import axios from 'axios';

// Internal Imports
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import useUserState from '../hooks/useUserState'
import PersonalRecords from '../components/PersonalRecords';
import Suggested from '../components/Suggested';

const Home = () => {
    const {user} = useUserState();

    const [posts, setPosts] = useState([]);
    const [submit, setSubmit] = useState(false);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!user.id) return;
        axios.get(`http://localhost:8080/api/posts/${user.id}`, { withCredentials: true }).then(res => {
            setPosts(res.data.data);
        });
    }, [user.id, submit]);

    if (redirect) {
        return <Redirect to="/create"/>;
    }

    return (
        <div className="container">
            <div className="middle-lane">
                <div className="greeting">{"Welcome back, " + user.fname}</div>
                {user.fname && (
                    <CreatePost submit={setSubmit} />
                )}
                {posts && posts.map(post => (
                    <Post post={post} submit={setSubmit} />
                ))}
            </div>
            <div className="right-lane">
                <button
                    id="create-workout-btn"
                    className="create-workout-btn"
                    onClick={() => setRedirect(true)}
                >
                    Create Workout
                </button>
                <PersonalRecords />
                <Suggested />
            </div>
        </div>
    );
};

export default Home;