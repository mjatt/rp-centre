import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import ShopItem from './ShopItem';

class ShopCategory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      quantity: 0,
      invalid: true
    };

    this.handleExpandedChange = this.handleExpandedChange.bind(this);
    this.handleUpdateQuantity = this.handleUpdateQuantity.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
  }

  handleExpandedChange() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  handleUpdateQuantity(errors, values) {
    if (!errors) {
      this.setState({
        quantity: values
      }, this.isFormValid);
    } else {
      this.setState({
        invalid: true
      });
    }
  }

  isFormValid() {
    if (this.state.quantity && this.state.quantity > 0) {
      this.setState({
        invalid: false
      });
    }
  }

  render() {
    return (
      <Card expandable initiallyExpanded expanded={this.state.expanded} onExpandChange={this.handleExpandedChange}>
        <CardHeader
          title={this.props.categoryName}
          actAsExpander
          showExpandableButton
        />
        <Divider />
        {
          this.props.items.map((item) => {
            return (
              <CardText expandable> key={item.itemName}>
                <ShopItem item={item} basket={this.props.basket}/>
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
  categoryName: PropTypes.string.isRequired,
  basket: PropTypes.array.isRequired
};

export default ShopCategory;
