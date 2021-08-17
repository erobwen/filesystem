import React, { useState } from 'react';
import { Flexer, Row } from '../Layout';
import { iconSize, panelBorderBottomStyle, panelPaddingStyle, transparentBlue } from '../Style';
import { Placeholder } from './DesignExplorer';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import folderImage from '../../assets/folder_outline.svg';
import { Icon } from '../Icon';
import { icons } from '../Icons';
import { ClickablePanel } from '../ClickablePanel';
import { createDifferenceFilter } from '../../application/model/Filter';
import { log } from '../utility/Debug';
import { observer } from 'mobx-react';


function IconButton({style, image, iconWidth, onClick, callbackKey}) {
  return(
    <ClickablePanel style={style} mouseOverBackgroundColor={transparentBlue(0.1)} callback={onClick} callbackKey={callbackKey}>
      <Icon size={iconSize} width={iconWidth} image={image}/>
    </ClickablePanel>
  );
}

export const FilterView = observer(function({style, folderSelection}) {
  const filter = folderSelection.filter;
  const selectedFolder = folderSelection.selectedFolder;
  let targetFilter;
  const noUnsorted = selectedFolder.children.length === 0 || selectedFolder.filter === null;
  if (!noUnsorted) {
    log(selectedFolder.filter);
    log(selectedFolder.children.map(child => child.filter))
    if (!folderSelection.filter) throw new Error("Should have a filter!");
    targetFilter = createDifferenceFilter(folderSelection.filter, selectedFolder.children.map(child => child.filter));
  }
  if (filter === null) {
    return null;
  } else {
    return (
      <Row style={{...panelBorderBottomStyle, ...panelPaddingStyle, ...style}}>
        <Icon key="fie" size={iconSize} style={{marginRight: "0.5em"}} image={icons.folderFilterBlue}/>
        <Text key="bar" style={{lineHeight: iconSize}}>{folderSelection.filter.toString()}</Text>
        <Flexer/>
        {
          noUnsorted ? 
          null 
          :
          <Row>
            <IconButton key="unsorted" style={{display: !filter.isDifferenceFilter ? "inherit" : "none"}} image={icons.unsorted} onClick={() => {folderSelection.overrideFilter(targetFilter)}}/>
            <IconButton key="unsorted_and_sorted" style={{display: filter.isDifferenceFilter ? "inherit" : "none"}} iconWidth={Math.floor(2.5*iconSize)} image={icons.unsortedAndSorted} onClick={() => {folderSelection.resetFilterOverride()}}/>
          </Row>
        }
      </Row>
    )  
  }
});
