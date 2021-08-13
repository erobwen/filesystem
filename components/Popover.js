import React, { Component, useState } from 'react';
import { Column, fitStyle, flexAutoStyle, Flexer, pointerEventsAutoStyle, pointerEventsNoneStyle, Row, Wrapper, ZStack, zStackElementStyle, zStackStyle } from './Layout';
import { iconSize, panelBorderRightStyle, panelPadding, panelStyle, SelectionBase, sidePanelWidth, transparentBlue, transparentGray } from './Style';
import { Portal, PortalProvider, PortalHost } from '@gorhom/portal';

export let modalLayer = 1;

export function Popover({open, close, bounds, render}) {
  if (!open) return null;
  const popover = (
    <div style={{...fitStyle, backgroundColor:"rgba(0,0,0,0)", position: "fixed", top:0, left: 0, display: open ? "initial" : "none"}}
      onClick={() => close()}>
      <div style={{
        position:"fixed", 
        top:bounds.top, 
        left:bounds.left, 
        width:bounds.width, 
        height:bounds.height, 
        ...panelStyle}}>
        {render({style: fitStyle, bounds})}
      </div>
    </div>);

  return <Portal hostName={"ModalLayer" + modalLayer}>{popover}</Portal>
}

