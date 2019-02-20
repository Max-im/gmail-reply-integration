import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { closeSuccess } from "../../store/actions/messages";

export class Success extends Component {
  static propTypes = {
    general: PropTypes.object.isRequired,
    closeSuccess: PropTypes.func.isRequired
  };

  render() {
    const { success } = this.props.general;
    return (
      <div className="success">
        {success && (
          <p className="success__item">
            {success}
            <i
              className="far fa-times-circle success__close"
              onClick={this.props.closeSuccess}
            />
          </p>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  general: state.general
});

export default connect(
  mapStateToProps,
  { closeSuccess }
)(Success);
