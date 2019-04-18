import React, { Component } from "react";

export default class InfoItem extends Component {
  state = {
    isReady: false
  };

  componentDidMount() {
    setTimeout(() => this.setState({ isReady: true }), 100);
    setTimeout(() => this.setState({ isReady: false }), 5000);
  }

  render() {
    const { item } = this.props;
    return (
      <li
        className={
          this.state.isReady ? "info__item info__item_active" : "info__item"
        }
      >
        {item}
      </li>
    );
  }
}
