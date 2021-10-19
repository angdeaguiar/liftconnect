
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import useUserState from '../hooks/useUserState'

const Home = () => {
    const {user, updateProperties} = useUserState();

    const [posts, setPosts] = useState([]);
    const [submit, setSubmit] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8080/self', { withCredentials: true }).then(res => {
            updateProperties({
                id: res.data.data.id,
                fname: res.data.data.first_name,
                lname: res.data.data.last_name,
            });
        });
    }, [user.id]);

    useEffect(() => {
        if (!user.id) return;
        axios.get(`http://localhost:8080/api/posts/${user.id}`, { withCredentials: true }).then(res => {
            setPosts(res.data.data);
        });
    }, [user.id, submit]);

    return (
        <div>
            <div>{user.fname ? user.fname : 'You are not logged in'}</div>
            {user.fname && (
                <CreatePost submit={setSubmit} />
            )}
            {posts && posts.map(post => (
                <Post post={post} submit={setSubmit} />
            ))}
        </div>
    );
};

export default Home;