// External Imports
import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';

// Internal Imports
import useRegisterState from '../hooks/useRegisterState';

const Register = () => {
    const {register, updateProperty} = useRegisterState();

    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState('');

    const submit = () => {
        axios.post(`http://localhost:8080/api/users/register`, {
            first_name: register.fname,
            last_name: register.lname,
            email: register.email,
            password: register.password,
            city: register.city,
            pronouns: register.pronouns
        }, { withCredentials: true })
        .then(() => setRedirect(true))
        .catch((err) => setError(err))
    };

    if (redirect) {
        return <Redirect to="/"/>;
    }

    return (
        <div className="login-page">
            <p className="register-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sollicitudin leo ac eros convallis, sit amet aliquam ipsum commodo. Curabitur non pharetra quam. Aenean a hendrerit ex. Suspendisse viverra quis lacus a ultrices. Vestibulum sed purus rutrum, semper erat nec, porttitor velit. Duis ut libero vel erat porttitor rhoncus.</p>
            <form className="register-box" onSubmit={submit}>
                <p className="register-title">Register for lift&Connect</p>
                {error && (
                    <p className="error">Unable to register, please try again</p>
                )}
                <input className="form-control register-input" placeholder="First name" required
                    onChange={e => updateProperty('fname', e.target.value)}
                />
                <input className="form-control register-input" placeholder="Last name" required
                    onChange={e => updateProperty('lname', e.target.value)}
                />
                <input type="email" className="form-control register-input" placeholder="Email" required
                    onChange={e => updateProperty('email', e.target.value)}
                />
                <input type="password" className="form-control register-input" placeholder="Password" required
                    onChange={e => updateProperty('password', e.target.value)}
                />
                <input type="text" className="form-control register-input" placeholder="City" required
                    onChange={e => updateProperty('city', e.target.value)}
                />
                <select className="form-control register-input"
                    value={register.pronouns}
                    onChange={e => updateProperty('pronouns', e.target.value)}
                    id="pronouns"
                >
                    <option value="" disabled selected>Pronouns</option>
                    <option value="she/her">she/her</option>
                    <option value="he/him">he/him</option>
                    <option value="they/them">they/them</option>
                </select>
                <p>Already a user? <a href="/">Sign In</a></p>
                <button className="w-100 btn btn-lg btn-primary btn-color" onClick={() => submit()}>Submit</button>
            </form>
        </div>
    );
};

export default Register;