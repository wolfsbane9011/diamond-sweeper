import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {Button, Container, Header, Icon, Menu, Segment} from 'semantic-ui-react';
import config from "../config";

class HomePageComponent extends Component {
    componentDidMount() {
        if (!!window.sessionStorage.getItem('session'))
            this.props.history.push('/main');
    }

    render() {
        return (
            <Segment
                inverted
                textAlign='center'
                className='homepage-segment'
                vertical
            >
                <Menu inverted pointing secondary size='large'>
                    <Container>
                        <Menu.Item position='right'>
                            <Button inverted>
                                <Link to='/login'>{config.login}</Link>
                            </Button>
                            <Button inverted primary className='ml-1'>
                                <Link to='/sign-up'>{config.signUp}</Link>
                            </Button>
                        </Menu.Item>
                    </Container>
                </Menu>
                <Container text>
                    <Header
                        as='h1'
                        content={config.homepageHeader}
                        inverted
                        className='homepage-heading'
                    />
                    <Icon name='diamond' size='massive'/>
                </Container>
            </Segment>
        )
    }
}

export default HomePageComponent;