import React, { PropTypes } from 'react';
import { Card, CardHeader, CardMedia, CardText } from 'material-ui/Card';

class GovMember extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card style={{ paddingLeft: '10px', paddingRight: '10px' }}>
        <CardHeader title={this.props.name} subtitle={this.props.position} />
        <CardMedia>
          <img height="100%" width="100%" src={this.props.imgSrc} />
        </CardMedia>
        <CardText>
          {this.props.description}
        </CardText>
      </Card>
    );
  }
}

GovMember.propTypes = {
  name: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  imgSrc: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default GovMember;
