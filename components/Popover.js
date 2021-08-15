import React, { Component, useState } from 'react';
import { CenterMiddle, Column, fitStyle, flexAutoStyle, Flexer, Middle, pointerEventsAutoStyle, pointerEventsNoneStyle, Row, Wrapper, ZStack, zStackElementStyle, zStackStyle } from './Layout';
import { iconSize, panelBorderRightStyle, panelPadding, panelStyle, SelectionBase, sidePanelWidth, transparentBlue, transparentGray } from './Style';
import { Portal, PortalProvider, PortalHost } from '@gorhom/portal';
import { log, loge, trace } from './utility/Debug';

export let modalLayer = 1;



export class Popover extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.open && this.props.open) { // Just opened
      modalLayer++;
    }
    if (prevProps.open && !this.props.open) { // Just closed
      modalLayer--;
    }
  }

  componentWillUnmount() {}

  render() {
    const {open, close, bounds, render} = this.props;
    if (!open) return null;
    const popover = (
      <div style={{
        ...fitStyle, 
        backgroundColor:"rgba(0,0,0,0)", 
        position: "fixed", 
        top:0, 
        left: 0,
        pointerEvents: "none",
        display: open ? "initial" : "none"}}>
        <div style={{
          position:"fixed", 
          top:bounds.top, 
          left:bounds.left, 
          width:bounds.width, 
          height:bounds.height, 
          pointerEvents: "auto",
          ...panelStyle}}>
          {render({style: fitStyle, bounds})}
        </div>
        <PortalHost name={"ModalLayer" + (modalLayer + 1)} />
      </div>);
  
    return <Portal hostName={"ModalLayer" + modalLayer}>{popover}</Portal>
  }
}


export class ModalPopover extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.open && this.props.open) { // Just opened
      modalLayer++;
    }
    if (prevProps.open && !this.props.open) { // Just closed
      modalLayer--;
    }
  }

  componentWillUnmount() {}

  render() {
    const {open, close, bounds, render} = this.props;
    if (!open) return null;
    const popover = (
      <div style={{
        ...fitStyle, 
        backgroundColor:"rgba(0,0,0,0)", 
        position: "fixed", 
        top:0, 
        left: 0, 
        display: open ? "initial" : "none"}}
        onClick={() => {loge("close on ModalPopover background"); close()}}>
        <div style={{
          position:"fixed", 
          top:bounds.top, 
          left:bounds.left, 
          width:bounds.width, 
          height:bounds.height, 
          ...panelStyle}}>
          {render({style: fitStyle, bounds})}
        </div>
        <PortalHost name={"ModalLayer" + (modalLayer + 1)} />
      </div>);
  
    return <Portal hostName={"ModalLayer" + modalLayer}>{popover}</Portal>
  }
}


export function ModalDialog({open, close, render}) {
  if (!open) return null;
  const popover = (
    <div style={{
      ...fitStyle, 
      backgroundColor:"rgba(0,0,0,0.1)", 
      position: "fixed", 
      top:0, 
      left: 0, 
      display: open ? "initial" : "none"}}
      onClick={() => {loge("close on ModalDialog background"); close()}}>
      <CenterMiddle style={fitStyle}>
        {render({style: panelStyle})}
      </CenterMiddle>
      <PortalHost name={"ModalLayer" + (modalLayer + 1)} />
    </div>);

  return <Portal hostName={"ModalLayer" + modalLayer}>{popover}</Portal>
}

