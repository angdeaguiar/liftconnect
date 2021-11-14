// External Imports
import React, { useState } from 'react';
import useUserState from '../hooks/useUserState';
import axios from 'axios';

const ExerciseCreator = (props) => {
    const {user} = useUserState();

    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');

    const createWorkout = () => {
        const workoutExercises = props.selected.map(s => ({
            api_id: s.id,
            gif_url: s.gifUrl,
            name: s.name,
            workout_sets: s.sets,
        }));

        axios.post(`http://localhost:8080/api/workouts`, {
            user_id: user.id,
            title,
            notes,
            workout_exercises: workoutExercises
        }, { withCredentials: true }).then(() => {
            window.location.reload();
        });
    };

    const addSets = (exercise) => {
        const prevValue = exercise.sets[exercise.sets.length-1];
        exercise.sets.push({set_number: exercise.sets.length + 1, reps: prevValue.reps, weight: prevValue.weight});
        props.setSelected([...props.selected])
    };

    const updateReps = (value, key) => {
        key.reps = value;
        props.setSelected([...props.selected])
    };

    const updateWeight = (value, key) => {
        key.weight = value;
        props.setSelected([...props.selected])
    };

    const handleSetDelete = (exerciseIndex, setIndex) => {
        let tmp = props.selected;
        tmp[exerciseIndex].sets.splice(setIndex, 1);
        props.setSelected([...tmp]);
    };

    const handleExerciseDelete = (exerciseIndex) => {
        let tmp = props.selected;
        tmp.splice(exerciseIndex, 1);
        props.setSelected([...tmp]);
    };

    return (
        <div className="exercises-container">
            <input type="text" className="ps-input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea
                id="post-text-area"
                className="textarea"
                placeholder="Add notes..."
                rows="4"
                onChange={e => setNotes(e.target.value)}
                value={notes}
            >
            </textarea>
            {props.selected && props.selected.map((s, selectedIndex) => (
                <div className="exercise">
                    <div className="ex-title">
                        <p>{s.name}</p>
                        <img alt="Exercise Gif" src={s.gifUrl} height="100px" width="100px" />
                    </div>
                    <div className="sets">
                        <table>
                            <thead>
                                <tr>
                                    <th>Set</th>
                                    <th>Repetitions</th>
                                    <th>Weight (lbs)</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {s.sets.map((set, setIndex) => (
                                    <tr>
                                        <td>{set.set_number}</td>
                                        <td><input type="number" value={set.reps} onChange={(e) => updateReps(e.target.valueAsNumber, set)} /></td>
                                        <td><input type="number" value={set.weight} onChange={(e) => updateWeight(e.target.valueAsNumber, set)} /></td>
                                        <td>
                                            {setIndex > 0 && setIndex === s.sets.length-1 && (
                                                <button
                                                    onClick={() => handleSetDelete(selectedIndex, setIndex)}
                                                    className="no-style-btn"
                                                >
                                                    <i className="fa fa-times" aria-hidden="true"></i>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <button onClick={() => addSets(s)}>Add Set</button>
                        </table>
                    </div>
                    <button
                        onClick={() => handleExerciseDelete(selectedIndex)}
                        className="no-style-btn"
                    >
                        <i className="fa fa-times icon-red" aria-hidden="true"></i>
                    </button>
                </div>
            ))}
            <button className="cmt-btn" onClick={() => createWorkout()}>Save</button>
        </div>
    );
};

export default ExerciseCreator;