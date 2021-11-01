import React, { useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';

import useUserState from '../hooks/useUserState'

const Nav = () => {
    const {user} = useUserState();

    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);

    let menu;

    const logout = () => {
        axios.get('http://localhost:8080/self/logout', { withCredentials: true });
    };

    const followUser = (id) => {

    }

    useEffect(() => {
        if (searchTerm === '') {
            setUsers([]);
            return;
        }
        const delayDebounceFn = setTimeout(() => {
            axios.get(`http://localhost:8080/api/users/all/${user.id}?firstname=${searchTerm}`,
            { withCredentials: true }).then(res => {
                setUsers(res.data.data);
            });
        }, 250)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm]);

    if (!user.id) {
        menu = (
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
                <li className="nav-item active">
                    <Link to="/register" className="nav-link nav-title">Register</Link>
                </li>
                <li className="nav-item active">
                    <Link to="/" className="nav-link nav-title">Login</Link>
                </li>
            </ul>
        )
    } else {
        menu = (
            <>
                <input type ="text"
                    className="search"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    placeholder="Search for users..."
                />
                <ul className="navbar-nav me-auto mb-2 mb-md-0 nav-container">
                    <li className="nav-item active">
                        <Link to="/home" className="nav-link nav-title">Home</Link>
                    </li>
                    <li className="nav-item active">
                        <Link to="/workouts" className="nav-link nav-title">Workouts</Link>
                    </li>
                    <li className="nav-item active">
                        <Link to="/" className="nav-link nav-title" onClick={logout}>Logout</Link>
                    </li>
                </ul>
            </>
        )
    }

    return (
        <>
            <nav className="navbar navbar-expand navbar-white bg-white mb-4 nav-no-margin">
                <div className="container-fluid">
                    <Link to="/home" className="navbar-brand title">lift&Connect</Link>
                    {menu}
                </div>
            </nav>
            {user && users.length > 0 && (
                <div className="search-bar-container">
                    {users.map(u => (
                        <div className="user-search">
                            {u.first_name + " " + u.last_name}
                            <button
                                onClick={() => followUser(user.id)}
                                className="no-style-btn"
                            >
                                <i class="fa fa-user-plus" aria-hidden="true"></i>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default Nav;