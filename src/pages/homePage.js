import React from 'react';
import {Link} from "react-router-dom";
import {Button, Container, Header, Icon, Menu, Segment} from 'semantic-ui-react';
import util from "../utils";

function HomePage() {
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
                            <Link to='/login'>{util.login}</Link>
                        </Button>
                        <Button inverted primary className='ml-1'>
                            <Link to='/sign-up'>{util.signUp}</Link>
                        </Button>
                    </Menu.Item>
                </Container>
            </Menu>
            <Container text>
                <Header
                    as='h1'
                    content={util.homepageHeader}
                    inverted
                    className='homepage-heading'
                />
                <Icon name='diamond' size='massive'/>
            </Container>
        </Segment>
    )
}

export default HomePage;