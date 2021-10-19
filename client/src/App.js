import React, {useEffect, useState} from 'react';
import { RecoilRoot } from 'recoil';
import './App.css';
import Login from "./pages/Login";
import Nav from "./components/Nav";
import {BrowserRouter, Route} from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Workouts from "./pages/Workouts";

function App() {
//   const [name, setName] = useState('');

  return (
      <RecoilRoot>
        <div className="App">
            <BrowserRouter>
                <Nav/>
                <main className="form-signin">
                    <Route path="/" exact component={() => <Home />}/>
                    <Route path="/login" component={() => <Login />}/>
                    <Route path="/register" component={Register} />
                    <Route path="/workouts" component={() => <Workouts />} />
                </main>
            </BrowserRouter>
        </div>
      </RecoilRoot>
  );
}

export default App;