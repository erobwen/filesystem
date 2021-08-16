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
import { LargeMenuItem, MenuItem } from '../Widgets';
import { AddCategoryFolderDialog, AddFolderPopover } from './AddFolder';
import { RemoveFolderDialog } from './RemoveFolder';
import { categories, createCategory } from '../../application/model/Category';
import { createFolder } from '../../application/model/Folder';
import { capitalizeEveryFirstLetter } from '../utility/javaScriptUtility';

export function FilterBrowser({style, bounds, selectFolder, removeSelectedFolder, addFilterFolder, selectedFolder, folder, selection}) {
  const [addFolderPopoverOpen, setAddFolderPopoverOpen] = useState(false);
  const [RemoveFolderDialogOpen, setRemoveFolderDialogOpen] = useState(false);
  const [addCategoryFolderDialogOpen, setAddCategoryFolderDialogOpen] = useState(false);
  const [clickBoundingClientRect, setClickBoundingClientRect] = useState(false);

  function openAddFolder(boundingClientRect) {
    setClickBoundingClientRect(boundingClientRect);
    setAddFolderPopoverOpen(true);
  }

  function openRemoveFolder(boundingClientRect) {
    setClickBoundingClientRect(boundingClientRect);
    setRemoveFolderDialogOpen(true);
  }

  function openAddCategoryFolderDialog() {
    setAddCategoryFolderDialogOpen(true);
  }
  

  return (
    <Wrapper style={style}>
      <ZStack style={{...fitStyle, ...panelBorderRightStyle}}>
        <Scroller style={zStackElementStyle}>
          <RootFolderView 
            style={{paddingTop: panelPadding, paddingBottom: 40}} 
            folder={folder} 
            selection={selection}
            selectFolder={selectFolder}
            selectedFolder={selectedFolder}
            />
        </Scroller>
        <Column style={{...zStackElementStyle, ...pointerEventsNoneStyle}} overflowVisible>
          <Flexer/>
          <Row style={{padding: panelPadding}}>
            <Flexer/>
            <Row style={pointerEventsAutoStyle}>
              <ClickablePanel mouseOverBackgroundColor={transparentBlue(0.1)}  callback={(boundingClientRect) => {
                openAddFolder(boundingClientRect);}}>
                <Icon image={addFolderImage}/>
              </ClickablePanel>
              <ClickablePanel mouseOverBackgroundColor={transparentBlue(0.1)} style={{paddingLeft: "0.5em"}} 
                callback={selectedFolder.irremovable ? null : ((boundingClientRect) => openRemoveFolder(boundingClientRect))}>
                <Icon style={{opacity: (selectedFolder.irremovable ? 0.3 : 1)}} image={removeFolderImage}/>
              </ClickablePanel>
            </Row>
          </Row>
        </Column>
      </ZStack>
      <AddFolderPopover open={addFolderPopoverOpen} close={() => {setAddFolderPopoverOpen(false)}} boundingClientRect={clickBoundingClientRect} 
        openAddCategoryFolderDialog={openAddCategoryFolderDialog}/>
      <RemoveFolderDialog open={RemoveFolderDialogOpen} close={() => {setRemoveFolderDialogOpen(false)}} selectedFolder={selectedFolder} 
        removeSelectedFolder={removeSelectedFolder} boundingClientRect={clickBoundingClientRect}/>
      <AddCategoryFolderDialog open={addCategoryFolderDialogOpen} close={() => {setAddCategoryFolderDialogOpen(false)}}
        selectedFolder={selectedFolder}
        addFilterFolder={addFilterFolder}
        />
    </Wrapper>
  );
}

export function RootFolderView({style, folder, selection, selectFolder, selectedFolder}) {
  return (
    <ClickablePanel callback={() => {selectFolder(folder)}}>
      <Column 
        style={style} 
        children={folder.children.map(child => 
          <FolderView 
            indentation={panelPadding}
            key={child.id}
            style={{paddingBottom:10}} 
            folder={child} 
            selection={selection}
            selectFolder={selectFolder}
            selectedFolder={selectedFolder}/>)}/>
    </ClickablePanel>
  );
}

export function FolderView({style, indentation, folder, selectedFolder, selectFolder, selection}) {
  if (typeof(indentation) === "undefined") indentation = 0;
  
  const [ showArrow, setShowArrow ] = useState(false);

  function onDrop() {
    if (draggingType.value === "design") {
      Object.values(selection.items).forEach(design => {
        folder.filter.categorizeToInclude(design);
      });
      draggingType.value=null;
    }
  }

  const folderImage = folder.getImage();
  return (
    <Column id="FolderView" style={style}>
      <ClickablePanel key="folder" style={{...fitStyle}} 
        mouseOverBackgroundColor={transparentBlue(0.1)} 
        callback={() => selectFolder(folder)}>
        <DropTarget style={{...fitStyle, ...zStackStyle, height: iconSize + 2}} 
          onDragEnter={() => setShowArrow(true)}
          onDragLeave={() => setShowArrow(false)}
          onDrop={onDrop}>
          {/* <Row style={{...zStackElementStyle, ...pointerEventsNoneStyle}}>
            <Flexer/>
            <Icon style={{paddingRight:panelPadding, display: showArrow ? "initial" : "none"}} image={implyImage}/>
          </Row> */}
          <SelectionBase style={{...zStackElementStyle}} selected={folder === selectedFolder}>
            <Row style={{...fitStyle, paddingLeft:indentation}}>
              <Icon size={iconSize} style={{marginRight: "0.5em"}} image={folderImage}/>
              <Text style={{lineHeight: iconSize}}>{folder.name}</Text>
              <Icon style={{paddingRight:panelPadding, marginLeft: "0.5em" ,display: showArrow ? "initial" : "none"}} image={implyImage}/>
            </Row>
          </SelectionBase>
        </DropTarget>
      </ClickablePanel>
      <Column key="children" style={flexAutoStyle} children={folder.children.map(child => 
        <FolderView 
          indentation={indentation + Math.floor(iconSize / 2)} 
          key={child.id} 
          folder={child}
          selectedFolder={selectedFolder}
          selectFolder={selectFolder}
          selection={selection}
          />)}/>
    </Column>
  );
}