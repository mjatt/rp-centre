import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import AddShoppingIcon from 'material-ui/svg-icons/action/add-shopping-cart';
import Divider from 'material-ui/Divider';
import TextField from './ValidatedTextField';
import Snackbar from 'material-ui/Snackbar';

class ShopItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quantity: 0,
      invalid: true,
      open: false,
      responseMsg: ''
    };

    this.handleUpdateQuantity = this.handleUpdateQuantity.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
    this.addToBasket = this.addToBasket.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
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

  addToBasket() {
    let item = {
      itemName: this.props.item.itemName,
      itemCost: this.props.item.itemPPU,
      quantity: this.state.quantity
    };
    this.props.basket.push(item);
    this.setState({
      responseMsg: 'Item successfully added to the basket...',
      open: true
    });
  }

  handleRequestClose() {
    this.setState({
      open: false
    });
  }

  render() {
    return (
      <div>
        <Snackbar
          open={this.state.open}
          message={this.state.responseMsg}
          autoHideDuration={10000}
          onRequestClose={this.handleRequestClose}
        />
        <Grid fluid>
          <Row>
            <Col md>
              <h5><b>Item Name:</b> {this.props.item.itemName}</h5>
            </Col>
            <Col md>
              <h5><b>Item Cost:</b> {this.props.item.itemPPU}</h5>
            </Col>
            <Col md>
              <TextField hintText="Quantity"
                onChange={this.handleUpdateQuantity}
                validate={['required', 'isNumber']}
                errorText="Please enter a numerical quantity..." />
            </Col>
            <Col md>
              <RaisedButton icon={<AddShoppingIcon />} secondary disabled={this.state.invalid} onTouchTap={this.addToBasket} />
            </Col>
          </Row>
        </Grid>
        <Divider style={{ marginTop: '5px' }} />
      </div>
    );
  }
}

ShopItem.propTypes = {
  item: PropTypes.object.isRequired,
  basket: PropTypes.array.isRequired
};

export default ShopItem;
