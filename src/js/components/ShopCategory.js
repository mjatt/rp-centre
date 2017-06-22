import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader } from 'material-ui/Card';

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
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandedChange}>
        <CardHeader
          title={this.props.categoryName}
          actAsExpander
          showExpandableButton
        />
        {
          this.props.items.map((item) => {
            return (
              <div>
              <p>{item.itemName}</p>
              <p>{item.itemPPU}</p>
              </div>
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
