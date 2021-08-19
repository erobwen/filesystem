import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import React, { Component, useState } from 'react';
import { Column, columnStyle, fitStyle, flexAutoStyle, flexAutoWidthStyle, Flexer, flexGrowShrinkAutoStyle, Middle, pointerEventsAutoStyle, pointerEventsNoneStyle, Row, Wrapper, ZStack, zStackElementStyle, zStackStyle } from '../Layout';
import { Icon } from '../Icon';

import { ClickablePanel } from '../ClickablePanel';
import { iconSize, panelBorderRightStyle, panelPadding, panelPaddingStyle, panelStyle, SelectionBase, sidePanelWidth, Spacer, transparentBlue, transparentGray } from '../Style';
import { log, loge, logg } from '../utility/Debug';
import { draggingType } from './DesignExplorer';
import implyImage from '../../assets/imply.svg'
import { Portal, PortalProvider, PortalHost } from '@gorhom/portal';

import { DropTarget } from '../DropTarget';
import { Scroller, scrollerContentStyle } from '../Scroller';
import { ModalDialog, ModalPopover, Popover } from '../Popover';
import { icons } from '../Icons';
import { Button, LargeMenuItem, MenuItem } from '../Widgets';
import { categories } from '../../application/model/Category';
import { SelectCategoryDialog } from './SelectCategoryDialog';

export function AddFolderPopover({open, close, boundingClientRect, explorerModel, openAddCategoryFolderDialog}) {
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
        <MenuItem key="filter" text="Filter Folder" image={icons.object} onClick={() => {close(); openAddCategoryFolderDialog()}}/>
        <Spacer size={5}/>
        <MenuItem key="collection" text="Folder Group" image={icons.objectGroup} onClick={() => {close(); explorerModel.createNewFolderGroup()}}/>
      </Column>
    )
  }}/>
}


export function AddCategoryFolderDialog({open, close, explorerModel}) {
  const nonAvailable = {};
  explorerModel.selectedFolder.addDirectChildCategoryFilters(nonAvailable);
  explorerModel.selectedFolder.addAllIntersectedCategories(nonAvailable);
  function onSelect(categoryOrCategoryName) {
    explorerModel.addFilterFolder(categoryOrCategoryName); close();
  }
  return (
    <SelectCategoryDialog open={open} close={close} 
      nonAvailable={nonAvailable} 
      explorerModel={explorerModel}
      onSelect={onSelect}
      />
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

