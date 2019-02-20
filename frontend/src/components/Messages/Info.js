import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import InfoItem from "./InfoItem";

export class Info extends Component {
  static propTypes = {
    general: PropTypes.object.isRequired
  };

  render() {
    const { info } = this.props.general;

    return (
      <ul className="info">
        {info.map(item => (
          <InfoItem item={item} key={item} />
        ))}
      </ul>
    );
  }
}

const mapStateToProps = state => ({
  general: state.general
});

export default connect(mapStateToProps)(Info);
