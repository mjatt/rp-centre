import React, { PropTypes, Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import { connect } from 'react-firebase';

class MilitaryCalculator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      budget: null
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    for (var key in nextProps.nationData) {
      if (nextProps.nationData.hasOwnProperty(key)) {
        if (key === nextProps.nation) {
          if (nextProps.nationData[key].budget !== 'undefined') {
            this.setState({
              budget: nextProps.nationData[key].budget
            });
          }
        }
      }
    }
  }

  render() {
    if (this.props.nation) {
      return (
        <Grid fluid>
          <Paper style={{ marginTop: '15px', paddingTop: '5px', paddingBottom: '5px' }}>
            {
              (this.state.budget) ? (
                <div>
                  <Row center="md">
                    <Col md>
                      Your current budget is {this.state.budget}
                    </Col>
                  </Row>
                  <Row center="md" style={{ paddingTop: '10px' }}>
                    <Col md>
                      <RaisedButton primary label="Recalculate Budget" onTouchTap={this.calculate} style={{ width: '90%' }} />
                    </Col>
                  </Row>
                </div>
              ) : (
                  <div>
                    <Row center="md">
                      <Col md>
                        You don't have a budget yet, calculate one!
                    </Col>
                    </Row>
                    <Row center="md" style={{ paddingTop: '10px' }}>
                      <Col md>
                        <RaisedButton primary label="Calculate Budget" onTouchTap={this.calculate} style={{ width: '90%' }} />
                      </Col>
                    </Row>
                  </div>
                )
            }
          </Paper >
        </Grid >
      );
    }
    return (
      <Grid fluid>
        <Paper style={{ marginTop: '15px', paddingTop: '5px', paddingBottom: '5px' }}>
          <Row center="md">
            <Col md>
              You need to be logged in to access this page...
          </Col>
          </Row>
          <Row center="md" style={{ paddingTop: '10px' }}>
            <Col md>
              <Link to="register">
                <RaisedButton label="Login" primary style={{ width: '90%' }} />
              </Link>
            </Col>
          </Row>
        </Paper >
      </Grid>
    );
  }
}

MilitaryCalculator.propTypes = {
  nation: PropTypes.string,
  nationData: PropTypes.object
};

const mapFirebaseToProps = {
  nationData: 'nations'
};

export default connect(mapFirebaseToProps)(MilitaryCalculator);
