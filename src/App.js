import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Main from './components/Main';
import Settings from './components/Settings';

class App extends Component {

    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={Main} />
                    {/* {/* <Route path="/about" component={About} /> */}
                    <Route path="/settings" component={Settings} />
                </div>
            </Router>
        );
    }
}

export default App;
        