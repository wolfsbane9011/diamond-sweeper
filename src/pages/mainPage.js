import React, {Component} from 'react';
import {Button, Icon, Item, Table} from "semantic-ui-react";
import Range from "lodash/range";

class MainPage extends Component {
    gridLength = 8;
    arrows = {
        up: "arrow up",
        down: "arrow down",
        left: "arrow left",
        right: "arrow right"
    };

    // Dynamically creating the matrix
    createTable() {
        const {Row, Cell} = Table;
        return (
            <React.Fragment>
                {Range(0, this.gridLength).map((current, index) => (
                    <Row key={current + "" + index}>
                        {Range(0, this.gridLength).map((current, index) => (
                            <Cell key={index + "" + current} className="matrix-cell">
                                {/*<Item as="div">*/}
                                <Item as="div" className="diamond-value"><Icon name="diamond"/></Item>
                                <Item as="div" className="diamond-question">
                                    <Button icon="question" key={"Button " + index + "" + current} fluid/>
                                </Item>
                                {/*</Item>*/}
                            </Cell>
                        ))}
                    </Row>
                ))}
            </React.Fragment>
        );
    }

    render() {
        return (
            <Table celled className="diamond-table">
                <Table.Body>
                    {this.createTable()}
                </Table.Body>
            </Table>
        );
    }
}

export default MainPage;