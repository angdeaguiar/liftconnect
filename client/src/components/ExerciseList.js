// External Imports
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Internal Imports
import ExerciseCreator from './ExerciseCreator';

const ExerciseList = () => {
    const [selected, setSelected] = useState([]);
    const [exercises, setExercises] = useState([]);

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

    const handleClick = (exercise) => {
        exercise.sets = [{set_number: 1, reps: 0, weight: 0}];
        setSelected([...selected, exercise]);
    }

    return (
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
                        <div onClick={() => handleClick(e)} className="list-group-item list-group-item-action" key={e.id}>
                            <div className="d-flex w-100 justify-content-between">
                                <h3 className="mb-2">{e.name}</h3>
                                <p className="mb-2">{e.target}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ExerciseCreator selected={selected} setSelected={setSelected} />
        </div>
    );
};

export default ExerciseList;