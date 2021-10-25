import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import { RecoilRoot } from 'recoil';

import './App.css';

import Nav from "./components/Nav";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Workouts from "./pages/Workouts";
import Create from "./pages/Create";

function App() {
  return (
      <RecoilRoot>
        <div className="App">
            <BrowserRouter>
                <Nav/>
                <main>
                    <Route path="/" exact component={() => <Home />}/>
                    <Route path="/login" component={() => <Login />}/>
                    <Route path="/register" component={Register} />
                    <Route path="/workouts" component={() => <Workouts />} />
                    <Route path="/create" component={() => <Create />} />
                </main>
            </BrowserRouter>
        </div>
      </RecoilRoot>
  );
}

export default App;