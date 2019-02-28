import React, { Component } from 'react';
import '../App.css';
import Helpers from '../utils/Helpers';

interface IndexState {
    use24HourTime?: boolean
  }

class Settings extends Component<{}, IndexState> {

    constructor(props: any) {
        super(props);

        this.state={
            use24HourTime: Helpers.getLocalStorageBoolean("use24HourTime")

        }

    }

    
    updateSettings = (event:any) => {
        console.log(event)
        let val = event.target.checked;
        console.log(val);
        localStorage.setItem("use24HourTime", val);
        this.setState({use24HourTime: val});
    }

    render() {
        return (
            <div className="App">
                <a className="navbutton" href="/"><i className="fas fa-home"></i></a>
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