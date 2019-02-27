import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Main from './components/Main';

class App extends Component {

    render() {
        return (
            <Router>
                <Route exact path="/" component={Main} />
                {/* <Route path="/about" component={About} />
                <Route path="/topics" component={Topics} /> */}
            </Router>
        );
    }
}

export default App;
        