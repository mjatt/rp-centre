import React, { PropTypes } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

class Events extends React.Component {
  render() {
    return (
      <Grid fluid>
        <Row center="md" style={{paddingTop: '15px'}}>
          {
            (this.props.nation) ? (
              <h2>You are logged in!</h2>
            ) : (
                <Col md>
                  <Link to="/register">
                    <RaisedButton style={{ width: '100%' }} label="Log in" primary />
                  </Link>
                </Col>
              )
          }
        </Row>
      </Grid>
    );
  }
}

Events.propTypes = {
  nation: PropTypes.string
};

export default Events;
