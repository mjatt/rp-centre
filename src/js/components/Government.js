import React, { PropTypes } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import GovMember from './GovernmentMember';
import { connect } from 'react-firebase';
import RefreshIndicator from 'material-ui/RefreshIndicator';

class GovernmentDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: true
    };
  }

  componentWillReceiveProps(nextProps) {
    let newData = [];
    for (var key in nextProps.data) {
      if (nextProps.data.hasOwnProperty(key)) {
        let member = {
          name: nextProps.data[key].name,
          position: key,
          imgSrc: nextProps.data[key].imgSrc,
          description: nextProps.data[key].description,
          key: key
        };
        newData.push(member);
      }
    }
    this.setState({ data: newData, loading: false });
  }

  render() {
    if (this.state.loading) {
      return (
        <Grid fluid>
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
        <Row center="xs" className="defaultRow">
          <Col>
            <h2>Norrland Government</h2>
          </Col>
        </Row>
        <Row center="xs" className="defaultRow">
          <Col>
            <p>A brief overview of what each Government member does.</p>
          </Col>
        </Row>
        <Row style={{ padding: '15 0 15 0' }}>
          {this.state.data.map((d) => {
            return (
              <Col md key={d.key}>
                <GovMember name={d.name} position={d.position} description={d.description} imgSrc={d.imgSrc} />
              </Col>
            );
          })}
        </Row>
      </Grid>
    );
  }
}

GovernmentDisplay.propTypes = {
  data: PropTypes.object
};

const mapFirebaseToProps = {
  data: 'gov'
};

export default connect(mapFirebaseToProps)(GovernmentDisplay);
