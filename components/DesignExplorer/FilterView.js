import React, { useState } from 'react';
import { flexAutoStyle, Flexer, Middle, Row } from '../Layout';
import { iconSize, panelBorderBottomStyle, panelPaddingStyle, topPanelHeight, transparentBlue, transparentLightBlue } from '../Style';
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
import { SelectCategoryDialog } from './SelectCategoryDialog';
import { createCategoryFilter } from '../../application/model/Filter';

export const FilterView = observer(function({style, explorerModel}) {
  const [addFilterDialogOpen, setAddFilterDialogOpen] = useState(false);

  const filter = explorerModel.filter;

  const nonAvailable = {};
  filter.filters.forEach(filter => {nonAvailable[filter.category.id] = filter.category});
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
                style={{...flexAutoStyle, backgroundColor: transparentLightBlue(0.1)}}
                text={filter.category.name}/>
            );
          }
          return (
            <Chip
              key={filter.category.name}
              style={{...flexAutoStyle, backgroundColor: transparentLightBlue(0.1)}}
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
        <SelectCategoryDialog open={addFilterDialogOpen} close={() => setAddFilterDialogOpen(false)} 
          allowCreate={false}
          nonAvailable={nonAvailable}
          onSelect={(category) => {filter.filters.push(createCategoryFilter(category)); setAddFilterDialogOpen(false); explorerModel.onUserFilterChange()}}
        />
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
