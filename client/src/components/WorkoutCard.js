// External Imports
import React, {useEffect, useState} from 'react';
import useUserState from '../hooks/useUserState';
import axios from 'axios';

const OPTIONS = { month: "long", day: "numeric", year: 'numeric'};

const WorkoutCard = () => {
    const {user} = useUserState();

    const [workouts, setWorkouts] = useState([]);
    const [shown, setShown] = useState([]);

    useEffect(() => {
        if (!user.id) return;
        axios.get(`http://localhost:8080/api/workouts/${user.id}`,
        { withCredentials: true }).then(res => {
            setWorkouts(res.data.data);

            res.data.data.forEach(workout => {
                shown.push({id: workout.id, active: false});
                setShown([...shown]);
            });
        });
    // eslint-disable-next-line
    }, [user.id]);

    const setDate = (date) => {
        return new Date(date).toLocaleString("en", OPTIONS);
    };

    const handleClick = (index) => {
        let tmp = shown;
        tmp[index].active = !tmp[index].active;
        setShown([...shown]);
    };

    return (
        <div className="grid-container">
                {workouts.map((workout, i) => (
                        <div className="card workout-card">
                            <h3>{workout.title} - {setDate(workout.created_at)}</h3>
                            <p>{workout.notes}</p>
                            <h6>{workout.workout_exercises.length} Exercises</h6>
                            <div className="fake-link" onClick={() => handleClick(i)}>See Exercises</div>
                            {(shown[i] && shown[i].active) && workout.workout_exercises.map(exercises => (
                                <div className="exercise">
                                    <img alt="Exercise Gif" src={exercises.gif_url} height="100px" width="100px" />
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
                ))}
        </div>
    );
};

export default WorkoutCard;