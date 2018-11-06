import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  getLabels,
  addLabelToBlackList,
  removeLabelFromBlackList
} from "../../actions/settingsActions";

export class LabelsContorl extends Component {
  componentDidMount() {
    this.props.getLabels();
  }

  render() {
    const { labels, blacklist } = this.props.settings;
    let content, blackListContent;

    if (labels) {
      content = labels.sort().map(item => (
        <li
          className="labels__item"
          key={item}
          onClick={this.props.addLabelToBlackList.bind(this, item)}
        >
          {item}
        </li>
      ));
    }
    if (blacklist.length > 0) {
      blackListContent = blacklist
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map(item => (
          <li
            className="labels__item"
            key={item._id}
            onClick={this.props.removeLabelFromBlackList.bind(this, item._id)}
          >
            {item.name}
          </li>
        ));
    }

    return (
      <div className="container">
        <h3 className="bg-info text-center rounded text-white settings__title">
          Labels Control
        </h3>
        <h5>All labels</h5>
        <ul className="labels">{content}</ul>

        <h5>Black list</h5>
        <ul className="labels">{blackListContent}</ul>
      </div>
    );
  }
}

LabelsContorl.propTypes = {
  settings: PropTypes.object.isRequired,
  getLabels: PropTypes.func.isRequired,
  addLabelToBlackList: PropTypes.func.isRequired,
  removeLabelFromBlackList: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  settings: state.settings
});

export default connect(
  mapStateToProps,
  { getLabels, addLabelToBlackList, removeLabelFromBlackList }
)(LabelsContorl);
