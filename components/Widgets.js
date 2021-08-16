import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import React, { Component, useState } from 'react';
import { Column, columnStyle, fitStyle, flexAutoStyle, Flexer, Middle, pointerEventsAutoStyle, pointerEventsNoneStyle, Row, Wrapper, ZStack, zStackElementStyle, zStackStyle } from './Layout';
import { Icon } from './Icon';

import { ClickablePanel } from './ClickablePanel';
import { iconSize, panelBorderRightStyle, panelPadding, panelPaddingStyle, panelStyle, SelectionBase, sidePanelWidth, Spacer, transparentBlue, transparentGray } from './Style';
import { icons } from './Icons';

export function MenuItem({image, text, onClick}) {
  return (
    <ClickablePanel mouseOverBackgroundColor={transparentBlue(0.1)} callback={onClick}>
      <Row>
        <Icon style={{marginRight: "0.5em"}} image={image}/>
        <Text style={{lineHeight: iconSize}}>{text}</Text>
      </Row>
    </ClickablePanel>
  ); 
}

export function LargeMenuItem({image, text, onClick}) {
  return (
    <ClickablePanel mouseOverBackgroundColor={transparentBlue(0.1)} callback={onClick}>
      <Row>
        <Icon size={iconSize*1.5} style={{marginRight: "0.5em"}} image={image}/>
        <Text style={{lineHeight: text.length < 20 ? iconSize*1.5 : 20}}>{text}</Text>
      </Row>
    </ClickablePanel>
  ); 
}

export function Chip({style, text, onDelete}) {
  return (
    <Row style={{...panelStyle, padding:5, marginBottom: 3, marginRight: 3, ...style}}>
      <Text key={"text"} style={{...flexAutoStyle, marginRight: "0.5em",  overflow:"visible", lineHeight: 15}}>{text}</Text>
      <ClickablePanel style={flexAutoStyle}
        callback={() => onDelete()}>
        <Middle style={fitStyle} key={"cross"}>
          <Icon size={10} image={icons.cross}/>
        </Middle>
      </ClickablePanel>
    </Row>
  );
}
