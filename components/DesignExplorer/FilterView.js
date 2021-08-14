import React, { useState } from 'react';
import { Flexer, Row } from '../Layout';
import { iconSize, panelBorderBottomStyle, panelPaddingStyle } from '../Style';
import { Placeholder } from './DesignExplorer';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import folderImage from '../../assets/folder_outline.svg';
import { Icon } from '../Icon';
import { icons } from '../Icons';
import { ClickablePanel } from '../ClickablePanel';
import { createDifferenceFilter } from '../../application/model/Filter';
import { log } from '../utility/Debug';


function IconButton({image, onClick, callbackKey}) {
  return(
    <ClickablePanel callback={onClick} callbackKey={callbackKey}>
      <Icon size={iconSize} image={icons.unsorted}/>
    </ClickablePanel>
  );
}

export function FilterView({style, filter, selectedFolder, setFilter}) {
  const targetFilter = createDifferenceFilter(filter, selectedFolder.children.map(child => child.filter)); 
  if (filter === null) {
    return null;
  } else {
    return (
      <Row style={{...panelBorderBottomStyle, ...panelPaddingStyle, ...style}}>
        <Icon key="fie" size={iconSize} style={{marginRight: "0.5em"}} image={icons.folderFilterBlue}/>
        <Text key="bar" style={{lineHeight: iconSize}}>{filter.toString()}</Text>
        <Flexer/>
        <IconButton key="foo" image={icons.unsorted} onClick={() => {log("click!"); log(targetFilter.toString());setFilter(targetFilter)}} callbackKey={targetFilter.toString()}/>
      </Row>
    )  
  }
}
