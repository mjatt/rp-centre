import React, { PropTypes, Component } from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import CommentIcon from 'material-ui/svg-icons/communication/comment';

class Event extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };

    this.expand = this.expand.bind(this);
  }

  expand() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    let subtitle = this.props.event.createdBy + ' - Created On: ' + this.props.event.createdOn + ' - Channel: ' + this.props.event.channel;
    return (
      <div>
        <Card>
          <CardHeader
            title={this.props.event.title}
            subtitle={subtitle}
            avatar={this.props.event.flag}
          />
          <CardText>{this.props.event.description}</CardText>
          <Badge
            badgeContent={this.props.event.comments.length}
            secondary
            badgeStyle={{ top: 12, right: 12 }}
          >
            <IconButton tooltip="Notifications" onTouchTap={this.expand}>
              <CommentIcon />
            </IconButton>
          </Badge>
        </Card>
        {
          this.props.event.comments.map((comment) => {
            return (
              <Card key={comment.message} expandable expanded={this.state.expanded} initiallyExpanded={false}>
                <CardText expandable><b>{comment.nation}</b><br />{comment.message}</CardText>
              </Card>
            );
          })
        }
      </div>
    );
  }
}

Event.propTypes = {
  event: PropTypes.object.isRequired
};

export default Event;
