
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Redirect} from "react-router-dom";
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import useUserState from '../hooks/useUserState'
import PersonalRecords from '../components/PersonalRecords';
import Suggested from '../components/Suggested';

const Home = () => {
    const {user, updateProperties} = useUserState();

    const [posts, setPosts] = useState([]);
    const [submit, setSubmit] = useState(false);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8080/self', { withCredentials: true }).then(res => {
            updateProperties({
                id: res.data.data.id,
                fname: res.data.data.first_name,
                lname: res.data.data.last_name,
                prs: res.data.data.personal_records,
            });
        });
    }, [user.id]);

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
                <div>{user.fname ? user.fname : 'You are not logged in'}</div>
                {user.fname && (
                    <CreatePost submit={setSubmit} />
                )}
                {posts && posts.map(post => (
                    <Post post={post} submit={setSubmit} />
                ))}
            </div>
            <div className="right">
                <button onClick={() => setRedirect(true)}>Create Workout</button>
                <PersonalRecords />
                <Suggested />
            </div>
        </div>
    );
};

export default Home;