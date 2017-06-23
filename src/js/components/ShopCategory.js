import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardText } from 'material-ui/Card';

class ShopCategory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };

    this.handleExpandedChange = this.handleExpandedChange.bind(this);
  }

  handleExpandedChange() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    return (
      <Card expandable initiallyExpanded expanded={this.state.expanded} onExpandChange={this.handleExpandedChange}>
        <CardHeader
          title={this.props.categoryName}
          actAsExpander
          showExpandableButton
        />
        {
          this.props.items.map((item) => {
            return (
              <CardText expandable key={item.itemName}>
                <p>{item.itemName}</p>
                <p>{item.itemPPU}</p>
              </CardText>
            );
          })
        }
      </Card>
    );
  }
}

ShopCategory.propTypes = {
  items: PropTypes.array.isRequired,
  categoryName: PropTypes.string.isRequired
};

export default ShopCategory;
