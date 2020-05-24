import React, {Component} from 'react';
import {Button, Container, Grid, Icon, Item, Menu, Header, Table} from "semantic-ui-react";
import NewGameComponent from "./newGameComponent";
import GameOverComponent from "./gameoverComponent";
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
            direction: {
                enabled: false,
                icon: "",
                index: ""
            },
            showNewGameScreen: false,
            showGameOverScreen: false,
            showGameScreen: false,
            finalScore: 0
        };
    }

    createTable() {
        const {Row, Cell} = Table;
        return (
            <React.Fragment>
                {Object.keys(this.state.metadata).length > 0 && [...Array(config.gridLength).keys()].map((current, index) => (
                    <Row key={current + "" + index}>
                        {[...Array(config.gridLength).keys()].map((curr, i) => (
                            <Cell key={i + "" + curr} className="matrix-cell">
                                {this.state.metadata.diamonds.indexOf(current + '-' + curr) > - 1 &&
                                (this.state.metadata.squaresUncovered.indexOf(current + '-' + curr) > - 1) &&
                                (<Item as="div" id={'diamond-' + current + '-' + curr} className="diamond-value"><Icon name="diamond"/></Item>)}
                                {this.state.direction.enabled && ((current + '-' + curr) === this.state.direction.index) && (
                                    (<Item as="div" id={'arrow-' + current + '-' + curr} className="arrow-value"><Icon name={this.state.direction.icon}/></Item>)
                                )}
                                <Item as="div"
                                      className={(this.state.metadata.squaresUncovered.indexOf(current + '-' + curr) > - 1) &&
                                      (this.state.metadata.diamonds.indexOf(current + '-' + curr) === -1) &&
                                         !this.state.direction.enabled ? "diamond-question" : ''}>
                                    {this.state.metadata.squaresUncovered.indexOf(current + '-' + curr) === -1 && (
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
        util.makeHTTPRequest('/update-progress', 'put',
            {sessionId: window.sessionStorage.getItem('session'), progress})
            .then(res => {
                if (!res.data.error) {
                    const element = document.getElementById('update-message');
                    element.classList.remove('hide-opacity');
                    setTimeout(() => element.classList.add('hide-opacity'), 3000);
                    this.setState({updateMessage: res.data.message});
                }
                else
                    this.props.history.push('/login', {message: config.sessionLogout});
            })
            .catch(err => {
                console.log("err = ", err);
            });
    }

    onClickButton(e) {
        const index = e.target.id.split('-')[1] + '-' + e.target.id.split('-')[2];
        const metadata = JSON.parse(JSON.stringify(this.state.metadata));
        const direction = JSON.parse(JSON.stringify(this.state.direction));
        metadata.squaresUncovered[metadata.squaresUncovered.length] = index;

        if (metadata.diamonds.indexOf(index) > -1) {
            metadata.currentProgress[metadata.currentProgress.length] = index;
            direction.enabled = false;
            direction.icon = "";
            direction.index = "";
        }
        else if (metadata.currentProgress.length !== config.gridLength) {
            direction.enabled = true;
            direction.index = index;
            const arrows = {
                up: "arrow up",
                down: "arrow down",
                left: "arrow left",
                right: "arrow right"
            };
            let actualNumbers = metadata.diamonds.map(index => util.generateActualNumbers(index));
            const currentNumber = util.generateActualNumbers(index);
            let closestNumber = util.getClosestNumber(actualNumbers, currentNumber);
            let closestIndex = util.generateIndexNumbers([closestNumber])[0].split('-');

            let flag = true;
            while (flag) {
               if (metadata.currentProgress.indexOf(closestIndex) > -1) {
                   actualNumbers.splice(actualNumbers.indexOf(closestNumber), 1);
                   closestNumber = util.getClosestNumber(actualNumbers, currentNumber);
                   closestIndex = util.generateIndexNumbers([closestNumber])[0].split('-');
               }
               else {
                   flag = false;
                   const currentIndex = index.split('-');
                   if (+currentIndex[0] > +closestIndex[0]) {
                       if (+currentIndex[1] > +closestIndex[1])
                           direction.icon = arrows.left;
                       else if (+currentIndex[1] < +closestIndex[1])
                           direction.icon = arrows.right;
                       else
                           direction.icon = arrows.top;
                   }
                   else if (+currentIndex[0] < +closestIndex[0]) {
                       if (+currentIndex[1] > +closestIndex[1])
                           direction.icon = arrows.left;
                       else if (+currentIndex[1] < +closestIndex[1])
                           direction.icon = arrows.right;
                       else
                           direction.icon = arrows.down;
                   }
                   else {
                       if (+currentIndex[1] > +closestIndex[1])
                           direction.icon = arrows.left;
                       else
                           direction.icon = arrows.right;
                   }
               }
            }
        }

        this.setState({metadata, direction,
            ...{finalScore: (metadata.currentProgress.length === config.gridLength ?
                    (Math.pow(config.gridLength, 2) - metadata.squaresUncovered.length): 0),
                    showGameOverScreen: (metadata.currentProgress.length === config.gridLength),
                    showGameScreen: (metadata.currentProgress.length !== config.gridLength)}
        });

        if (metadata.currentProgress.length === config.gridLength)
            this.updateProgress();
    }

    generateMetadata(data) {
        const metadata = {};
        metadata.status = data.status;
        metadata.diamonds = util.generateIndexNumbers(util.decryptTarget(data.target).split('|'));
        metadata.squaresUncovered = util.generateIndexNumbers(!!data.squaresUncovered ? util.decryptTarget(data.squaresUncovered).split('|') : []);
        metadata.currentProgress = util.generateIndexNumbers(!!data.currentProgress ? util.decryptTarget(data.currentProgress).split('|') : []);

        return metadata;
    }

    getProgress() {
        util.makeHTTPRequest('/get-progress?sessionId=' + encodeURIComponent(window.sessionStorage.getItem('session')), 'get')
            .then(res => {
                if (!res.data.error) {
                    const metadata = this.generateMetadata(res.data.data);

                    this.setState({metadata: metadata,
                        ...{showNewGameScreen: (metadata.squaresUncovered.length === 0),
                        showGameScreen: (metadata.squaresUncovered.length > 0),
                        showGameOverScreen: (metadata.status === 'Complete' && metadata.currentProgress.length === config.gridLength),
                        finalScore: (metadata.status === 'Complete' && metadata.currentProgress.length === config.gridLength ?
                            Math.pow(config.gridLength, 2) - metadata.squaresUncovered.length : 0)}});
                }
            })
            .catch(err => {
                console.log("err = ", err);
            });
    }

    onStartNewGame = (e) => {
        util.makeHTTPRequest('/new-game?sessionId=' + encodeURIComponent(window.sessionStorage.getItem('session')), 'get')
            .then(res => {
                if (!res.data.error) {
                    const metadata = this.generateMetadata(res.data.data);
                    this.setState({metadata: metadata, showGameOverScreen: false, showGameScreen: true});
                }
                else
                    console.log("message = ", res.data.message);
            })
            .catch(err => {
                console.log("err = ", err);
            });
    };

    showHideNewGameScreen = (e) =>
        this.setState(state => ({showNewGameScreen: !state.showNewGameScreen, showGameScreen: !state.showGameScreen}));

    logout = (e) => {
        util.makeHTTPRequest('/logout', 'delete',{sessionId: window.sessionStorage.getItem('session')})
            .then(res => {
                window.sessionStorage.clear();
                this.props.history.push('/login');
            })
            .catch(err => {
                console.log("err = ", err);
            });
    };

    componentDidMount() {
        if (!!window.sessionStorage.getItem('session')) {
            util.makeHTTPRequest('/check-session?sessionId=' + encodeURIComponent(window.sessionStorage.getItem('session')), 'get')
                .then(res => {
                    if (!res.data.error)
                        this.getProgress();
                    else
                        this.props.history.push('/login');
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
            <React.Fragment>
                {this.state.showNewGameScreen && (
                    <NewGameComponent showHideNewGameScreen={this.showHideNewGameScreen}/>
                )}
                {this.state.showGameOverScreen && (
                    <GameOverComponent onStartNewGame={this.onStartNewGame} score={this.state.finalScore} logout={this.logout}/>
                )}
                {this.state.showGameScreen && (
                    <Grid textAlign='center' className='main-page' verticalAlign='middle'>
                        <Grid.Row>
                            <Grid.Column className='main-nav-bar'>
                                <Menu pointing secondary className='menu-bar' fixed="top" size='large'>
                                    <Container>
                                        <Menu.Item position='left'>
                                            <Header className='white'>
                                                {config.welcome} {this.state.firstName}
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
                        <Grid.Row className='header-row'>
                            <Grid.Column>
                                <Header as="h1">{config.mainPageHeading}</Header>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className='table-row'>
                            <Grid.Column className='main-column'>
                                <Table celled className="diamond-table">
                                    <Table.Body>
                                        {this.createTable()}
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                )}
            </React.Fragment>
        );
    }
}

export default MainPageComponent;