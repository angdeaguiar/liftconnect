// External Imports
import React, { useState } from 'react';
import { Redirect } from "react-router-dom";
import axios from 'axios';

// Internal Imports
import useUserState from '../hooks/useUserState';

const Login = () => {
    const {updateProperties} = useUserState();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState('');

    const submit = () => {
        axios.post('http://localhost:8080/self/login', {
            email,
            password
        }, { withCredentials: true })
        .then(() => {
            setRedirect(true)
            axios.get('http://localhost:8080/self', { withCredentials: true }).then(res => {
                updateProperties({
                    id: res.data.data.id,
                    fname: res.data.data.first_name,
                    lname: res.data.data.last_name,
                    prs: res.data.data.personal_records,
                });
            });
        })
        .catch((err) => setError(err));
    }

    if (redirect) {
        return <Redirect to="/home"/>;
    }

    return (
        <div className="login-page">
            <p className="register-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sollicitudin leo ac eros convallis, sit amet aliquam ipsum commodo. Curabitur non pharetra quam. Aenean a hendrerit ex. Suspendisse viverra quis lacus a ultrices. Vestibulum sed purus rutrum, semper erat nec, porttitor velit. Duis ut libero vel erat porttitor rhoncus.</p>
            <form className="login-box" onSubmit={submit}>
                <p className="register-title">Please sign in</p>
                {error && (
                    <p className="error">Incorrect credentials, please try again</p>
                )}
                <input type="email" className="form-control register-input" placeholder="Email address" required
                    onChange={e => setEmail(e.target.value)}
                />
                <input type="password" className="form-control register-input" placeholder="Password" required
                    onChange={e => setPassword(e.target.value)}
                />
                <p>Not a user? <a href="/register">Sign Up</a></p>
                <button className="w-100 btn btn-lg btn-primary" type="button" onClick={() => submit()}>Sign in</button>
            </form>
        </div>
    );
};

export default Login;