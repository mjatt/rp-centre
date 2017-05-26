import React, { PropTypes, Component } from 'react';

class MilitaryCalculator extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <h1>Hello world!</h1>
    );
  }
}

MilitaryCalculator.propTypes = {
  nation: PropTypes.string
};

export default MilitaryCalculator;
