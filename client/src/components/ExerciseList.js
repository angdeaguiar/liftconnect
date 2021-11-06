import React, { useEffect, useState } from 'react';
import useUserState from '../hooks/useUserState';
import axios from 'axios';

const ExerciseList = () => {
    const {user} = useUserState();

    const [selected, setSelected] = useState([]);
    const [exercises, setExercises] = useState([]);

    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('');

    const dropdownValues = [
        { id: 'abductors', value: 'Abductors'},
        { id: 'abs', value: 'Abs'},
        { id: 'adductors', value: 'Adductors'},
        { id: 'biceps', value: 'Biceps'},
        { id: 'calves', value: 'Calves'},
        { id: 'delts', value: 'Delts'},
        { id: 'forearms', value: 'Forearms'},
        { id: 'glutes', value: 'Glutes'},
        { id: 'hamstrings', value: 'Hamstrings'},
        { id: 'lats', value: 'Lats'},
        { id: 'pectorals', value: 'Pectorals'},
        { id: 'quads', value: 'Quads'},
        { id: 'traps', value: 'Traps'},
        { id: 'triceps', value: 'Triceps'},
        { id: 'upper back', value: 'Upper Back'}
    ];

    useEffect(() => {
        if (searchTerm === '') return;
        const delayDebounceFn = setTimeout(() => {
            axios.get(`http://localhost:8080/api/workouts/exercises/name/${searchTerm}`,
            { withCredentials: true }).then(res => {
                setExercises(res.data.data);
            });
        }, 1000)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm])

    useEffect(() => {
        if (filter === '') return;
        const delayDebounceFn = setTimeout(() => {
            axios.get(`http://localhost:8080/api/workouts/exercises/target/${filter}`,
            { withCredentials: true }).then(res => {
                setExercises(res.data.data);
            });
        }, 100)

        return () => clearTimeout(delayDebounceFn)
    }, [filter])

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
        }, { withCredentials: true }).then(() => {
            window.location.reload();
        });
    }

    const handleClick = (exercise) => {
        exercise.sets = [{set_number: 1, reps: 0, weight: 0}];
        setSelected([...selected, exercise]);
    }

    const addSets = (exercise) => {
        const prevValue = exercise.sets[exercise.sets.length-1];
        exercise.sets.push({set_number: exercise.sets.length + 1, reps: prevValue.reps, weight: prevValue.weight});
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

    const handleSetDelete = (exerciseIndex, setIndex) => {
        let tmp = selected;
        tmp[exerciseIndex].sets.splice(setIndex, 1);
        setSelected([...tmp]);
    }

    const handleExerciseDelete = (exerciseIndex) => {
        let tmp = selected;
        tmp.splice(exerciseIndex, 1);
        setSelected([...tmp]);
    }

    return (
        <>
            <div className="greeting">Create Workout</div>
            <div className="create-container">
                <div className="search-container">
                    <div className="filter-container">
                        <input type="text" className="search-exercises" placeholder="Search for exercises.." onChange={(e) => setSearchTerm(e.target.value)} />
                        <select
                            className="workout-dropdown"
                            name="muscle-groups"
                            id="muscle-groups-select"
                            onChange={e => setFilter(e.target.value)}
                            value={filter}
                        >
                            <option value="">Filter by muscle group...</option>
                            {dropdownValues.map(d => (
                                <option key={d.id} value={d.id}>{d.value}</option>
                            ))}
                        </select>
                    </div>
                    <div className="list-group scrollable-list">
                        {exercises && exercises.map(e => (
                            <a href="/#" onClick={() => handleClick(e)} className="list-group-item list-group-item-action" key={e.id}>
                                <div className="d-flex w-100 justify-content-between">
                                    <h3 className="mb-2">{e.name}</h3>
                                    <p className="mb-2">{e.target}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
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
                    {selected && selected.map((s, selectedIndex) => (
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
            </div>
        </>
    );
};

export default ExerciseList;