import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {Button, Form, Grid, Header, Message, Segment, Dropdown, Icon, Item} from "semantic-ui-react";
import util from "../utils";

class SignUpPage extends Component {
    constructor(props) {
        super(props);
        this.fields = ['firstName', 'lastName', 'country', 'email', 'password'];
        this.state = {
            countries: [],
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
        if (id === 'firstName' || id === 'lastName' || id === 'country')
            return !val.trim().length > 0;
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
            util.makeHTTPRequest('/sign-up', 'post', requestBody)
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

    componentDidMount() {
        if (this.state.countries.length === 0) {
            util.makeHTTPRequest('/countries', 'get')
                .then(res => this.setState({
                    countries: res.data.map(country => ({
                        key: country,
                        text: country,
                        value: country
                    }))
                }))
                .catch(err => {
                    console.log("err = ", err);
                })
        }
    }

    render() {
        return (
            <Grid textAlign='center' className='sign-up-form-page' verticalAlign='middle'>
                <Grid.Column className='sign-up-form-column'>
                    <Header as='h2' color='teal' textAlign='center'>
                        <Link to='/'><Icon color='teal' name='diamond' size='large'/></Link>
                        {util.signUpHeader}
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
                                id='firstName'
                                placeholder='First Name'
                                defaultValue={this.state.firstName.value}
                                error={this.state.firstName.error}
                                onBlur={event => this.onChangeField(event)}
                            />
                            {this.state.firstName.error && (
                                <Item as='span' className='field-error'>{util.requiredFieldErrorMsg}</Item>
                            )}
                            <Form.Input
                                fluid
                                id='lastName'
                                placeholder='Last Name'
                                defaultValue={this.state.lastName.value}
                                error={this.state.lastName.error}
                                onBlur={event => this.onChangeField(event)}
                            />
                            {this.state.lastName.error && (
                                <Item as='span' className='field-error'>{util.requiredFieldErrorMsg}</Item>
                            )}
                            <Dropdown
                                fluid
                                id='country'
                                placeholder='Country'
                                search
                                selection
                                options={this.state.countries}
                                error={this.state.country.error}
                                className={'form-dropdown ' + (this.state.country.error ? 'form-dropdown-error' : '')}
                                onChange={(event, data) => this.onChangeField({target: data})}
                            />
                            {this.state.country.error && (
                                <Item as='span' className='field-error'>{util.requiredFieldErrorMsg}</Item>
                            )}
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
                                {util.signUp}
                            </Button>
                        </Segment>
                    </Form>
                    <Message>
                        {util.loginQuestion} <Link to='/login'>{util.login}</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default SignUpPage;