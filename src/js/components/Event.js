import React, { PropTypes } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Link } from 'react-router-dom';
import { connect } from 'react-firebase';

import RefreshIndicator from 'material-ui/RefreshIndicator';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from './ValidatedTextField';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

class Events extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      events: [],
      createEvent: false,
      eventTitle: '',
      eventDescription: '',
      eventChannel: '',
      invalid: true
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.createEvent = this.createEvent.bind(this);
    this.handleEventChannelChange = this.handleEventChannelChange.bind(this);
    this.handleUpdateTitle = this.handleUpdateTitle.bind(this);
    this.handleUpdateDescription = this.handleUpdateDescription.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
  }

  handleOpen() {
    this.setState({
      createEvent: true
    });
  }

  handleClose() {
    this.setState({
      createEvent: false
    });
  }

  componentWillReceiveProps(nextProps) {
    let newData = [];
    let nations = {};
    for (let key in nextProps.nations) {
      if (nextProps.nations.hasOwnProperty(key)) {
        nations[key] = nextProps.nations[key].flag;
      }
    }
    for (let key in nextProps.data) {
      if (nextProps.data.hasOwnProperty(key)) {
        let nation = nextProps.data[key].createdBy;
        let event = {
          createdOn: nextProps.data[key].createdOn,
          createdBy: nation,
          flag: nations[nation],
          title: nextProps.data[key].title,
          description: nextProps.data[key].description,
          channel: nextProps.data[key].channel,
          key: key
        };
        newData.push(event);
      }
    }

    this.setState({ loading: false, events: newData });
  }

  createEvent() {
    console.log('Not Yet Implemented!');
  }

  handleUpdateTitle(errors, values) {
    if (!errors) {
      this.setState({
        eventTitle: values
      }, this.isFormValid);
    } else {
      this.setState({
        invalid: true
      });
    }
  }

  handleUpdateDescription(errors, values) {
    if (!errors) {
      this.setState({
        eventDescription: values
      }, this.isFormValid);
    } else {
      this.setState({
        invalid: true
      });
    }
  }

  handleEventChannelChange(event, value) {
    let myVal = value.replace('_', ' ');
    myVal = myVal.replace(/\w\S*/g, function (txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    this.setState({
      eventChannel: myVal
    }, this.isFormValid);
  }

  isFormValid() {
    if (this.state.eventTitle && this.state.eventDescription && this.state.eventChannel) {
      this.setState({
        invalid: false
      });
    }
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary
        onTouchTap={this.createEvent}
        disabled={this.state.invalid}
      />
    ];
    return (
      <div>
        <Dialog open={this.state.createEvent} title="Create an event..." actions={actions} modal>
          <Grid fluid>
            <Row center="md" style={{ paddingTop: '15px' }}>
              <Col md>
                <p>Please fill out the following fields</p>
              </Col>
            </Row>
            <Row center="md">
              <Col md style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                Event Title:
              </Col>
              <Col md>
                <TextField hintText="Event Title"
                  onChange={this.handleUpdateTitle}
                  validate={['required']}
                  errorText="Please enter an event title"
                  style={{ width: '100%' }} />
              </Col>
            </Row>
            <Row center="md" style={{ paddingTop: '15px' }}>
              <Col md style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                Event Description:
              </Col>
              <Col md>
                <TextField hintText="Description"
                  onChange={this.handleUpdateDescription}
                  validate={['required']}
                  errorText="Please enter an event description"
                  style={{ width: '100%' }}
                  multiline
                  rows={4}
                  rowsMax={10} />
              </Col>
            </Row>
            <Row center="md" style={{ paddingTop: '15px' }}>
              <Col md mdOffset={4}>
                <RadioButtonGroup onChange={this.handleEventChannelChange} style={{ width: '50%'}} name="channel" defaultSelected="general">
                  <RadioButton
                    value="general"
                    label="General"
                  />
                  <RadioButton
                    value="international_affairs"
                    label="International Affairs"
                  />
                  <RadioButton
                    value="internal_affairs"
                    label="Internal Affairs"
                  />
                </RadioButtonGroup>
              </Col>
            </Row>
          </Grid>
        </Dialog>
        <Grid fluid>
          <Row center="md" style={{ paddingTop: '15px' }}>
            {
              (this.props.nation) ? (
                <Col md>
                  <RaisedButton style={{ width: '75%' }} onTouchTap={this.handleOpen} backgroundColor="rgb(232, 232, 232)" label="Create new event" />
                </Col>
              ) : (
                  <Col md>
                    <Link to="/register">
                      <RaisedButton style={{ width: '75%' }} backgroundColor="rgb(232, 232, 232)" label="Log in" />
                    </Link>
                  </Col>
                )
            }
          </Row>
          {
            (this.state.loading) ? (
              <div>
                <Row center="xs" style={{ paddingTop: '15px' }}>
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
                  <Col md>
                    <p>Loading data...</p>
                  </Col>
                </Row>
              </div>
            ) : (
                null
              )
          }
          {
            this.state.events.map((event) => {
              let subtitle = event.createdBy + ' - Created On: ' + event.createdOn + ' - Channel: ' + event.channel;
              return (
                <Row style={{ paddingTop: '15px' }} key={event.key} center="md">
                  <Col md>
                    <Card>
                      <CardHeader
                        title={event.title}
                        subtitle={subtitle}
                        avatar={event.flag}
                      />
                      <CardText>{event.description}</CardText>
                      <CardText>{event.createdOn}</CardText>
                    </Card>
                  </Col>
                </Row>
              );
            })
          }
        </Grid>
      </div>
    );
  }
}

Events.propTypes = {
  nation: PropTypes.string,
  data: PropTypes.object,
  nations: PropTypes.object
};

const mapFirebaseToProps = {
  data: 'events',
  nations: 'nations'
};

export default connect(mapFirebaseToProps)(Events);
