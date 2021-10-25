import React, { useEffect, useState } from 'react';
import useUserState from '../hooks/useUserState';
import axios from 'axios';

const Suggested = () => {
    const {user} = useUserState();

    const [users, setUsers] = useState([]);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        if (!user.id) return;
        axios.get(`http://localhost:8080/api/users/recommend/${user.id}`,
        { withCredentials: true }).then(res => {
            setUsers(res.data.data);
        });
    }, [user.id, reload]);

    const followUser = (id) => {
        axios.post(`http://localhost:8080/api/users/${user.id}/follow/${id}`,
        { withCredentials: true }).then(() => {
            setReload(true);
        });
    }

    return (
        <>
            {users && users.map(u => (
                <div>
                    <br />
                    <br />
                    <br />
                    <h3>Suggested Users</h3>
                    <p>{u.first_name + " " + u.last_name + " (" + u.pronouns + ")"}</p>
                    <button onClick={() => followUser(u.id)}>Follow</button>
                </div>
            ))}
        </>
    );
};

export default Suggested;