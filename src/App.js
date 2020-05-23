import React, {Component} from 'react';
import {Item} from "semantic-ui-react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import HomePageComponent from "./components/homePageComponent";
import LoginPageComponent from "./components/loginPageComponent";
import SignUpPageComponent from "./components/signUpPageComponent";
import MainPageComponent from "./components/mainPageComponent";

class App extends Component {
    render() {
        return (
            <Router>
                <Item as="div" className="App">
                    <Switch>
                        <Route exact path='/' component={HomePageComponent}/>
                        <Route exact path='/login' component={LoginPageComponent}/>
                        <Route exact path='/sign-up' component={SignUpPageComponent}/>
                        <Route exact path='/main' component={MainPageComponent}/>
                    </Switch>
                </Item>
            </Router>
        );
    }
}

export default App;
