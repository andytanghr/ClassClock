import React, { Component } from 'react';
import '../App.css';

class Settings extends Component {

    constructor() {
        super();

        this.state={
            use24HourTime: this.getLocalStorageBoolean("use24HourTime")

        }

    }

    
    updateSettings = (event) => {
        console.log(event)
        let val = event.target.checked;
        console.log(val);
        localStorage.setItem("use24HourTime", val);
        this.setState({use24HourTime: val});
    }

  
    /**
     *  Gets a boolean value from HTML5 localStorage
     *
     * @param {*} key the key which the value is stored under
     * @param {boolean} [unsetDefault=false] the value to return if there was no item at that key. Default: false
     * @returns the value stored at the key or the value of unsetDefault if there was no value previously stored
     */
    getLocalStorageBoolean = (key, unsetDefault=false) => {
        if (localStorage.getItem(key) === null) {
            //key is not set
            return unsetDefault
        } else {
            //this is a better way to to convert the string from localStorage into a boolean for checkbox.checked. https://stackoverflow.com/a/264037
            return (localStorage.getItem(key) === "true")
        }
    }

    render() {
        return (
            <div className="App">
                <a className="navbutton" href="index.html"><i className="fas fa-home"></i></a>
                <br />
                <section id="options" className="centered topSpace">

                    <label>Use 24-hour Time? 
                        <input type="checkbox" checked={this.state.use24HourTime} id="use24HourTime" onChange={this.updateSettings} />
                    </label>

                    <em>Settings are automatically saved</em>
                </section>


                <section id="credits" className="centered topSpace">

                    <a className=" topSpace bottomSpace" href="https://github.com/MoralCode/ClassClock">View on GitHub</a>
                    <a className=" topSpace" href="https://join.slack.com/t/classclock/shared_invite/enQtNTE0MDkyNzAwNzU3LWNhMGUwODU2ZjhkYTYxMTgzNDE1OWEyMGY2OGNiNTBhOWM5NDVhZGUzNDVlNzRiZTE3NTNmODFjYWNkNDhmMDU">Come chat on Slack!</a><br />
                    <p id="credits" className="">
                        Idea by: <a href="https://twitter.com/MrKumprey">Dan Kumprey</a>
                        <br />Created by: <a href="https://www.adriancedwards.com">Adrian Edwards</a> and
                        <a href="https://nbdeg.com/">Nick DeGroot</a>
                        <br /><a href="https://github.com/MoralCode/ClassClock/graphs/contributors">Contributors</a>
                    </p>
                </section>
            </div>
        );
    }
}

export default Settings;