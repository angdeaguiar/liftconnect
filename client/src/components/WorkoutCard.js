
import React, {useEffect, useState} from 'react';
import useUserState from '../hooks/useUserState';
import axios from 'axios';

const WorkoutCard = () => {
    const {user} = useUserState();

    const [workouts, setWorkouts] = useState([]);
    const [expand, setExpand] = useState(false);

    useEffect(() => {
        if (!user.id) return;
        axios.get(`http://localhost:8080/api/workouts/${user.id}`,
        { withCredentials: true }).then(res => {
            setWorkouts(res.data.data);
        });
    }, []);

    return (
        <div className="container">
            <div className="row">
                {workouts.map(workout => (
                    <div className="col-lg">
                        <div className="card card-default">
                            <h3>{workout.title}</h3>
                            <h6>{workout.notes}</h6>
                            <p>{workout.workout_exercises.length} Exercises</p>
                            <button onClick={() => setExpand(!expand)}>See Exercises</button>
                            {expand && workout.workout_exercises.map(exercises => (
                                <div className="exercise">
                                    <img src={exercises.gif_url} height="100px" width="100px" />
                                    <h6>{exercises.name}</h6>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Set</th>
                                                <th>Repetitions</th>
                                                <th>Weight (lbs)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {exercises.workout_sets.map(set => (
                                                <tr>
                                                    <td>{set.set_number}</td>
                                                    <td>{set.reps}</td>
                                                    <td>{set.weight}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                 </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkoutCard;