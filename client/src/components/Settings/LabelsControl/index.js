import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getLabels, toggleCheck } from "../../../store/actions/labels";
import "./style.scss";

export class LabelsContorl extends Component {
  componentDidMount() {
    this.props.getLabels();
  }

  static propTypes = {
    labels: PropTypes.object.isRequired,
    getLabels: PropTypes.func.isRequired,
    toggleCheck: PropTypes.func.isRequired
  };

  render() {
    const { labels, inProcess, error } = this.props.labels;
    return (
      <section className="container section labels" data-test="labels">
        <h3
          className="bg-secondary text-center rounded text-white page__subtitle"
          data-test="labels__subtitle"
        >
          Labels Control
        </h3>
        {!inProcess && (
          <ul className="labels__list" data-test="labels__list">
            <li className="labels__item labels__headerItem">
              <b className="labels__number labels__header">#</b>
              <b className="labels__name labels__header">Name</b>
            </li>
            {labels.map((label, i) => (
              <li
                key={label._id}
                onClick={this.props.toggleCheck.bind(this, label._id)}
                data-test="labels__item"
                className={
                  (label.checked && "labels__item_active") + " labels__item"
                }
              >
                <p className="labels__number">{i + 1}</p>
                <p className="labels__name" data-test="labels__name">
                  {label.name}
                </p>
              </li>
            ))}
          </ul>
        )}
        {error && (
          <p className="error labels__error" data-test="labels__error">
            {error}
          </p>
        )}
      </section>
    );
  }
}

const mapStateToProps = state => ({
  labels: state.labels
});

export default connect(
  mapStateToProps,
  { getLabels, toggleCheck }
)(LabelsContorl);
