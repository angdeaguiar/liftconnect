import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import { RecoilRoot } from 'recoil';

import './App.css';
import Nav from "./components/Nav";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Workouts from "./pages/Workouts";
import Create from "./pages/Create";

import { PrivateRoute } from "./PrivateRoute"


function App() {
    return (
        <RecoilRoot>
          <div className="App">
              <BrowserRouter>
                  <Nav />
                  <main>

                      <Route exact path="/" component={() => <Login />}/>
                      <Route path="/register" component={() => <Register />} />
                      <PrivateRoute path="/home" component={Home}/>
                      <PrivateRoute path="/workouts" component={() => <Workouts />} />
                      <PrivateRoute path="/create" component={() => <Create />} />
                  </main>
              </BrowserRouter>
          </div>
        </RecoilRoot>
    );
}

export default App;