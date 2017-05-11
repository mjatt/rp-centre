import React, { PropTypes } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import { connect } from 'react-firebase';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { Card, CardHeader, CardText } from 'material-ui/Card';

class Events extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      events: []
    };
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

  render() {
    if (this.state.loading) {
      return (
        <Grid fluid>
          <Row center="md" style={{ paddingTop: '15px' }}>
            {
              (this.props.nation) ? (
                <Col md>
                  <RaisedButton style={{ width: '75%' }} backgroundColor="rgb(232, 232, 232)" label="Create new event" />
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
        </Grid>
      );
    }
    return (
      <Grid fluid>
        <Row center="md" style={{ paddingTop: '15px' }}>
          {
            (this.props.nation) ? (
              <Col md>
                <RaisedButton style={{ width: '75%' }} backgroundColor="rgb(232, 232, 232)" label="Create new event" />
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
