import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';

class MilitaryComparison extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Grid fluid>
          <Row center="md">
            <Col md>
              <h2>Coming soon...</h2>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

MilitaryComparison.propTypes = {
  nationData: PropTypes.object
};

export default MilitaryComparison;
