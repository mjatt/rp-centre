import React, { PropTypes } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import axios from 'axios';
import TextField from './ValidatedTextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

class Events extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            nation: '',
            code: '',
            eventTitle: '',
            eventContent: '',
            loading: true,
            invalid: true,
            open: false,
            responseMsg: ''
        };

        this.handleUpdateNation = this.handleUpdateNation.bind(this);
        this.handleUpdateCode = this.handleUpdateCode.bind(this);
        this.handleUpdateTitle = this.handleUpdateTitle.bind(this);
        this.handleUpdateContent = this.handleUpdateContent.bind(this);
        this.isFormValid = this.isFormValid.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.submit = this.submit.bind(this);
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

        handleUpdateTitle(errors, values) {
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

        handleUpdateContent(errors, values) {
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
            if (this.state.nation && this.state.title && this.state.event) {
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
            let data = {
                nation: this.state.nation,
                code: this.state.code,
                title: this.state.title,
                content: this.state.content
            };

            const apiEndpoint = baseUrl + '/api/verify';

            let _this = this;
            anxios.post(apiEndpoint, data).then(function (response) {
                console.log(response.data);
                _this.setState({
                    responseMsg: 'Posted Successfully...',
                    open: true
                });
            }).catch(function {error} {
                console.log(error.response.data);
                _this.setState({
                    responseMsg: 'There was an error, please try again...',
                    open: true
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
                          </Grid>
                );
            }
            return (
                <Paper style={{ height: 70%, width '50%', margin: '0 auto', marginTop: '25px', textAlign: 'center', padding: '20px' }}>
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
                          <Row style={{ padding: '10 0 10 0' }}>
                            <Col sm>
                              <h4>Title:</h4>
                            </Col>
                            <Col md>
                              <TextField hintText="Event title"
                                onChange={this.handleUpdateTitle}
                                validate={['required']}
                                errorText="Please enter your event title"
                                style={{ width: '100%' }} />
                            </Col>
                          </Row>
                          <Row style={{ padding: '10 0 10 0' }}>
                            <Col sm>
                              <h4>Event Content:</h4>
                            </Col>
                            <Col md>
                              <TextField hintText="Event Content"
                                onChange={this.handleUpdateContent}
                                validate={['required']}
                                errorText="Please enter your event content"
                                style={{ width: '100%' }} />
                             </Col>
                           </Row>
                           <Row>
                             <Col md>
                               <RaisedButton label="Submit event" primary style={{ width: '100%' }} onTouchTap={this.submit} disabled={this.state.invalid} />
                             </Col>
                           </Row>
                         </Grid>
                       </Paper>
            );
        }
}

export default Event;   
