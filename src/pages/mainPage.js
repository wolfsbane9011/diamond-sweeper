import React, {Component} from 'react';
import {Button, Container, Grid, Icon, Item, Menu, Header, Table} from "semantic-ui-react";
import Range from "lodash/range";
import util from "../utils";

class MainPage extends Component {
    arrows = {
        up: "arrow up",
        down: "arrow down",
        left: "arrow left",
        right: "arrow right"
    };

    constructor(props) {
        super(props);
        this.state = {
            firstName: this.props.location.state.firstName,
            gameProgress: {}
        };
    }

    onClickButton() {
    }

    createTable() {
        const {Row, Cell} = Table;
        return (
            <React.Fragment>
                {Range(0, util.gridLength).map((current, index) => (
                    <Row key={current + "" + index}>
                        {Range(0, util.gridLength).map((current, index) => (
                            <Cell key={index + "" + current} className="matrix-cell">
                                <Item as="div" className="diamond-value"><Icon name="diamond"/></Item>
                                <Item as="div" className="diamond-question">
                                    <Button icon="question" key={"Button " + index + "" + current} fluid/>
                                </Item>
                            </Cell>
                        ))}
                    </Row>
                ))}
            </React.Fragment>
        );
    }

    updateProgress() {

    }

    logout() {
        util.makeHTTPRequest('/logout', 'post', {sessionId: window.sessionStorage.getItem('session')})
            .then(res => {
                window.sessionStorage.clear();
                this.props.history.push('/login');
            })
            .catch(err => {
                console.log("err = ", err);
            });
    }

    componentDidMount() {
        if (!!window.sessionStorage.getItem('session')) {
            util.makeHTTPRequest('/check-session?sessionId=' + window.sessionStorage.getItem('session'), 'get')
                .then(res => {
                    if (!res.data.error) {
                        util.makeHTTPRequest('/get-progress?sessionId=' + window.sessionStorage.getItem('session'), 'get')
                            .then(res => {
                                if (!res.data.error) {
                                    this.setState({
                                        gameProgress: {
                                            status: res.data.progress.status,
                                            currentProgress: util.decryptTarget(res.data.progress.currentProgress).split('|'),
                                            target: util.decryptTarget(res.data.progress.target).split('|'),
                                            squaresUncovered: util.decryptTarget(res.data.progress.squaresUncovered).split('|'),
                                        }
                                    });
                                }
                            })
                            .catch(err => {
                                console.log("err = ", err);
                            });
                    }
                    else
                        this.props.history.push('/');
                })
                .catch(err => {
                    console.log("err = ", err);
                });
        }
        else
            this.props.history.push('/');
    }

    render() {
        return (
            <Grid textAlign='center' className='main-page' verticalAlign='middle'>
                <Grid.Row>
                    <Grid.Column className='main-nav-bar'>
                        <Menu pointing secondary size='large'>
                            <Container>
                                <Menu.Item position='left'>
                                    <Header className='white'>
                                        Welcome {this.state.firstName}
                                    </Header>
                                </Menu.Item>
                                <Menu.Item position='right'>
                                    <Button inverted primary onClick={event => this.updateProgress(event)}>
                                        {util.updateProgress}
                                    </Button>
                                    <Button inverted primary className='ml-1' onClick={event => this.logout(event)}>
                                        {util.logout}
                                    </Button>
                                </Menu.Item>
                            </Container>
                        </Menu>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column className='main-column'>
                        <Table celled className="diamond-table">
                            <Table.Body>
                                {this.createTable()}
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default MainPage;