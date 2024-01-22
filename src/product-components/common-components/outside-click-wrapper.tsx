// @ts-nocheck
import React, { Component, createRef } from "react";

export default class OutSideClickWrapper extends Component {
  wrapperRef = createRef();

  componentDidMount() {
    window.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    window.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (
      this.wrapperRef.current &&
      !this.wrapperRef.current.contains(event.target)
    ) {
      this.props.handleWrapperFunc(event);
    }
  };

  render() {
    return (
      <div
        ref={this.wrapperRef}
        style={this.props.styles ? this.props.styles : {}}
      >
        {this.props.children}
      </div>
    );
  }
}
