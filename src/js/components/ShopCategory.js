import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { Grid, Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import AddShoppingIcon from 'material-ui/svg-icons/action/add-shopping-cart';
import Divider from 'material-ui/Divider';

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
        <Divider />
        {
          this.props.items.map((item) => {
            return (
              <CardText expandable key={item.itemName}>
                <Grid fluid>
                  <Row>
                    <Col md>
                      <p><b>Item Name:</b> {item.itemName}</p>
                    </Col>
                    <Col md>
                      <p><b>Item Cost:</b> {item.itemPPU}</p>
                    </Col>
                    <Col md>
                      <RaisedButton icon={<AddShoppingIcon />} secondary />
                    </Col>
                  </Row>
                </Grid>
                <Divider style={{ marginTop: '5px' }} />
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
