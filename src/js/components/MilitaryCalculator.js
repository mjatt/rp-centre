import React, { PropTypes, Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import { connect } from 'react-firebase';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from './ValidatedTextField';
import axios from 'axios';
import Snackbar from 'material-ui/Snackbar';
import RefreshIndicator from 'material-ui/RefreshIndicator';

class MilitaryCalculator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      budget: null,
      openCalculate: false,
      invalid: true,
      population: null,
      loading: true
    };

    this.handleRequestCloseSnackbar = this.handleRequestCloseSnackbar.bind(this);
    this.handleUpdatePopulation = this.handleUpdatePopulation.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
    this.openCalculate = this.openCalculate.bind(this);
    this.closeCalculate = this.closeCalculate.bind(this);
    this.calculate = this.calculate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
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
    this.setState({
      loading: false
    });
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

    const baseUrl = process.env.WEBSITE_URL || 'http://localhost:3000';
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

  render() {
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
    if (this.props.nation) {
      return (
        <div>
          <Snackbar
            open={this.state.openSnackbar}
            message={this.state.responseMsg}
            autoHideDuration={10000}
            onRequestClose={this.handleRequestCloseSnackbar}
          />
          <Dialog open={this.state.openCalculate} title="Create an event..." actions={actions} modal>
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
                    errorText="Please enter an event title"
                    style={{ width: '100%' }} />
                </Col>
              </Row>
            </Grid>
          </Dialog>
          <Grid fluid>
            <Paper style={{ marginTop: '15px', paddingTop: '5px', paddingBottom: '5px' }}>
              {
                (this.state.budget) ? (
                  <div>
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
                  </div>
                ) : (
                    <div>
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
                    </div>
                  )
              }
            </Paper >
          </Grid >
        </div>
      );
    }
    return (
      <Grid fluid>
        <Paper style={{ marginTop: '15px', paddingTop: '5px', paddingBottom: '5px' }}>
          <Row center="md">
            <Col md>
              You need to be logged in to access this page...
          </Col>
          </Row>
          <Row center="md" style={{ paddingTop: '10px' }}>
            <Col md>
              <Link to="register">
                <RaisedButton label="Login" primary style={{ width: '90%' }} />
              </Link>
            </Col>
          </Row>
        </Paper >
      </Grid>
    );
  }
}

MilitaryCalculator.propTypes = {
  nation: PropTypes.string,
  nationData: PropTypes.object
};

const mapFirebaseToProps = {
  nationData: 'nations'
};

export default connect(mapFirebaseToProps)(MilitaryCalculator);