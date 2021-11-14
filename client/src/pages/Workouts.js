// External Imports
import React from 'react';

// Internal Imports
import WorkoutCard from '../components/WorkoutCard'

const Workouts = () => {
    return (
        <>
        <div className="greeting">Saved Workouts</div>
            <div className="workout-container">
                <WorkoutCard />
            </div>
        </>
    );
};

export default Workouts;