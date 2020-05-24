import React from 'react';
import {Button, Header, Modal, Icon} from "semantic-ui-react";
import config from "../config";

function NewGameComponent(props) {
    return (
        <Modal defaultOpen closeOnDimmerClick={false} className="half-width">
            <Modal.Header>{config.welcomeTitle}</Modal.Header>
            <Modal.Content image>
                <Icon name="diamond" color="teal" size="huge"/>
                <Modal.Description className="new-game-description">
                    <Header>{config.welcomeSubTitle}</Header>
                    <Button primary onClick={event => props.showHideNewGameScreen(event)}>{config.welcomePlayButton}</Button>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    )
}

export default NewGameComponent;