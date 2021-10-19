import React from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';
import useUserState from '../hooks/useUserState'

const Nav = () => {
    const {user} = useUserState();

    const logout = () => {
        axios.post('http://localhost:8080/self', { withCredentials: true });
    };

    let menu;

    if (user.fname === '') {
        menu = (
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
                <li className="nav-item active">
                    <Link to="/register" className="nav-link">Register</Link>
                </li>
                <li className="nav-item active">
                    <Link to="/login" className="nav-link">Login</Link>
                </li>
            </ul>
        )
    } else {
        menu = (
            <>
                <form className="d-flex">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                    <button className="btn btn-outline-info" type="submit">Search</button>
                </form>
                <ul className="navbar-nav me-auto mb-2 mb-md-0">
                    <li className="nav-item active">
                        <Link to="/" className="nav-link">Home</Link>
                    </li>
                    <li className="nav-item active">
                        <Link to="/workouts" className="nav-link">Workouts</Link>
                    </li>
                    <li className="nav-item active">
                        <Link to="/login" className="nav-link" onClick={logout}>Logout</Link>
                    </li>
                </ul>
            </>
        )
    }

    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark mb-4">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">lift&Connect</Link>

                {menu}
            </div>
        </nav>
    );
};

export default Nav;