
import React from 'react';
import useUserState from '../hooks/useUserState';
import axios from 'axios';

const PersonalRecords = () => {
    const {user, updateProperty} = useUserState();

    const updateRecords = () => {
        axios.post('http://localhost:8080/api/users/personalrecords', {
            id: user.prs.id,
            user_id: user.id,
            squat: user.prs.squat,
            deadlift: user.prs.deadlift,
            bench: user.prs.bench
        }, { withCredentials: true }).then(() => {
            window.location.reload();
        }).catch((err) => console.log(err));
    };

    const handleSquat = (value) => {
        updateProperty("prs", {squat: parseInt(value), deadlift: user.prs.deadlift, bench: user.prs.bench});
    }

    const handleDeadlift = (value) => {
        updateProperty("prs", {squat: user.prs.squat, deadlift: parseInt(value), bench: user.prs.bench});
    }

    const handleBench = (value) => {
        updateProperty("prs", {squat: user.prs.squat, deadlift: user.prs.deadlift, bench: parseInt(value)});
    }

    return (
        <>
            <h3>Personal Records</h3>
            <div className="input-prs">
                <label for="squat">Squat</label>
                <input
                    type="number"
                    id="squat"
                    value={user.prs.squat}
                    onChange={e => handleSquat(e.target.value)}
                />
            </div>
            <div className="input-prs">
                <label for="deadlift">Deadlift</label>
                <input
                    type="number"
                    id="deadlift"
                    value={user.prs.deadlift}
                    onChange={e => handleDeadlift(e.target.value)}
                />
            </div>
            <div className="input-prs">
                <label for="bench">Bench</label>
                <input
                    type="number"
                    id="bench"
                    value={user.prs.bench}
                    onChange={e => handleBench(e.target.value)}
                />
            </div>
            <button onClick={updateRecords}>Update</button>
        </>
    );
};

export default PersonalRecords;