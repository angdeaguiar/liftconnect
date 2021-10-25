import React, { useEffect, useState } from 'react';
import useUserState from '../hooks/useUserState';
import axios from 'axios';

const ExerciseList = () => {
    const {user} = useUserState();

    const [selected, setSelected] = useState([]);
    const [exercises, setExercises] = useState([]);

    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        if (searchTerm === '') return;
        const delayDebounceFn = setTimeout(() => {
            axios.get(`http://localhost:8080/api/workouts/exercises/name/${searchTerm}`,
            { withCredentials: true }).then(res => {
                setExercises(res.data.data);
            });
        }, 1500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm])

    useEffect(() => {
        axios.get(`http://localhost:8080/api/workouts/exercises`,
        { withCredentials: true }).then(res => {
            setExercises(res.data.data);
        });
    }, []);

    const createWorkout = () => {
        const workoutExercises = selected.map(s => ({
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
        }, { withCredentials: true }).then(res => {
            setExercises(res.data.data);
        });
    }

    const handleClick = (exercise) => {
        exercise.sets = [{set_number: 1, reps: 0, weight: 0}];
        setSelected([...selected, exercise]);
    }

    const addSets = (exercise) => {
        exercise.sets.push({set_number: exercise.sets.length + 1, reps: 0, weight: 0});
        setSelected([...selected])
    }

    const updateReps = (value, key) => {
        key.reps = value;
        setSelected([...selected])
    }

    const updateWeight = (value, key) => {
        key.weight = value;
        setSelected([...selected])
    }

    return (
        <div className="create-container">
            <div className="search-container">
                <input type="text" className="search-exercises" placeholder="Search for exercises.." onChange={(e) => setSearchTerm(e.target.value)} />
                <div className="list-group scrollable-list">
                    {exercises && exercises.map(e => (
                        <a onClick={() => handleClick(e)} className="list-group-item list-group-item-action">
                            <div className="d-flex w-100 justify-content-between">
                                <h3 className="mb-2">{e.name}</h3>
                                <p className="mb-2">{e.target}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
            <div className="exercises-container">
                <input type="text" className="search-exercises" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                <textarea
                    id="post-text-area"
                    className="textarea"
                    placeholder="Add notes..."
                    rows="4"
                    onChange={e => setNotes(e.target.value)}
                    value={notes}
                >
                </textarea>
                {selected && selected.map(s => (
                    <div className="exercise">
                        <img src={s.gifUrl} height="100px" width="100px" />
                        <p>{s.name}</p>
                        <div>
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
                                    {s.sets.map(set => (
                                        <tr>
                                            <td>{set.set_number}</td>
                                            <td><input type="number" value={set.reps} onChange={(e) => updateReps(e.target.valueAsNumber, set)} /></td>
                                            <td><input type="number" value={set.weight} onChange={(e) => updateWeight(e.target.valueAsNumber, set)} /></td>
                                            <td><button>Remove</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                                <button onClick={() => addSets(s)}>Add Set</button>
                            </table>
                        </div>
                    </div>
                ))}
                <button onClick={() => createWorkout()}>Save</button>
            </div>
        </div>
    );
};

export default ExerciseList;