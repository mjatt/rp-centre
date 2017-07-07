import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

class CurrentMilitaryTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      military: [],
      initialBudget: null,
      remainingBudget: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.nation) {
      this.setState({
        military: nextProps.nationData[nextProps.nation].military,
        initialBudget: nextProps.nationData[nextProps.nation].budget,
        remainingBudget: nextProps.nationData[nextProps.nation].remainingBudget
      });
    }
  }

  render() {
    console.log(this.state);
    if (this.state.remainingBudget === null && this.state.military.length < 1) {
      if (this.state.initialBudget === null) {
        return (
          <Grid fluid>
            <Row center="md">
              <Col md>
                Doesn't look like you've calculated your budget, or bought anything...
            </Col>
            </Row>
          </Grid>
        );
      }
      return (
        <Grid fluid>
          <Row center="md">
            <Col md>
              <b><u>Budget:</u></b> {this.state.initialBudget}
            </Col>
          </Row>
          <Row center="md">
            <Col md>
              Doesn't look like you've bought anythin yet...
            </Col>
          </Row>
        </Grid>
      );
    }
    return (
      <Grid fluid>
        <Row center="md" style={{ paddingTop: '15px' }}>
          <Col md>
            <b><u>Inital Budget:</u></b> {this.state.initialBudget}
          </Col>
          <Col md>
            <b><u>Remaining Budget:</u></b> {this.state.remainingBudget}
          </Col>
        </Row>
        <Row center="md" style={{ paddingTop: '15px' }}>
          <Table>
            <TableHeader displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>Item Name</TableHeaderColumn>
                <TableHeaderColumn>PPU</TableHeaderColumn>
                <TableHeaderColumn>Quantity</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {
                this.state.military.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableRowColumn>{item.itemName}</TableRowColumn>
                      <TableRowColumn>{item.itemCost}</TableRowColumn>
                      <TableRowColumn>{item.quantity}</TableRowColumn>
                    </TableRow>
                  );
                })
              }
            </TableBody>
          </Table>
        </Row>
      </Grid>
    );
  }
}

CurrentMilitaryTab.propTypes = {
  nation: PropTypes.string,
  nationData: PropTypes.object
};

export default CurrentMilitaryTab;
