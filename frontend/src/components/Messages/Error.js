import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { closeError } from "../../store/actions/messages";

export class Error extends Component {
  static propTypes = {
    general: PropTypes.object.isRequired,
    closeError: PropTypes.func.isRequired
  };

  render() {
    const { errors } = this.props.general;
    const isError = errors.length > 0;
    let content;
    if (isError) {
      content = errors.map(item => (
        <li key={item} className="errors__item">
          {item}
          <i
            className="far fa-times-circle errors__close"
            onClick={this.props.closeError.bind(this, item)}
          />
        </li>
      ));
    }

    return <ul className="errors">{content}</ul>;
  }
}

const mapStateToProps = state => ({
  general: state.general
});

export default connect(
  mapStateToProps,
  { closeError }
)(Error);
