import React, { useState } from 'react';
import { flexAutoStyle, Flexer, Middle, Row } from '../Layout';
import { iconSize, panelBorderBottomStyle, panelPaddingStyle, topPanelHeight, transparentBlue } from '../Style';
import { Placeholder } from './DesignExplorer';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import folderImage from '../../assets/folder_outline.svg';
import { Icon } from '../Icon';
import { icons } from '../Icons';
import { ClickablePanel } from '../ClickablePanel';
import { log, loge, logg } from '../utility/Debug';
import { observer } from 'mobx-react';
import { Chip, IconButton } from '../Widgets';
import { AllDesigns } from '../../application/createDemoData';
import { ModalDialog } from '../Popover';

function AddFilterDialog({open}) {
  return (
    <ModalDialog open={open}></ModalDialog>

  );
}

export const FilterView = observer(function({style, explorerModel}) {
  const [addFilterDialogOpen, setAddFilterDialogOpen] = useState(false);

  const filter = explorerModel.filter;
  log(explorerModel.displayItems)
  if (filter === null) {
    return null;
  } else {
    return (
      <Row style={{...panelBorderBottomStyle, ...panelPaddingStyle, height: topPanelHeight, ...style}}>
        <Icon key="fie" size={iconSize} style={{marginRight: "0.5em"}} image={icons.filterBlue}/>
        {explorerModel.filter.filters.map(filter => {
          if (filter.category === AllDesigns) {
            if (explorerModel.filter.filters.length > 1) return null;
            return (
              <Chip 
                key={filter.category.name}
                style={flexAutoStyle}
                text={filter.category.name}/>
            );
          }
          return (
            <Chip
              key={filter.category.name}
              style={flexAutoStyle}
              text={filter.category.name} 
              onDelete={() => {explorerModel.filter.filters.remove(filter); explorerModel.onUserFilterChange();}}/>
          );
        })}
        <Middle style={{marginLeft: "0.5em"}}>
          <IconButton style={flexAutoStyle} image={icons.plus} size={15}
          onClick={() => {
            setAddFilterDialogOpen(true);
          }}/>
        </Middle>
        <AddFilterDialog open={addFilterDialogOpen}/>
        {/* <Text key="bar" style={{lineHeight: iconSize}}>{explorerModel.filter.toEquationString()}</Text> */}
        <Flexer/>
        {/* {
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
        } */}
      </Row>
    )  
  }
});
