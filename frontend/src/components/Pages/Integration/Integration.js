import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import FilesList from "./FilesList";
import SheetsList from "./SheetsList";

class Integration extends Component {
  static propTypes = {
    integration: PropTypes.object.isRequired
  };

  render() {
    const { stage } = this.props.integration;

    return (
      <div className="integration">
        <h1 className="display-4 text-center mb-4">Integration</h1>

        {stage === 1 && <FilesList />}
        {stage === 2 && <SheetsList />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  integration: state.integration
});

export default connect(
  mapStateToProps,
  {}
)(Integration);
