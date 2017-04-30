import React from 'react';
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
  name: React.PropTypes.string.isRequired,
  position: React.PropTypes.string.isRequired,
  imgSrc: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired
};

export default GovMember;
