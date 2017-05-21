import React, { PropTypes } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Link } from 'react-router-dom';
import { connect } from 'react-firebase';

import RefreshIndicator from 'material-ui/RefreshIndicator';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardHeader, CardText } from 'material-ui/Card';

class Events extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      events: [],
      createEvent: false
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.createEvent = this.createEvent.bind(this);
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
        onTouchTap={this.handleClose}
      />
    ];
    return (
      <div>
        <Dialog open={this.state.createEvent} title="Create an event..." actions={actions} modal>
          <Grid fluid>
            <Row center="md">
              <Col md>
                <p>Please fill out the following fields</p>
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
