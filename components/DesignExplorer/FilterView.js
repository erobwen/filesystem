import React, { useState } from 'react';
import { Flexer, Row } from '../Layout';
import { iconSize, panelBorderBottomStyle, panelPaddingStyle, transparentBlue } from '../Style';
import { Placeholder } from './DesignExplorer';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import folderImage from '../../assets/folder_outline.svg';
import { Icon } from '../Icon';
import { icons } from '../Icons';
import { ClickablePanel } from '../ClickablePanel';
import { log, loge, logg } from '../utility/Debug';
import { observer } from 'mobx-react';


function IconButton({style, image, iconWidth, onClick, callbackKey}) {
  return(
    <ClickablePanel style={style} mouseOverBackgroundColor={transparentBlue(0.1)} callback={onClick} callbackKey={callbackKey}>
      <Icon size={iconSize} width={iconWidth} image={image}/>
    </ClickablePanel>
  );
}

export const FilterView = observer(function({style, explorerModel}) {
  const filter = explorerModel.filter;
  log(explorerModel.displayItems)
  if (filter === null) {
    return null;
  } else {
    return (
      <Row style={{...panelBorderBottomStyle, ...panelPaddingStyle, ...style}}>
        <Icon key="fie" size={iconSize} style={{marginRight: "0.5em"}} image={icons.filterBlue}/>
        <Text key="bar" style={{lineHeight: iconSize}}>{explorerModel.filter.toEquationString()}</Text>
        <Flexer/>
        {
          explorerModel.selectedFolder.children.length === 0 || ["sorted", "splitView"].contains(explorerModel.displayItems) ? 
          null 
          :
          <Row>
            <IconButton key="unsorted" style={{display: (explorerModel.displayItems === "all") ? "inherit" : "none"}} 
              image={icons.unsorted} 
              onClick={() => {explorerModel.displayItems = "unsorted"}}/>
            <IconButton key="unsorted_and_sorted" style={{display: (explorerModel.displayItems === "unsorted") ? "inherit" : "none"}} 
              iconWidth={Math.floor(2.5*iconSize)} image={icons.unsortedAndSorted} 
              onClick={() => {explorerModel.displayItems = "all"}}/>
          </Row>
        }
      </Row>
    )  
  }
});
