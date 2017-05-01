import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import axios from 'axios';
import TextField from './ValidatedTextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nation: '',
      code: '',
      population: '',
      loading: true,
      invalid: true
    };

    this.handleUpdateNation = this.handleUpdateNation.bind(this);
    this.handleUpdatePop = this.handleUpdatePop.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
  }

  componentWillMount() {
    const baseUrl = process.env.WEBSITE_URL || 'http://localhost:3000';
    const apiEndpoint = baseUrl + '/api/generate_code';

    let _this = this;
    axios.get(apiEndpoint).then(function (response) {
      console.log(response);
      _this.setState({
        loading: false,
        code: response.data
      });
    }).catch(function (error) {
      console.log(error);
    });
  }

  handleUpdateNation(errors, values) {
    if (!errors) {
      this.setState({
        nation: values
      }, this.isFormValid);
    } else {
      this.setState({
        invalid: true
      });
    }
  }

  handleUpdatePop(errors, values) {
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
    if (this.state.nation && this.state.population && this.state.population > 0) {
      this.setState({
        invalid: false
      });
    }
  }

  submit() {
    console.log('Submit');
  }

  render() {
    if (this.state.loading) {
      return (
        <Grid fluid>
          <Row center="xs">
            <Col md >
              <RefreshIndicator
                size={60}
                left={10}
                top={0}
                status="loading"
                style={{ display: 'inline-block', position: 'relative' }}
              />
            </Col>
          </Row>
          <Row center="xs">
            <p>Loading...</p>
          </Row>
        </Grid>
      );
    }
    return (
      <Paper style={{ height: '70%', width: '50%', margin: '0 auto', marginTop: '25px', textAlign: 'center', padding: '20px' }}>
        <Grid fluid>
          <Row style={{ padding: '10 0 10 0' }}>
            <Col sm>
              <h4>Nation:</h4>
            </Col>
            <Col md>
              <TextField hintText="Nation"
                onChange={this.handleUpdateNation}
                validate={['required']}
                errorText="Please enter your nations name here"
                style={{ width: '100%' }} />
            </Col>
          </Row>
          <Row style={{ padding: '10 0 10 0' }}>
            <Col sm>
              <h4>Verification Code:</h4>
            </Col>
            <Col md>
              <h4>{this.state.code}</h4>
            </Col>
          </Row>
          <Row style={{ padding: '10 0 10 0' }}>
            <Col sm>
              <h4>Current Population:</h4>
            </Col>
            <Col md>
              <TextField hintText="Current Population"
                onChange={this.handleUpdatePop}
                validate={['required', 'isNumber']}
                errorText="Please enter your current population"
                style={{ width: '100%' }} />
            </Col>
          </Row>
          <Row>
            <Col md>
              <RaisedButton label="Register" primary style={{ width: '100%' }} onTouchTap={this.submit} disabled={this.state.invalid} />
            </Col>
          </Row>
        </Grid>
      </Paper>
    );
  }
}

export default Register;
