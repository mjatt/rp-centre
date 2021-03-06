import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import axios from 'axios';
import TextField from './ValidatedTextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import LinearProgress from 'material-ui/LinearProgress';

const SITE_CODE = process.env.CODE || 'norrland-rp';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nation: '',
      code: '',
      loading: true,
      invalid: true,
      open: false,
      responseMsg: '',
      processing: false
    };

    this.handleUpdateNation = this.handleUpdateNation.bind(this);
    this.handleUpdateCode = this.handleUpdateCode.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    window.open('https://www.nationstates.net/page=verify_login?token=' + SITE_CODE, '_window');
    let _this = this;
    setTimeout(() => {
      _this.setState({
        loading: false
      });
    }, 1000);
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

  handleUpdateCode(errors, values) {
    if (!errors) {
      this.setState({
        code: values
      }, this.isFormValid);
    } else {
      this.setState({
        invalid: true
      });
    }
  }

  isFormValid() {
    if (this.state.nation && this.state.code) {
      this.setState({
        invalid: false
      });
    }
  }

  handleRequestClose() {
    this.setState({
      open: false
    });
  }

  submit() {
    this.setState({
      processing: true
    }, function () {
      let data = {
        nation: this.state.nation,
        code: this.state.code
      };
      console.log(process.env.WEBSITE_URL);
      const baseUrl = process.env.WEBSITE_URL || 'http://localhost:3000';
      const apiEndpoint = baseUrl + '/api/verify';

      let _this = this;
      axios.post(apiEndpoint, data).then(function (response) {
        console.log(response.data);
        _this.setState({
          responseMsg: response.data,
          open: true,
          processing: false
        }, function () {
          setTimeout(function () {
            window.location.href = baseUrl;
          }, 3000);
        });
      }).catch(function (error) {
        console.log(error.response.data);
        _this.setState({
          responseMsg: error.response.data,
          open: true,
          processing: false
        });
      });
    });
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
      <div>
        {
          (this.state.processing) ? (
            <LinearProgress mode="indeterminate" />
          ) : (
              null
            )
        }
        <Paper style={{ height: '70%', width: '50%', margin: '0 auto', marginTop: '25px', textAlign: 'center', padding: '20px' }}>
          <Snackbar
            open={this.state.open}
            message={this.state.responseMsg}
            autoHideDuration={10000}
            onRequestClose={this.handleRequestClose}
          />
          <Grid fluid>
            <Row style={{ padding: '10 0 10 0' }}>
              <Col sm>
                <h4>Nation:</h4>
              </Col>
              <Col md>
                <TextField hintText="Nation"
                  onChange={this.handleUpdateNation}
                  validate={['required']}
                  errorText="Please enter your nation's name"
                  style={{ width: '100%' }} />
              </Col>
            </Row>
            <Row style={{ padding: '10 0 10 0' }}>
              <Col sm>
                <h4>Verification Code:</h4>
              </Col>
              <Col md>
                <TextField hintText="Verification Code"
                  onChange={this.handleUpdateCode}
                  validate={['required']}
                  errorText="Please enter your verification code"
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
        <Paper style={{ margin: '0 auto', marginTop: '15px', width: '50%', textAlign: 'center' }}>
          <Grid fluid>
            <Row center="md">
              <Col md>
                <p><b><u>Please note:</u></b> this site uses cookies to improve the user experiance, by continuing to login using the above form you consent to our use of cookies. For further information please ask on <a href="https://github.com/alexbance/rp-centre">github</a></p>
              </Col>
            </Row>
          </Grid>
        </Paper>
      </div >
    );
  }
}

export default Register;
