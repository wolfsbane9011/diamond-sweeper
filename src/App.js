import React, {Component} from 'react';
import {Item} from "semantic-ui-react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import SignUpPage from "./pages/signUpPage";
import MainPage from "./pages/mainPage";

class App extends Component {
    render() {
        return (
            <Router>
                <Item as="div" className="App">
                    <Switch>
                        {/*<Route exact path='/' component={HomePage}/>*/}
                        <Route exact path='/login' component={LoginPage}/>
                        <Route exact path='/sign-up' component={SignUpPage}/>
                        {/*<Route exact path='/main' component={MainPage}/>*/}
                        <Route exact path='/' component={MainPage}/>
                    </Switch>
                </Item>
            </Router>
        );
    }
}

export default App;
