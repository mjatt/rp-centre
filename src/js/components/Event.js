import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import CommentIcon from 'material-ui/svg-icons/communication/comment';
import { Grid, Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from './ValidatedTextField';
import axios from 'axios';
import moment from 'moment';
import Markdown from 'react-markdown';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Snackbar from 'material-ui/Snackbar';

const baseUrl = process.env.WEBSITE_URL || 'http://localhost:3000';

class Event extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      invalid: true,
      comment: '',
      eventTitle: '',
      eventDescription: '',
      subtitle: '',
      shouldBeDisabled: true,
      flag: '',
      comments: [],
      eventChannel: '',
      updateInvalid: false,
      eventKey: '',
      updateEvent: false,
      snackbarOpen: false,
      responseMsg: ''
    };

    this.expand = this.expand.bind(this);
    this.handleUpdateComment = this.handleUpdateComment.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
    this.newComment = this.newComment.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdateTitle = this.handleUpdateTitle.bind(this);
    this.handleUpdateDescription = this.handleUpdateDescription.bind(this);
    this.handleEventChannelChange = this.handleEventChannelChange.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.isUpdateFormValid = this.isUpdateFormValid.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let shouldBeDisabled = (nextProps.nation === nextProps.event.createdBy) ? false : true;
    if (shouldBeDisabled && nextProps.isAdmin) {
      shouldBeDisabled = false;
    }
    this.setState({
      eventTitle: nextProps.event.title,
      eventDescription: nextProps.event.description,
      subtitle: nextProps.event.createdBy + ' - Created On: ' + nextProps.event.createdOn + ' - Channel: ' + nextProps.event.channel,
      shouldBeDisabled: shouldBeDisabled,
      flag: nextProps.event.flag,
      comments: nextProps.event.comments,
      eventChannel: nextProps.event.channel,
      eventKey: nextProps.event.key
    });
  }

  expand() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  handleUpdateComment(errors, values) {
    if (!errors) {
      this.setState({
        comment: values
      }, this.isFormValid);
    } else {
      this.setState({
        invalid: true
      });
    }
  }

  isFormValid() {
    if (this.state.comment && this.props.nation) {
      this.setState({
        invalid: false
      });
    }
  }

  newComment() {
    this.setState({
      invalid: true
    });
    let rightNow = moment().format('DD/MM/YYYY HH:mm:ss');
    let data = {
      nation: this.props.nation,
      message: this.state.comment,
      createdOn: rightNow,
      event: this.props.event.key
    };
    const apiEndpoint = baseUrl + '/api/event/comment';

    let _this = this;
    axios.post(apiEndpoint, data).then(function (response) {
      console.log(response);
      _this.setState({
        comment: '',
        responseMsg: response.data,
        snackbarOpen: true
      });
    }).catch(function (error) {
      console.log(error);
      _this.setState({
        responseMsg: error.response.data,
        snackbarOpen: true
      });
    });
  }

  handleEdit() {
    this.setState({
      updateEvent: true
    });
  }

  handleDelete() {
    const apiEndpoint = baseUrl + '/api/event?event=' + this.props.event.key;

    let _this = this;
    axios.delete(apiEndpoint).then(function (response) {
      console.log(response);
      _this.setState({
        responseMsg: response.data,
        snackbarOpen: true
      });
    }).catch(function (error) {
      _this.setState({
        responseMsg: error.response.data,
        snackbarOpen: true
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
        updateInvalid: true
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
        updateInvalid: true
      });
    }
  }

  handleEventChannelChange(event, value) {
    this.setState({
      eventChannel: value
    }, this.isFormValid);
  }

  isUpdateFormValid() {
    if (this.state.eventTitle && this.state.eventDescription && this.state.eventChannel) {
      this.setState({
        updateInvalid: false
      });
    }
  }

  handleClose() {
    this.setState({
      updateEvent: false
    });
  }

  updateEvent() {
    const apiEndpoint = baseUrl + '/api/event';

    let data = {
      eventKey: this.state.eventKey,
      eventTitle: this.state.eventTitle,
      eventDescription: this.state.eventDescription,
      eventChannel: this.state.eventChannel
    };

    let _this = this;
    axios.patch(apiEndpoint, data).then(function (response) {
      console.log(response);
      _this.setState({
        updateEvent: false,
        responseMsg: response.data,
        snackbarOpen: true
      });
    }).catch(function (error) {
      _this.setState({
        updateEvent: false,
        responseMsg: error.response.data,
        snackbarOpen: true
      });
    });
  }

  handleSnackbarClose() {
    this.setState({
      snackbarOpen: false
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
        label="Update"
        primary
        onTouchTap={this.updateEvent}
        disabled={this.state.updateInvalid}
      />
    ];
    return (
      <div>
        <Snackbar
          open={this.state.snackbarOpen}
          message={this.state.responseMsg}
          autoHideDuration={3000}
          onRequestClose={this.handleSnackbarClose}
        />
        <Dialog open={this.state.updateEvent} title="Update an event..." actions={actions}>
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
                  defaultValue={this.state.eventTitle}
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
                  defaultValue={this.state.eventDescription}
                  style={{ width: '100%' }}
                  rows={4}
                  rowsMax={10}
                  multiLine />
              </Col>
            </Row>
            <Row center="md" style={{ paddingTop: '15px' }}>
              <Col md mdOffset={4}>
                <RadioButtonGroup onChange={this.handleEventChannelChange} style={{ width: '50%' }} name="channel" defaultSelected="general" valueSelected={this.state.eventChannel}>
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
        <Card>
          <CardHeader
            title={this.state.eventTitle}
            subtitle={this.state.subtitle}
            avatar={this.state.flag}
            style={{ width: '100%' }}
          />
          <CardText style={{ textAlign: 'left' }}><Markdown source={this.state.eventDescription} /></CardText>
          <div>
            <Badge
              badgeContent={this.state.comments.length}
              secondary
              badgeStyle={{ top: 12, right: 12 }}
            >
              <IconButton tooltip="Notifications" onTouchTap={this.expand}>
                <CommentIcon />
              </IconButton>
            </Badge>
            <IconMenu
              iconButtonElement={<IconButton><SettingsIcon /></IconButton>}
              anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            >
              <MenuItem primaryText="Edit" disabled={this.state.shouldBeDisabled} onTouchTap={this.handleEdit} />
              <MenuItem primaryText="Delete" disabled={this.state.shouldBeDisabled} onTouchTap={this.handleDelete} />
            </IconMenu>
          </div>
          {
            (this.props.nation) ? (
              <Grid fluid style={{ paddingTop: '15px', paddingBottom: '15px' }}>
                <Row style={{ borderStyle: 'solid', borderWidth: '1px', borderColor: 'rgb(232, 232, 232)' }}>
                  <Col md={6} sm={6} xs={12}>
                    <TextField hintText="Comment"
                      onChange={this.handleUpdateComment}
                      validate={['required']}
                      errorText="Please enter a comment"
                      style={{ width: '100%', height: '100%' }} />
                  </Col>
                  <Col md={6} sm={6} xs={12}>
                    <RaisedButton style={{ width: '100%' }} onTouchTap={this.newComment} disabled={this.state.invalid} primary label="Comment" />
                  </Col>
                </Row>
              </Grid>
            ) : (
                null
              )
          }
        </Card>
        {
          this.state.comments.map((comment) => {
            let nation = comment.nation.replace(new RegExp('_', 'g'), ' ');
            nation = nation.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
            return (
              <Card key={comment.key} expandable expanded={this.state.expanded} initiallyExpanded={false}>
                <CardText expandable><b>{nation} - {comment.createdOn}</b><br /><Markdown source={comment.message} /></CardText>
              </Card>
            );
          })
        }
      </div>
    );
  }
}

Event.propTypes = {
  event: PropTypes.object.isRequired,
  nation: PropTypes.string,
  isAdmin: PropTypes.bool
};

export default Event;
