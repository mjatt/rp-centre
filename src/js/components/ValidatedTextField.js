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
    if (this.props.validate[0] === 'required') {
      let values = event.target.value;
      let showErrors = (this.props.validate[1]) ? validator.isEmail(values) : !validator.isEmpty(values);
      if (!showErrors) {
        this.setState({ errors: true });
        this.props.onChange(false, values);
      } else {
        this.setState({ errors: false });
        this.props.onChange(true, values);
      }
    }
  }

  render() {
    return (
      <TextField
        defaultValue={this.props.defaultValue}
        hintText={this.props.hintText}
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
  name: PropTypes.string
};

export default ValidatedTextField;
