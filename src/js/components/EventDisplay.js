import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Link } from 'react-router-dom';
import { connect } from 'react-firebase';
import axios from 'axios';
import moment from 'moment';
import Event from './Event';

import RefreshIndicator from 'material-ui/RefreshIndicator';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from './ValidatedTextField';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import FilterPicker from './FilterPicker';
import Pagination from 'material-ui-pagination';
import Paper from 'material-ui/Paper';
import LinearProgress from 'material-ui/LinearProgress';

class Events extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      events: [],
      rawEvents: [],
      createEvent: false,
      eventTitle: '',
      eventDescription: '',
      eventChannel: '',
      invalid: true,
      selectedGeneral: false,
      selectedInternalAffairs: false,
      selectedInternationalAffairs: false,
      selectedAll: true,
      total: 0,
      current: 0
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.createEvent = this.createEvent.bind(this);
    this.handleEventChannelChange = this.handleEventChannelChange.bind(this);
    this.handleUpdateTitle = this.handleUpdateTitle.bind(this);
    this.handleUpdateDescription = this.handleUpdateDescription.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
    this.generalSelected = this.generalSelected.bind(this);
    this.internalAffairsSelected = this.internalAffairsSelected.bind(this);
    this.internationalAffairsSelected = this.internationalAffairsSelected.bind(this);
    this.allSelected = this.allSelected.bind(this);
    this.removeUnrelated = this.removeUnrelated.bind(this);
    this.handlePageSelectionChanged = this.handlePageSelectionChanged.bind(this);
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

  sanitiseData(nextProps) {
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
        nation = nation.replace(new RegExp('_', 'g'), ' ');
        nation = nation.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        let event = {
          createdOn: nextProps.data[key].createdOn,
          createdBy: nation,
          flag: nations[nextProps.data[key].createdBy],
          title: nextProps.data[key].title,
          description: nextProps.data[key].description,
          channel: nextProps.data[key].channel,
          comments: [],
          key: key,
          approvalCount: nextProps.data[key].approvalCount,
          disapprovalCount: nextProps.data[key].disapprovalCount,
          approvals: [],
          disapprovals: []
        };
        if (nextProps.data[key].comments !== 'undefined') {
          let comments = [];
          for (let commentKey in nextProps.data[key].comments) {
            if (nextProps.data[key].comments.hasOwnProperty(commentKey)) {
              let comment = nextProps.data[key].comments[commentKey];
              comment.key = commentKey;
              comments.push(comment);
            }
          }
          comments.sort(function (comment1, comment2) {
            let date1 = moment(comment1.createdOn, 'DD/MM/YYYY HH:mm:ss');
            let date2 = moment(comment2.createdOn, 'DD/MM/YYYY HH:mm:ss');
            if (date2 > date1) {
              return 1;
            } else if (date1 > date2) {
              return -1;
            }
            return 0;
          });
          event.comments = comments;
        }
        if (nextProps.data[key].approvals !== 'undefined') {
          let approvals = [];
          for (let approvalKey in nextProps.data[key].approvals) {
            if (nextProps.data[key].approvals.hasOwnProperty(approvalKey)) {
              let approval = nextProps.data[key].approvals[approvalKey].nation;
              approvals.push(approval);
            }
          }
          event.approvals = approvals;
        }
        if (nextProps.data[key].disapprovals !== 'undefined') {
          let disapprovals = [];
          for (let disapprovalKey in nextProps.data[key].disapprovals) {
            if (nextProps.data[key].disapprovals.hasOwnProperty(disapprovalKey)) {
              let disapproval = nextProps.data[key].disapprovals[disapprovalKey].nation;
              disapprovals.push(disapproval);
            }
          }
          event.disapprovals = disapprovals;
        }
        newData.push(event);
      }
    }
    newData.sort(function (event1, event2) {
      let date1 = moment(event1.createdOn, 'DD/MM/YYYY HH:mm:ss');
      let date2 = moment(event2.createdOn, 'DD/MM/YYYY HH:mm:ss');
      if (date2 > date1) {
        return 1;
      } else if (date1 > date2) {
        return -1;
      }
      return 0;
    });
    return newData;
  }

  componentWillReceiveProps(nextProps) {
    let newData = this.sanitiseData(nextProps);
    if (this.state.selectedGeneral) {
      newData = this.removeUnrelated('General', newData);
    } else if (this.state.selectedInternalAffairs) {
      newData = this.removeUnrelated('Internal Affairs', newData);
    } else if (this.state.selectedInternationalAffairs) {
      newData = this.removeUnrelated('International Affairs', newData);
    }
    this.setState({
      rawEvents: newData
    });
    let paginatedData = this.paginateData(newData);
    let numberOfPages = Math.round(newData.length / 5);
    this.setState({ loading: false, events: paginatedData, total: numberOfPages, current: 1 });
  }

  paginateData(events) {
    let numberOfPages = Math.round(events.length / 5);
    let paginatedData = [];
    let currentPointer = 0;
    for (let x = 0; x < numberOfPages; x++) {
      let temp = [];
      for (let y = 0; y < 5; y++) {
        if (currentPointer > events.length - 1) {
          break;
        }
        temp[y] = events[currentPointer];
        currentPointer++;
      }
      paginatedData[x] = temp;
    }
    return paginatedData;
  }

  generalSelected() {
    this.setState({
      selectedGeneral: true,
      selectedInternalAffairs: false,
      selectedInternationalAffairs: false,
      selectedAll: false
    });
    let events = this.removeUnrelated('General', this.state.rawEvents);
    let numberOfPages = Math.round(events.length / 5);
    let paginatedEvents = this.paginateData(events);
    let _this = this;
    this.setState({
      events: paginatedEvents,
      total: numberOfPages
    }, function () {
      _this.forceUpdate();
    });
  }

  internalAffairsSelected() {
    this.setState({
      selectedGeneral: false,
      selectedInternalAffairs: true,
      selectedInternationalAffairs: false,
      selectedAll: false
    });
    let events = this.removeUnrelated('Internal Affairs', this.state.rawEvents);
    let numberOfPages = Math.round(events.length / 5);
    let paginatedEvents = this.paginateData(events);
    let _this = this;
    this.setState({
      events: paginatedEvents,
      total: numberOfPages
    }, function () {
      _this.forceUpdate();
    });
  }

  internationalAffairsSelected() {
    this.setState({
      selectedGeneral: false,
      selectedInternalAffairs: false,
      selectedInternationalAffairs: true,
      selectedAll: false
    });
    let events = this.removeUnrelated('International Affairs', this.state.rawEvents);
    let numberOfPages = Math.round(events.length / 5);
    let paginatedEvents = this.paginateData(events);
    let _this = this;
    this.setState({
      events: paginatedEvents,
      total: numberOfPages
    }, function () {
      _this.forceUpdate();
    });
  }

  allSelected() {
    this.setState({
      selectedGeneral: false,
      selectedInternalAffairs: false,
      selectedInternationalAffairs: false,
      selectedAll: true
    });
    let events = this.removeUnrelated('All', this.state.rawEvents);
    let numberOfPages = Math.round(events.length / 5);
    let paginatedEvents = this.paginateData(events);
    let _this = this;
    this.setState({
      events: paginatedEvents,
      total: numberOfPages
    }, function () {
      _this.forceUpdate();
    });
  }

  removeUnrelated(channel, events) {
    if (channel !== 'All') {
      let newData = [];
      events.forEach(function (element) {
        if (element.channel === channel) {
          newData.push(element);
        }
      }, this);
      newData.sort(function (event1, event2) {
        let date1 = moment(event1.createdOn, 'DD/MM/YYYY HH:mm:ss');
        let date2 = moment(event2.createdOn, 'DD/MM/YYYY HH:mm:ss');
        if (date2 > date1) {
          return 1;
        } else if (date1 > date2) {
          return -1;
        }
        return 0;
      });
      return newData;
    }
    events.sort(function (event1, event2) {
      let date1 = moment(event1.createdOn, 'DD/MM/YYYY HH:mm:ss');
      let date2 = moment(event2.createdOn, 'DD/MM/YYYY HH:mm:ss');
      if (date2 > date1) {
        return 1;
      } else if (date1 > date2) {
        return -1;
      }
      return 0;
    });
    return events;
  }

  createEvent() {
    this.setState({
      processing: true
    }, function () {
      let data = {
        title: this.state.eventTitle,
        description: this.state.eventDescription,
        channel: this.state.eventChannel,
        createdBy: this.props.nation
      };

      const baseUrl = process.env.WEBSITE_URL || 'http://localhost:3000';
      const apiEndpoint = baseUrl + '/api/event';

      let _this = this;
      axios.post(apiEndpoint, data).then(function (response) {
        console.log(response);
        _this.setState({
          createEvent: false,
          processing: false
        });
      }).catch(function (error) {
        console.log(error);
        _this.setState({
          processing: false
        });
      });
    });
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
    myVal = myVal.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
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

  toggle(thingToToggle) {
    return !thingToToggle;
  }

  handlePageSelectionChanged(numberSelected) {
    let _this = this;
    this.setState({ current: numberSelected }, function () {
      _this.forceUpdate();
    });
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
        {
          (this.state.processing) ? (
            <LinearProgress mode="indeterminate" />
          ) : (
              null
            )
        }
        <Dialog open={this.state.createEvent} title="Create an event..." actions={actions} modal>
          <Grid fluid>
            <Row center="md" style={{ paddingTop: '15px' }}>
              <Col md>
                <p>Please fill out the following fields</p>
              </Col>
            </Row>
            <Row center="md">
              <Col md style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
              <Col md style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                Event Description:
              </Col>
              <Col md>
                <TextField hintText="Description"
                  onChange={this.handleUpdateDescription}
                  validate={['required']}
                  errorText="Please enter an event description"
                  style={{ width: '100%' }}
                  rows={4}
                  rowsMax={10}
                  multiLine />
              </Col>
            </Row>
            <Row center="md" style={{ paddingTop: '15px' }}>
              <Col md mdOffset={4}>
                <RadioButtonGroup onChange={this.handleEventChannelChange} style={{ width: '50%' }} name="channel" defaultSelected="general">
                  <RadioButton
                    value="General"
                    label="General"
                  />
                  <RadioButton
                    value="International Affairs"
                    label="International Affairs"
                  />
                  <RadioButton
                    value="Internal Affairs"
                    label="Internal Affairs"
                  />
                </RadioButtonGroup>
              </Col>
            </Row>
          </Grid>
        </Dialog>
        <Grid fluid>
          <Row>
            <FilterPicker
              md={2}
              sm={0}
              xs={0}
              selectedAll={this.state.selectedAll}
              selectedGeneral={this.state.selectedGeneral}
              selectedInternalAffairs={this.state.selectedInternalAffairs}
              selectedInternationalAffairs={this.state.selectedInternationalAffairs}
              allSelected={this.allSelected} generalSelected={this.generalSelected}
              internalAffairsSelected={this.internalAffairsSelected}
              internationalAffairsSelected={this.internationalAffairsSelected} />
            <Col md={10} sm={12} xs={24}>
              <Grid fluid>
                <Row center="xs" style={{ paddingTop: '15px' }}>
                  {
                    (this.props.nation) ? (
                      <Col md={12} sm={12} xs={24}>
                        <RaisedButton style={{ width: '75%' }} onTouchTap={this.handleOpen} backgroundColor="rgb(232, 232, 232)" label="Create new event" />
                      </Col>
                    ) : (
                        <Col md={12} sm={12} xs={24}>
                          <Link to="/register">
                            <RaisedButton style={{ width: '75%' }} backgroundColor="rgb(232, 232, 232)" label="Log in" />
                          </Link>
                        </Col>
                      )
                  }
                </Row>
                <Row center="md" style={{ paddingTop: '15px' }}>
                  <Col md>
                    <Paper>
                      <Pagination
                        total={this.state.total}
                        current={this.state.current}
                        display={5}
                        onChange={this.handlePageSelectionChanged}
                      />
                    </Paper>
                  </Col>
                </Row>
                {
                  (this.state.loading) ? (
                    <div>
                      <Row center="xs" style={{ paddingTop: '15px' }}>
                        <Col md={12} sm={12} xs={24} >
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
                        <Col md={12} sm={12} xs={24}>
                          <p>Loading data...</p>
                        </Col>
                      </Row>
                    </div>
                  ) : (
                      this.state.events[this.state.current - 1].map((event) => {
                        return (
                          <Row style={{ paddingTop: '15px' }} key={event.key} center="xs">
                            <Col md={12} sm={24} xs={24}>
                              <Event event={event} nation={this.props.nation} isAdmin={this.props.isAdmin} />
                            </Col>
                          </Row>
                        );
                      })
                    )
                }
                {
                  (!this.state.loading) ? (
                    <Row center="md" style={{ paddingTop: '15px' }}>
                      <Col md>
                        <Paper>
                          <Pagination
                            total={this.state.total}
                            current={this.state.current}
                            display={5}
                            onChange={this.handlePageSelectionChanged}
                          />
                        </Paper>
                      </Col>
                    </Row>
                  ) : (
                      null
                    )
                }
              </Grid>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

Events.propTypes = {
  nation: PropTypes.string,
  isAdmin: PropTypes.bool,
  data: PropTypes.object,
  nations: PropTypes.object
};

const mapFirebaseToProps = {
  data: 'events',
  nations: 'nations'
};

export default connect(mapFirebaseToProps)(Events);
