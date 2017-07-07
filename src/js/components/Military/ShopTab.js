import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from './../ValidatedTextField';
import Snackbar from 'material-ui/Snackbar';
import {
  Step,
  Stepper,
  StepLabel,
  StepContent
} from 'material-ui/Stepper';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import ShopCategory from './ShopCategory';
import axios from 'axios';

const baseUrl = process.env.WEBSITE_URL || 'http://localhost:3000';

class ShopTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      budget: null,
      openCalculate: false,
      invalid: true,
      population: null,
      loading: true,
      stepIndex: 0,
      finished: false,
      responseMsg: '',
      openSnackbar: false,
      shopItems: [],
      basket: [],
      selectedRows: []
    };

    this.handleRequestCloseSnackbar = this.handleRequestCloseSnackbar.bind(this);
    this.handleUpdatePopulation = this.handleUpdatePopulation.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
    this.openCalculate = this.openCalculate.bind(this);
    this.closeCalculate = this.closeCalculate.bind(this);
    this.calculate = this.calculate.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.resetStepper = this.resetStepper.bind(this);
    this.handleRemoveSelected = this.handleRemoveSelected.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    for (var key in nextProps.nationData) {
      if (nextProps.nationData.hasOwnProperty(key)) {
        if (key === nextProps.nation) {
          if (nextProps.nationData[key].budget !== 'undefined') {
            this.setState({
              budget: nextProps.nationData[key].budget
            });
          }
        }
      }
    }
    let items = [];
    for (var shopItemKey in nextProps.shopItems) {
      if (nextProps.shopItems.hasOwnProperty(shopItemKey)) {
        let temp = [];
        for (var individualItemKey in nextProps.shopItems[shopItemKey]) {
          if (nextProps.shopItems[shopItemKey].hasOwnProperty(individualItemKey)) {
            let item = {
              itemName: individualItemKey,
              itemPPU: nextProps.shopItems[shopItemKey][individualItemKey]
            };
            temp.push(item);
          }
        }
        let shopCategory = {
          categoryName: shopItemKey,
          items: temp
        };
        items.push(shopCategory);
      }
    }
    this.setState({
      loading: false,
      shopItems: items
    });
    this.resetStepper();
  }

  handleRequestCloseSnackbar() {
    this.setState({
      openSnackbar: false
    });
  }

  handleUpdatePopulation(errors, values) {
    if (!errors) {
      this.setState({
        population: values
      }, this.isFormValid);
    } else {
      this.setState({
        invalid: true
      });
    }
  }

  isFormValid() {
    if (this.state.population && this.props.nation) {
      this.setState({
        invalid: false
      });
    }
  }

  closeCalculate() {
    this.setState({
      openCalculate: false
    });
  }

  openCalculate() {
    this.setState({
      openCalculate: true
    });
  }

  calculate() {
    let pop = parseInt(this.state.population, 10);

    const apiEndpoint = baseUrl + '/api/calc/data?nation=' + this.props.nation + '&population=' + pop;

    let _this = this;
    axios.get(apiEndpoint).then(function (response) {
      console.log(response.data);
      _this.setState({
        openCalculate: false,
        responseMsg: response.data,
        openSnackbar: true
      });
    }).catch(function (error) {
      console.log(error.response.data);
      _this.setState({
        responseMsg: error.response.data,
        openSnackbar: true
      });
    });
  }

  handleNext() {
    let currentStep = this.state.stepIndex;
    this.setState({
      stepIndex: currentStep + 1
    });
  }

  handleFinish(remainingBudget) {
    let data = {
      nation: this.props.nation,
      remainingBudget: remainingBudget,
      items: this.state.basket,
      budget: this.state.budget
    };
    const apiEndpoint = baseUrl + '/api/calc/budget';

    let _this = this;
    axios.post(apiEndpoint, data).then(function (response) {
      console.log(response.data);
      _this.setState({
        responseMsg: response.data,
        openSnackbar: true,
        finished: true
      }, function () {
        this.handleNext();
      });
    }).catch(function (error) {
      console.log(error.response.data);
      _this.setState({
        responseMsg: error.response.data,
        openSnackbar: true,
        finished: true
      }, function () {
        this.handleNext();
      });
    });
  }

  handleBack() {
    let currentStep = this.state.stepIndex;
    this.setState({
      stepIndex: currentStep - 1
    });
  }

  toggle(thingToToggle) {
    return !thingToToggle;
  }

  renderStepActions(step, remainingBudget) {
    const { stepIndex } = this.state;
    if (stepIndex === 0) {
      return (
        <div style={{ margin: '12px 0' }}>
          <RaisedButton
            label="Next"
            disableTouchRipple
            disableFocusRipple
            primary
            onTouchTap={this.handleNext}
            disabled={!this.state.budget || this.state.budget < 0}
            style={{ marginRight: 12 }}
          />
          {step > 0 && (
            <FlatButton
              label="Back"
              disabled={stepIndex === 0}
              disableTouchRipple
              disableFocusRipple
              onTouchTap={this.handleBack}
            />
          )}
        </div>
      );
    }
    if (stepIndex === 2) {
      return (
        <div style={{ margin: '12px 0' }}>
          <RaisedButton
            label="Finish"
            disableTouchRipple
            disableFocusRipple
            primary
            onTouchTap={this.handleFinish.bind(this, remainingBudget)}
            style={{ marginRight: 12 }}
            disabled={remainingBudget < 0}
          />
          {step > 0 && (
            <FlatButton
              label="Back"
              disabled={stepIndex === 0}
              disableTouchRipple
              disableFocusRipple
              onTouchTap={this.handleBack}
            />
          )}
        </div>
      );
    }
    return (
      <div style={{ margin: '12px 0' }}>
        <RaisedButton
          label="Next"
          disableTouchRipple
          disableFocusRipple
          primary
          onTouchTap={this.handleNext}
          style={{ marginRight: 12 }}
        />
        {step > 0 && (
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            disableTouchRipple
            disableFocusRipple
            onTouchTap={this.handleBack}
          />
        )}
      </div>
    );
  }


  handleRowSelect(selectedRows) {
    this.setState({ selectedRows: selectedRows });
  }

  resetStepper() {
    if (this.state.finished) {
      this.setState({
        stepIndex: 0,
        finished: false
      });
    }
  }

  handleRemoveSelected() {
    if (this.state.selectedRows === 'all') {
      this.setState({
        basket: []
      });
    } else {
      let basket = [];
      for (var row in this.state.selectedRows) {
        if (Object.prototype.hasOwnProperty.call(this.state.selectedRows, row)) {
          let rowKey = this.state.selectedRows[row];
          for (var x = 0; x < this.state.basket.length; x++) {
            if (x !== rowKey) {
              basket.push(this.state.basket[x]);
            }
          }
        }
      }
      this.setState({
        basket: basket
      });
    }
  }

  render() {
    let totalSpend = 0;
    this.state.basket.map((item) => {
      let tempTotal = item.itemCost * item.quantity;
      totalSpend += tempTotal;
    });
    let remainingBudget = this.state.budget - totalSpend;
    if (this.state.loading) {
      return (
        <Grid fluid>
          <Paper style={{ marginTop: '15px', paddingTop: '5px', paddingBottom: '5px' }}>
            <Row center="md">
              <Col md>
                Loading data...
              </Col>
            </Row>
            <Row center="md" style={{ paddingTop: '10px' }}>
              <Col md>
                <RefreshIndicator
                  size={60}
                  left={10}
                  top={0}
                  status="loading"
                  style={{ display: 'inline-block', position: 'relative' }}
                />
              </Col>
            </Row>
          </Paper >
        </Grid>
      );
    }
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.closeCalculate}
      />,
      <FlatButton
        label="Submit"
        primary
        onTouchTap={this.calculate}
        disabled={this.state.invalid}
      />
    ];
    return (
      <div>
        <Snackbar
          open={this.state.openSnackbar}
          message={this.state.responseMsg}
          autoHideDuration={10000}
          onRequestClose={this.handleRequestCloseSnackbar}
        />
        <Dialog open={this.state.openCalculate} title="Calculate your budget..." actions={actions} modal>
          <Grid fluid>
            <Row center="md" style={{ paddingTop: '15px' }}>
              <Col md>
                <p>Please fill out the following fields</p>
              </Col>
            </Row>
            <Row center="md">
              <Col md style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                RP Population (please be realistic):
              </Col>
              <Col md>
                <TextField hintText="RP Population (please be realistic)"
                  onChange={this.handleUpdatePopulation}
                  validate={['required', 'isNumber']}
                  errorText="Please enter a valid number"
                  style={{ width: '100%' }} />
              </Col>
            </Row>
          </Grid>
        </Dialog>
        <Grid fluid>
          <Paper style={{ marginTop: '15px', paddingTop: '5px', paddingBottom: '5px' }}>
            <Row center="md" style={{ paddingTop: '10px' }}>
              <Col md>
                <Stepper activeStep={this.state.stepIndex} orientation="vertical">
                  {
                    (this.state.budget) ? (
                      <Step>
                        <StepLabel>Check your budget</StepLabel>
                        <StepContent>
                          <Grid fluid>
                            <Row center="md">
                              <Col md>
                                Your current budget is {this.state.budget}
                              </Col>
                            </Row>
                            <Row center="md" style={{ paddingTop: '10px' }}>
                              <Col md>
                                <RaisedButton primary label="Recalculate Budget" onTouchTap={this.openCalculate} style={{ width: '90%' }} />
                              </Col>
                            </Row>
                          </Grid>
                          {this.renderStepActions(0)}
                        </StepContent>
                      </Step>
                    ) : (
                        <Step>
                          <StepLabel>Calculate your budget</StepLabel>
                          <StepContent>
                            <Grid fluid>
                              <Row center="md">
                                <Col md>
                                  You don't have a budget yet, calculate one!
                                  </Col>
                              </Row>
                              <Row center="md" style={{ paddingTop: '10px' }}>
                                <Col md>
                                  <RaisedButton primary label="Calculate Budget" onTouchTap={this.openCalculate} style={{ width: '90%' }} />
                                </Col>
                              </Row>
                            </Grid>
                            {this.renderStepActions(0)}
                          </StepContent>
                        </Step>
                      )
                  }
                  <Step>
                    <StepLabel>Select military items</StepLabel>
                    <StepContent>
                      <Grid fluid>
                        {
                          this.state.shopItems.map((category) => {
                            return (
                              <Row center="md" key={category.categoryName} style={{ paddingBottom: '10px', paddingTop: '5px' }}>
                                <Col md>
                                  <ShopCategory items={category.items} categoryName={category.categoryName} basket={this.state.basket} />
                                </Col>
                              </Row>
                            );
                          })
                        }
                      </Grid>
                      {this.renderStepActions(1)}
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel>Review purchases</StepLabel>
                    <StepContent>
                      <Table multiSelectable onRowSelection={this.handleRowSelect}>
                        <TableHeader enableSelectAll>
                          <TableRow>
                            <TableHeaderColumn>Item Name</TableHeaderColumn>
                            <TableHeaderColumn>PPU</TableHeaderColumn>
                            <TableHeaderColumn>Quantity</TableHeaderColumn>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {
                            this.state.basket.map((item, index) => {
                              return (
                                <TableRow key={index} selected={this.state.selectedRows.indexOf(index) !== -1}>
                                  <TableRowColumn>{item.itemName}</TableRowColumn>
                                  <TableRowColumn>{item.itemCost}</TableRowColumn>
                                  <TableRowColumn>{item.quantity}</TableRowColumn>
                                </TableRow>
                              );
                            })
                          }
                        </TableBody>
                      </Table>
                      <Grid fluid>
                        <Row center="md" style={{ paddingTop: '15px' }}>
                          <Col md>
                            <RaisedButton disabled={this.state.selectedRows.length < 1 || this.state.selectedRows === 'none'} secondary label="Remove Selected Item(s)" style={{ width: '100%' }} onTouchTap={this.handleRemoveSelected} />
                          </Col>
                        </Row>
                        <Row style={{ paddingTop: '15px' }}>
                          <Col md>
                            <b>Budget:</b> {this.state.budget}
                          </Col>
                          <Col md>
                            <b>Total Spend:</b> {totalSpend}
                          </Col>
                          <Col md>
                            <b>Remaining Budget:</b> {remainingBudget}
                          </Col>
                        </Row>
                      </Grid>
                      {this.renderStepActions(2, remainingBudget)}
                    </StepContent>
                  </Step>
                </Stepper>
              </Col>
            </Row>
          </Paper >
        </Grid >
      </div>
    );
  }
}

ShopTab.propTypes = {
  nation: PropTypes.string,
  nationData: PropTypes.object,
  shopItems: PropTypes.object
};

export default ShopTab;
