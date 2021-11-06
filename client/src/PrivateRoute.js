import React, { useEffect, useState } from 'react'
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';

import useUserState from './hooks/useUserState';

function PrivateRoute({ component: Component, ...rest }) {
    const {user, updateProperties} = useUserState();

    const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8080/self', { withCredentials: true }).then(res => {
            updateProperties({
                id: res.data.data.id,
                fname: res.data.data.first_name,
                lname: res.data.data.last_name,
                prs: res.data.data.personal_records,
            });
            setLoading(true);
        });
    // eslint-disable-next-line
    }, [user.id]);

    return (
        <>
            {loading && (
                <Route {...rest} render={props => {
                    if (!user.id) {
                        return <Redirect to={{ pathname: '/', state: { from: props.location } }} />
                    }

                    return <Component {...props} />
                }} />
            )}
        </>
    );
}

export { PrivateRoute };