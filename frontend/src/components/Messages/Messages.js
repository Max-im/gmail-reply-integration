import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

export class Messages extends Component {
  render() {
    const { success, errors } = this.props.messages;

    return (
      <div className="messages">
        {success && (
          <h3 className="bg-success text-light messages__item">{success}</h3>
        )}
        {errors && (
          <h3 className="bg-danger text-light messages__item">{errors}</h3>
        )}
      </div>
    );
  }
}

Messages.propTypes = {
  messages: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  messages: state.messages
});

export default connect(
  mapStateToProps,
  {}
)(Messages);
