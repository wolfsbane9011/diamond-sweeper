import React, {Component} from 'react';
import {Item} from "semantic-ui-react";
import {Route} from "react-router-dom";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import SignUpPage from "./pages/signUpPage";

class App extends Component {
    render() {
        return (
            <Item as="div" className="App">
                <Route exact path='/'><HomePage/></Route>
                <Route exact path='/login'><LoginPage/></Route>
                <Route exact path='/sign-up'><SignUpPage/></Route>

            </Item>
        );
    }
}

export default App;
