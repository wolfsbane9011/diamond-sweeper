import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {Form, Header, Segment, Button, Message, Grid, Item, Icon} from "semantic-ui-react";
import util from "../utils";
import config from "../config";

class LoginPageComponent extends Component {
    constructor(props) {
        super(props);
        this.fields = ['email', 'password'];
        this.state = {
            showPassword: false,
            errorMessage: (!!this.props.location.state &&
            !!this.props.location.state.message ? this.props.location.state.message : '')
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
        if (id === 'password' && typeof val === 'string' && val.length > 7)
            return !util.passwordFormat.test(val);
    }

    onSubmit(e) {
        const allElements = [...e.target.elements];
        const currentValues = {};
        allElements.forEach(element => {
            if (element.type !== 'submit')
                currentValues[element.id] = element.value;
        });

        let errorInFields = false;
        this.fields.forEach(value => {
            if (this.validate(value, currentValues[value])) {
                errorInFields = true;
                this.setState({[value]: {value: currentValues[value], error: true}});
            }
        });
        if (!errorInFields) {
            const requestBody = {};
            this.fields.forEach(value => {
                requestBody[value] = currentValues[value];
            });
            util.makeHTTPRequest('/login', 'post', requestBody)
                .then(res => {
                    if (!res.data.error) {
                        window.sessionStorage.setItem('session', res.data.data.sessionId);
                        this.props.history.push('/main', {firstName: res.data.data.firstName});
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

    componentDidMount() {
        window.sessionStorage.clear();
    }

    render() {
        return (
            <Grid textAlign='center' className='login-form-page' verticalAlign='middle'>
                <Grid.Column className='login-form-column'>
                    <Header as='h2' color='teal' textAlign='center'>
                        <Link to='/'><Icon color='teal' name='diamond' size='large'/></Link>
                        {config.loginHeader}
                    </Header>
                    {!!this.state.errorMessage && (
                        <Segment className='form-error'>
                            {this.state.errorMessage}
                        </Segment>
                    )}
                    <Form size='large' id='login-form' onSubmit={event => this.onSubmit(event)}>
                        <Segment stacked>
                            <Form.Input
                                fluid
                                id='email'
                                placeholder={config.placeholder.email}
                                defaultValue={this.state.email.value}
                                error={this.state.email.error}
                                onBlur={event => this.onChangeField(event)}
                            />
                            {this.state.email.error && (
                                <Item as='span' className='field-error'>{config.emailFieldErrorMsg}</Item>
                            )}
                            {!this.state.showPassword && (
                                <Form.Input
                                    fluid
                                    id='password'
                                    placeholder={config.placeholder.password}
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
                                    placeholder={config.placeholder.password}
                                    icon={<Icon name='eye' link onClick={this.onPasswordStateChange}/>}
                                    defaultValue={this.state.password.value}
                                    error={this.state.password.error}
                                    onBlur={event => this.onChangeField(event)}
                                />
                            )}
                            {this.state.password.error && (
                                <Item as='span' className='field-error'>{config.passwordFieldErrorMsg}</Item>
                            )}
                            <Item as='span'
                                  className={'password-hint ' + (this.state.password.error ? 'password-error' : '')}>
                                {config.passwordHint}
                            </Item>
                            <Button
                                color='teal'
                                fluid
                                size='large'
                            >
                                {config.login}
                            </Button>
                        </Segment>
                    </Form>
                    <Message>
                        {config.signUpQuestion} <Link to='/sign-up'>{config.signUp}</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default LoginPageComponent;