import React, { PropTypes, Component } from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import CommentIcon from 'material-ui/svg-icons/communication/comment';
import { Grid, Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from './ValidatedTextField';
import axios from 'axios';
import moment from 'moment';

class Event extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      invalid: true,
      comment: ''
    };

    this.expand = this.expand.bind(this);
    this.handleUpdateComment = this.handleUpdateComment.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
    this.newComment = this.newComment.bind(this);
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
    let rightNow = moment().format('DD/MM/YYYY');
    let data = {
      nation: this.props.nation,
      message: this.state.comment,
      createdOn: rightNow,
      event: this.props.event.key
    };

    const baseUrl = process.env.WEBSITE_URL || 'http://localhost:3000';
    const apiEndpoint = baseUrl + '/api/event/comment';

    let _this = this;
    axios.post(apiEndpoint, data).then(function (response) {
      console.log(response);
      _this.setState({
        createEvent: false
      });
    }).catch(function (error) {
      console.log(error);
    });
  }

  render() {
    let subtitle = this.props.event.createdBy + ' - Created On: ' + this.props.event.createdOn + ' - Channel: ' + this.props.event.channel;
    return (
      <div>
        <Card>
          <CardHeader
            title={this.props.event.title}
            subtitle={subtitle}
            avatar={this.props.event.flag}
          />
          <CardText>{this.props.event.description}</CardText>
          <Badge
            badgeContent={this.props.event.comments.length}
            secondary
            badgeStyle={{ top: 12, right: 12 }}
          >
            <IconButton tooltip="Notifications" onTouchTap={this.expand}>
              <CommentIcon />
            </IconButton>
          </Badge>
          {
            (this.props.nation) ? (
              <Grid fluid style={{ paddingTop: '15px' }}>
                <Row style={{borderStyle: 'solid', borderWidth: '1px', borderColor: 'rgb(232, 232, 232)'}}>
                  <Col md>
                    <TextField hintText="Comment"
                      onChange={this.handleUpdateComment}
                      validate={['required']}
                      errorText="Please enter a comment"
                      style={{ width: '100%', height: '100%'}} />
                  </Col>
                  <Col md>
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
          this.props.event.comments.map((comment) => {
            return (
              <Card key={comment.message} expandable expanded={this.state.expanded} initiallyExpanded={false}>
                <CardText expandable><b>{comment.nation} - {comment.createdOn}</b><br />{comment.message}</CardText>
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
  nation: PropTypes.string
};

export default Event;
