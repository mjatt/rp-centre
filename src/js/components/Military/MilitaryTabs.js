import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-firebase';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

import ShopTab from './ShopTab';
import MilitaryComparisonTab from './MilitaryComparisonTab';
import CurrentMilitaryTab from './CurrentMilitaryTab';

class MilitaryCalculator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      nation: null,
      nationData: null,
      shopItems: null
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      nation: nextProps.nation,
      nationData: nextProps.nationData,
      shopItems: nextProps.shopItems,
      loading: false
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <Grid fluid>
          <Paper style={{ marginTop: '15px', paddingTop: '5px', paddingBottom: '5px' }}>
            <Row center="md">
              <Col md>
                Loading data...
              </Col>
            </Row>
            <Row center="md" style={{ paddingTop: '10px' }}>
              <Col md>
                <RefreshIndicator
                  size={60}
                  left={10}
                  top={0}
                  status="loading"
                  style={{ display: 'inline-block', position: 'relative' }}
                />
              </Col>
            </Row>
          </Paper >
        </Grid>
      );
    }
    if (this.props.nation) {
      return (
        <Tabs>
          <Tab label="My Current Military">
            <CurrentMilitaryTab nationData={this.state.nationData} nation={this.state.nation} />
          </Tab>
          <Tab label="Budget Calculator & Shop">
            <ShopTab shopItems={this.state.shopItems} nationData={this.state.nationData} nation={this.state.nation} />
          </Tab>
          <Tab label="Military Comparator">
            <MilitaryComparisonTab nationData={this.state.nationData} />
          </Tab>
        </Tabs>
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
  nationData: PropTypes.object,
  shopItems: PropTypes.object
};

const mapFirebaseToProps = {
  nationData: 'nations',
  shopItems: 'shop-items'
};

export default connect(mapFirebaseToProps)(MilitaryCalculator);
