import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';

class GovernmentDisplay extends React.Component {
  render() {
    return (
      <Grid fluid>
        <Row center="xs" className="defaultRow">
          <Col>
            <h2>Norrland Government</h2>
          </Col>
        </Row>
        <Row center="xs">
          <Col>
            <p>Breif overview of what each government does.</p>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default GovernmentDisplay;
