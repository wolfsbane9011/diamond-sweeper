import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {Form, Header, Segment, Button, Message, Grid, Item, Icon} from "semantic-ui-react";
import util from "../utils";

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.fields = ['email', 'password'];
        this.state = {
            showPassword: false,
            errorMessage: ''
        };
        this.fields.forEach(val => {
            this.state[val] = {
                value: '',
                error: false
            };
        });
    }

    validate(id, val) {
        if (id === 'email')
            return !util.emailFormat.test(val);
        if (id === 'password')
            return !util.passwordFormat.test(val);
    }

    onSubmit(e) {
        let errorInFields = false;
        this.fields.forEach(value => {
            if (this.validate(value, this.state[value].value)) {
                errorInFields = true;
                this.setState({[value]: {value: this.state[value].value, error: true}});
            }
        });
        if (!errorInFields) {
            const requestBody = {};
            this.fields.forEach(value => {
                requestBody[value] = this.state[value].value;
            });
            util.makeHTTPRequest('/login', 'post', requestBody)
                .then(res => {
                    if (!res.data.error) {
                        window.sessionStorage.setItem('session', res.data.sessionId);
                        this.history.pushState(null, '/main-page');
                    }
                    else
                        this.setState({errorMessage: res.data.message});
                })
                .catch(err => {
                    console.log("err = ", err);
                });
        }
    }

    onChangeField = (e) =>
        this.setState({[e.target.id]: {value: e.target.value, error: this.validate(e.target.id, e.target.value)}});

    onPasswordStateChange = (e) =>
        this.setState(state => ({showPassword: !state.showPassword}));

    render() {
        return (
            <Grid textAlign='center' className='login-form-page' verticalAlign='middle'>
                <Grid.Column className='login-form-column'>
                    <Header as='h2' color='teal' textAlign='center'>
                        <Link to='/'><Icon color='teal' name='diamond' size='large'/></Link>
                        {util.loginHeader}
                    </Header>
                    {!!this.state.errorMessage && (
                        <Segment className='form-error'>
                            {this.state.errorMessage}
                        </Segment>
                    )}
                    <Form size='large'>
                        <Segment stacked>
                            <Form.Input
                                fluid
                                id='email'
                                placeholder='E-mail address'
                                defaultValue={this.state.email.value}
                                error={this.state.email.error}
                                onBlur={event => this.onChangeField(event)}
                            />
                            {this.state.email.error && (
                                <Item as='span' className='field-error'>{util.emailFieldErrorMsg}</Item>
                            )}
                            {!this.state.showPassword && (
                                <Form.Input
                                    fluid
                                    id='password'
                                    placeholder='Password'
                                    type='password'
                                    icon={<Icon name='eye slash' link onClick={this.onPasswordStateChange}/>}
                                    defaultValue={this.state.password.value}
                                    error={this.state.password.error}
                                    onBlur={event => this.onChangeField(event)}
                                />
                            )}
                            {this.state.showPassword && (
                                <Form.Input
                                    fluid
                                    id='password'
                                    placeholder='Password'
                                    icon={<Icon name='eye' link onClick={this.onPasswordStateChange}/>}
                                    defaultValue={this.state.password.value}
                                    error={this.state.password.error}
                                    onBlur={event => this.onChangeField(event)}
                                />
                            )}
                            {this.state.password.error && (
                                <Item as='span' className='field-error'>{util.passwordFieldErrorMsg}</Item>
                            )}
                            <Item as='span'
                                  className={'password-hint ' + (this.state.password.error ? 'password-error' : '')}>
                                {util.passwordHint}
                            </Item>
                            <Button
                                color='teal'
                                fluid
                                size='large'
                                onClick={event => this.onSubmit(event)}
                            >
                                {util.login}
                            </Button>
                        </Segment>
                    </Form>
                    <Message>
                        {util.signUpQuestion} <Link to='/sign-up'>{util.signUp}</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default LoginPage;