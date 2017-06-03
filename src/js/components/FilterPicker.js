import React, { Component, PropTypes } from 'react';
import sizeMe from 'react-sizeme';
import { Col } from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import RemoveRedEyeIcon from 'material-ui/svg-icons/image/remove-red-eye';
import LanguageIcon from 'material-ui/svg-icons/action/language';
import DescriptionIcon from 'material-ui/svg-icons/action/description';
import EventIcon from 'material-ui/svg-icons/action/event';

class SizeAwareCol extends Component {
  render() {
    return (
      <Col xs={this.props.xs} sm={this.props.sm} md={this.props.md} lg={this.props.lg} xsOffset={this.props.xsOffset} smOffset={this.props.smOffset} mdOffset={this.props.mdOffset} lgOffset={this.props.lgOffset}>
        <Paper style={{ height: '240px', marginTop: '15px', position: 'fixed', width: this.props.size.width }}>
          <MenuItem><b><u>Channels</u></b></MenuItem>
          <Divider />
          <MenuItem rightIcon={<EventIcon />} disabled={this.props.selectedGeneral} onTouchTap={this.props.generalSelected}>General Affairs</MenuItem>
          <MenuItem rightIcon={<DescriptionIcon />} disabled={this.props.selectedInternalAffairs} onTouchTap={this.props.internalAffairsSelected}>Internal Affairs</MenuItem>
          <MenuItem rightIcon={<LanguageIcon />} disabled={this.props.selectedInternationalAffairs} onTouchTap={this.props.internationalAffairsSelected}>International Affairs</MenuItem>
          <Divider />
          <MenuItem rightIcon={<RemoveRedEyeIcon />} disabled={this.props.selectedAll} onTouchTap={this.props.allSelected}>View All</MenuItem>
        </Paper>
      </Col>
    );
  }
}

SizeAwareCol.propTypes = {
  size: PropTypes.object,
  xs: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,
  xsOffset: PropTypes.number,
  smOffset: PropTypes.number,
  mdOffset: PropTypes.number,
  lgOffset: PropTypes.number,
  generalSelected: PropTypes.func.isRequired,
  internalAffairsSelected: PropTypes.func.isRequired,
  internationalAffairsSelected: PropTypes.func.isRequired,
  allSelected: PropTypes.func.isRequired,
  selectedGeneral: PropTypes.bool.isRequired,
  selectedInternalAffairs: PropTypes.bool.isRequired,
  selectedInternationalAffairs: PropTypes.bool.isRequired,
  selectedAll: PropTypes.bool.isRequired
};

export default sizeMe()(SizeAwareCol);
