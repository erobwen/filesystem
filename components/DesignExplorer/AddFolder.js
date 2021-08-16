import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import React, { Component, useState } from 'react';
import { Column, columnStyle, fitStyle, flexAutoStyle, Flexer, pointerEventsAutoStyle, pointerEventsNoneStyle, Row, Wrapper, ZStack, zStackElementStyle, zStackStyle } from '../Layout';
import { Icon } from '../Icon';

import { ClickablePanel } from '../ClickablePanel';
import { iconSize, panelBorderRightStyle, panelPadding, panelPaddingStyle, panelStyle, SelectionBase, sidePanelWidth, Spacer, transparentBlue, transparentGray } from '../Style';
import { log, loge, logg } from '../utility/Debug';
import { draggingType } from './DesignExplorer';
import implyImage from '../../assets/imply.svg'
import removeFolderImage from '../../assets/remove_folder.svg'
import addFolderImage from '../../assets/add_folder.svg'
import { Portal, PortalProvider, PortalHost } from '@gorhom/portal';

import { DropTarget } from '../DropTarget';
import { Scroller, scrollerContentStyle } from '../Scroller';
import { ModalDialog, ModalPopover, Popover } from '../Popover';
import { icons } from '../Icons';
import { categories } from '../../application/createDemoData';
import { LargeMenuItem, MenuItem } from '../Widgets';


export function CategorySelector({categoryName, selectCategory, selectedFolder}) {
  const nonAvailable = {};
  selectedFolder.addDirectChildCategoryFilters(nonAvailable);
  selectedFolder.addAllIntersectedCategories(nonAvailable);
  const availableCategories = []
  categories.items.forEach(category => {
    if (category.name.toLowerCase().replace(/\s/g, "").startsWith(categoryName.toLowerCase().replace(/\s/g, ""))
        && !nonAvailable[category.id]) {
          
      availableCategories.push(category);
    }
  });
  return (
    <Scroller>
      <Column children={availableCategories.map(category =>  
          <MenuItem 
            image={category.image ? category.image : icons.folderFilter}
            text={category.name}
            onClick={() => {selectCategory(category)}}/>
      )}/>
    </Scroller>
  );
}

export function AddCategoryFolderDialog({open, close, selectedFolder}) {
  return <ModalDialog open={open} close={close} render={({style}) => {
    const [categoryName, setCategoryName] = useState("");
    let spacerSize = 5;
    return (
      <div onClick={(event) => {loge("click on column"); event.preventDefault();event.stopPropagation();}}style={{...columnStyle,...panelPaddingStyle, width: 300, ...style}}>
        <Text style={{fontSize: 16}}>Add Filter Folder</Text>
        <Spacer size={spacerSize}/>
        <Row>
          <Icon style={{paddingRight: "0.5em"}} image={icons.folderFilter}/>
          <TextInput style={{height: iconSize, lineHeight: iconSize}} onChangeText={setCategoryName} value={categoryName}/>
        </Row>
        <Spacer size={spacerSize}/>
        <CategorySelector categoryName={categoryName} selectedFolder={selectedFolder}/>
        {/* <CategoryNamePopover open={true}/> */}
      </div>
    )
  }}/>
}

// function CategoryNamePopover() {
//   return <Popover open={open} close={close} bounds={{top: 100, left: 100, width: 100, height: 100}} render={({style, bounds}) => {
//     return (
//       <Column style={{padding: panelPadding}}>
//         <MenuItem key="filter" text="Filter Folder" image={icons.folderFilter}/>
//         <Spacer size={5}/>
//         <MenuItem key="collection" text="Folder Group" image={icons.folderDashed}/>
//       </Column>
//     )
//   }}/>
// }

export function AddFolderPopover({open, close, boundingClientRect, openAddCategoryFolderDialog}) {
  let panelPadding = 5;
  let spacerSize = 5;
  let width = 200 + 2*panelPadding;
  let height = 2*iconSize + 2*panelPadding + spacerSize;
  const bounds = {
    top: boundingClientRect.top - height,
    left: boundingClientRect.left - panelPadding,
    width: width,
    height: height
  }
  return <ModalPopover open={open} close={close} bounds={bounds} render={({style, bounds}) => {
    return (
      <Column style={{padding: panelPadding}}>
        <MenuItem key="filter" text="Filter Folder" image={icons.folderFilter} onClick={() => {close(); openAddCategoryFolderDialog()}}/>
        <Spacer size={5}/>
        <MenuItem key="collection" text="Folder Group" image={icons.foldersOutline} onClick={() => {close(); openAddFolderGroupDialog()}}/>
      </Column>
    )
  }}/>
}
