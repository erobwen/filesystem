import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import React, { Component, useState } from 'react';
import { Column, columnStyle, fitStyle, flexAutoStyle, flexAutoWidthStyle, Flexer, flexGrowShrinkAutoStyle, Middle, pointerEventsAutoStyle, pointerEventsNoneStyle, Row, Wrapper, ZStack, zStackElementStyle, zStackStyle } from '../Layout';
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
import { Button, LargeMenuItem, MenuItem } from '../Widgets';
import { categories } from '../../application/model/Category';

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

function normalize(name) {
  return name.toLowerCase().replace(/\s/g, "");
}

export function AddCategoryFolderDialog({open, close, selectedFolder, addFilterFolder}) {
  return <ModalDialog open={open} close={close} render={({style}) => {
    const [categoryName, setCategoryName] = useState("");
    const normalizedCategoryName = normalize(categoryName);

    let exactMatch = null; 
    const nonAvailable = {};
    selectedFolder.addDirectChildCategoryFilters(nonAvailable);
    selectedFolder.addAllIntersectedCategories(nonAvailable);
    const availableCategories = []
    categories.items.forEach(category => {
      let name = normalize(category.name);
      if (name.startsWith(normalizedCategoryName)
          && !nonAvailable[category.id] && category.canBeFilter) {      
        availableCategories.push(category);
      }
      if (name === normalizedCategoryName) {
        exactMatch = category; 
      }
    });

    let spacerSize = 15;
    return (
      <div style={{...columnStyle,...panelPaddingStyle, width: 500, height: 400, ...style}} 
        onClick={(event) => {loge("click on column"); event.preventDefault();event.stopPropagation();}}>
        <Text style={{fontSize: 16}}>Add Filter Folder</Text>
        <Spacer size={spacerSize}/>
        <Row style={{flexAutoStyle}} overflowVisible>
          <Icon style={{marginRight: "0.5em"}} image={icons.folderFilter}/>
          <Middle style={flexGrowShrinkAutoStyle}>
            <TextInput style={{height: iconSize, lineHeight: iconSize}} onChangeText={setCategoryName} value={categoryName} autoFocus/>
          </Middle>
          <Button style={{...flexAutoWidthStyle(150), marginLeft: "0.5em"}} text={"Create new category"} 
            onClick={() => { addFilterFolder(categoryName); close()}} 
            disable={(exactMatch !== null) || categoryName.length === 0}/>
        </Row>
        <Spacer size={spacerSize}/>
        <Text style={{fontSize: 16}}>Select a category</Text>
        <Spacer size={spacerSize}/>
        <CategorySelector availableCategories={availableCategories} selectCategory={(category) => {
          addFilterFolder(category); close()
        }}/>
        {/* <CategoryNamePopover open={true}/> */}
      </div>
    )
  }}/>
}


export function CategorySelector({selectCategory, availableCategories}) {

  return (
    <Scroller>
      <Column children={availableCategories.map(category =>  
          <MenuItem
            key={category.id}
            image={category.image ? category.image : icons.folderFilter}
            text={category.name}
            onClick={() => {selectCategory(category)}}/>
      )}/>
    </Scroller>
  );
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

