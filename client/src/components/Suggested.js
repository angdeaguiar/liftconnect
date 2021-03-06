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
        setReload(false);
    }

    return (
        <>
            {users.length > 0 && (
                <div className="suggested-container">
                    <div className="prs-title">Suggested Users</div>
                    {users.map(u => (
                        <div className="suggested-user">
                            <div className="suggested-name">
                                <p>{u.first_name + " " + u.last_name + " (" + u.pronouns + ")"}</p>
                                <p>{u.city}</p>
                                <p>S: {u.personal_records.squat} D: {u.personal_records.deadlift} B: {u.personal_records.bench}</p>
                            </div>
                            <button
                                className="no-style-btn"
                                onClick={() => followUser(u.id)}
                            >
                                <i className="fa fa-user-plus fa-2x" aria-hidden="true"></i>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default Suggested;