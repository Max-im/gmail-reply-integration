import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { onLaunch } from "../../store/actions/integration";
import "./style.scss";

class Integration extends Component {
  componentDidMount() {
    const { sheetName, fileId } = this.props.match.params;
    this.props.onLaunch(fileId, sheetName);
  }

  static propTypes = {
    onLaunch: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="page">
        <h1 className="display-4 text-center page__title">Integration</h1>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { onLaunch }
)(withRouter(Integration));
