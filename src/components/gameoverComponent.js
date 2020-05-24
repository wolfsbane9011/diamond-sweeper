import React from 'react';
import {Button, Item, Header, Modal, Icon} from "semantic-ui-react";
import config from "../config";

function GameOverComponent(props) {
    return (
        <Modal defaultOpen closeOnDimmerClick={false} className="half-width">
            <Modal.Header>{config.gameOverTitle}</Modal.Header>
            <Modal.Content image>
                <Icon name="diamond" color="teal" size="huge"/>
                <Modal.Description className="game-over-description">
                    <Header>{config.gameOverSubTitle}</Header>
                    <Item as="p" className="fs-45">{props.score}</Item>
                    <Button primary onClick={event => props.onStartNewGame(event)}>{config.gameOverPlayAgain}</Button>
                    <Button primary onClick={event => props.logout(event)}>{config.logout}</Button>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    )
}

export default GameOverComponent;