import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import validator from 'validator';

class ValidatedTextField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: false,
      errorText: this.props.errorText
    };

    this.onBlur = this.onBlur.bind(this);
  }

  onBlur(event) {
    let value = event.target.value;
    let showErrors = false;
    this.props.validate.forEach(function (element) {
      switch (element) {
      case 'required':
        showErrors = validator.isEmpty(value);
        break;
      case 'isNumber':
        showErrors = !validator.isNumeric(value);
        break;
      case 'isEmail':
        showErrors = !validator.isEmail(value);
        break;
      default:
        break;
      }
    }, this);
    if (showErrors) {
      this.setState({ errors: true });
      this.props.onChange(true, value);
    } else {
      this.setState({ errors: false });
      this.props.onChange(false, value);
    }
  }

  render() {
    console.log(this.props.rows);
    console.log(this.props.rowsMax);
    console.log(this.props.multiLine);
    return (
      <TextField
        defaultValue={this.props.defaultValue}
        hintText={this.props.hintText}
        multiLine={this.props.multiLine}
        rows={this.props.rows}
        rowsMax={this.props.rowsMax}
        errorText={this.state.errors ?
          (this.state.errorText) :
          (null)
        }
        onBlur={this.onBlur}
        style={this.props.style}
        name={this.props.name} />
    );
  }
}

ValidatedTextField.propTypes = {
  hintText: PropTypes.string,
  style: PropTypes.object,
  errorText: PropTypes.string.isRequired,
  validate: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  name: PropTypes.string,
  rows: PropTypes.number,
  rowsMax: PropTypes.number,
  multiLine: PropTypes.bool
};

export default ValidatedTextField;
