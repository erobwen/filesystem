import React, { Component, useState } from 'react';

import { iconSize, panelBorderRightStyle, panelPadding, SelectionBase, sidePanelWidth, transparentBlue, transparentGray } from './Style';
import { log, loge, logg } from './utility/Debug';

export class DropTarget extends React.Component {
  constructor(props) {
    super(props);
    this.myDiv = React.createRef();
  }

  componentDidMount() {
    const me = this;
    log(this.myDiv.current);
    const panel = this.myDiv.current;
    const mouseOverBackgroundColor = transparentBlue(0.1)
    let counter = 0;
    const {onDragEnter, onDragLeave} = this.props;

    me.setMouseoverColor = function() {
      counter++;
      if (counter === 1) {
        if (onDragEnter) onDragEnter();
        loge("add")
        if (mouseOverBackgroundColor) {
          // panel.style["transition"] = "background-color 0.15s";
          panel._savedBackgroundColor = panel.style["background-color"];
          panel.style["background-color"] = mouseOverBackgroundColor;            
        }
      }
    }
    panel.addEventListener("dragenter", me.setMouseoverColor);
    
    me.removeMouseoverColor = function() {
      counter--;
      if (counter === 0) {
        if (onDragLeave) onDragLeave();
        loge("remove")
         if (mouseOverBackgroundColor) {
          panel.style["background-color"] = panel._savedBackgroundColor; //"rgba(0, 0, 0, 0)";
        }
        // delete panel.style["background-color"]; // Note: Does not work in IE
        // panel.style["background-color"] = null; // Note: Does not work in IE
      }
    }
    panel.addEventListener("dragleave", me.removeMouseoverColor);
  }

  componentWillUpdate(nextProps, nextState) {}

  componentWillUnmount() {
    this.clearEventListeners();
  }

  clearEventListeners() {
    // Clear old listeners
    const panel = this.myDiv.current;
    if (this.setMouseoverColor) {
      panel.removeEventListener("dragenter", this.setMouseoverColor);
    }
    if (this.removeMouseoverColor) {
      panel.removeEventListener("dragleave", this.removeMouseoverColor);
    }
  }

  render() {
    const me = this;
    const {style, children, onDrop} = this.props
    return ( 
      <div ref={this.myDiv} id="DropTarget" style={style}
        onDragOver={(event) => { event.preventDefault();}} 
        // onDragEnter={(event) => {() => me.setMouseoverColor()}} 
        // onDragLeave={(event) => {() => me.removeMouseoverColor()}}
        onDrop={(event) => { me.removeMouseoverColor(); onDrop(event)} } 
        children={children}/>
    );
  }
}