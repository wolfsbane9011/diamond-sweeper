import React, {Component} from 'react';
import {Button, Container, Grid, Icon, Item, Menu, Header, Table} from "semantic-ui-react";
import Range from "lodash/range";
import util from "../utils";
import config from "../config";

class MainPageComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: (!!this.props.location.state &&
            !!this.props.location.state.firstName ? this.props.location.state.firstName : ''),
            metadata: {},
            updateMessage: '',
            showNewGameScreen: false,
            showCompleteScreen: false
        };
    }

    onClickButton(e) {
        const index = e.target.id.split('-')[1] + '-' + e.target.id.split('-')[2];
        this.setState(state => {
            const metadata = {};
            metadata.diamonds = state.metadata.diamonds;
            metadata.squaresUncovered = state.metadata.squaresUncovered.push(index);
            metadata.currentProgress = (state.metadata.diamonds.indexOf(index) > -1 ?
                state.metadata.currentProgress.push(index) : state.metadata.currentProgress);
            return metadata;
        });
    }

    createTable() {
        const {Row, Cell} = Table;
        return (
            <React.Fragment>
                {Object.keys(this.state.metadata).length > 0 && Range(0, config.gridLength).map((current, index) => (
                    <Row key={current + "" + index}>
                        {Range(0, config.gridLength).map((curr, i) => (
                            <Cell key={i + "" + curr} className="matrix-cell">
                                {this.state.metadata.diamonds.indexOf(current + '-' + curr) > - 1 &&
                                (this.state.metadata.squaresUncovered.indexOf(current + '-' + curr) > - 1) &&
                                (<Item as="div" id={'diamond-' + current + '-' + curr} className="diamond-value"><Icon name="diamond"/></Item>)}
                                <Item as="div"
                                      className={(this.state.metadata.squaresUncovered.indexOf(current + '-' + curr) > - 1) &&
                                      (this.state.metadata.diamonds.indexOf(current + '-' + curr) === -1) ? "diamond-question" : ''}>
                                {this.state.metadata.squaresUncovered.indexOf(current + '-' + curr) === - 1 && (
                                    <Button icon={<Icon name='question' />}
                                            id={'button-' + current + '-' + curr}
                                            fluid
                                            onClick={event => this.onClickButton(event)}
                                    />
                                )}
                                </Item>
                            </Cell>
                        ))}
                    </Row>
                ))}
            </React.Fragment>
        );
    }

    updateProgress() {
        const progress = {
            status: (this.state.metadata.currentProgress.length === config.gridLength ? 'Complete' : this.state.metadata.status),
            currentProgress: util.encryptTarget(this.state.metadata.currentProgress.map(index => util.generateActualNumbers(index)).join('|')),
            squaresUncovered: util.encryptTarget(this.state.metadata.squaresUncovered.map(index => util.generateActualNumbers(index)).join('|'))
        };
        util.makeHTTPRequest('/update-progress', 'post',
            {sessionId: window.sessionStorage.getItem('session'), progress})
            .then(res => {
                if (!res.data.error) {
                    const element = document.getElementById('update-message');
                    element.classList.remove('hide-opacity');
                    setTimeout(() => element.classList.add('hide-opacity'), 3000);
                    this.setState({updateMessage: res.data.message});
                }
                else
                    this.props.history.push('/login', res.data.message);
            })
            .catch(err => {
                console.log("err = ", err);
            });
    }

    getProgress() {
        util.makeHTTPRequest('/get-progress?sessionId=' + encodeURIComponent(window.sessionStorage.getItem('session')), 'get')
            .then(res => {
                if (!res.data.error) {
                    const metadata = {};
                    metadata.status = res.data.data.status;
                    metadata.diamonds = util.generateIndexNumbers(util.decryptTarget(res.data.data.target).split('|'));
                    metadata.squaresUncovered = util.generateIndexNumbers(!!res.data.data.squaresUncovered ? util.decryptTarget(res.data.data.squaresUncovered).split('|') : []);
                    metadata.currentProgress = util.generateIndexNumbers(!!res.data.data.currentProgress ? util.decryptTarget(res.data.data.currentProgress).split('|') : []);

                    this.setState({metadata: metadata});
                }
            })
            .catch(err => {
                console.log("err = ", err);
            });
    }

    logout() {
        util.makeHTTPRequest('/logout', 'post',{sessionId: window.sessionStorage.getItem('session')})
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
            util.makeHTTPRequest('/check-session?sessionId=' + encodeURIComponent(window.sessionStorage.getItem('session')), 'get')
                .then(res => {
                    if (!res.data.error)
                        this.getProgress();
                    else
                        this.props.history.push('/login', {message: config.sessionLogout});
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
                        <Menu pointing secondary className='menu-bar' fixed="top" size='large'>
                            <Container>
                                <Menu.Item position='left'>
                                    <Header className='white'>
                                        Welcome {this.state.firstName}
                                    </Header>
                                </Menu.Item>
                                <Menu.Item id='update-message' className='successfully-saved hide-opacity'>
                                    {this.state.updateMessage}
                                </Menu.Item>
                                <Menu.Item position='right'>
                                    <Button inverted primary onClick={event => this.updateProgress(event)}>
                                        {config.updateProgress}
                                    </Button>
                                    <Button inverted primary className='ml-1' onClick={event => this.logout(event)}>
                                        {config.logout}
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

export default MainPageComponent;