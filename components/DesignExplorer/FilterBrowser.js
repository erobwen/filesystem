import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import React, { Component, useState } from 'react';
import { Column, columnStyle, fitStyle, flexAutoStyle, Flexer, pointerEventsAutoStyle, pointerEventsNoneStyle, Row, Wrapper, ZStack, zStackElementStyle, zStackStyle } from '../Layout';
import { Icon } from '../Icon';

import { ClickablePanel } from '../ClickablePanel';
import { iconSize, panelBorderBottomStyle, panelBorderRightStyle, panelPadding, panelPaddingStyle, panelStyle, SelectionBase, sidePanelWidth, Spacer, transparentBlue, transparentGray } from '../Style';
import { log, loge, logg, loggg } from '../utility/Debug';
import { draggingType } from './DesignExplorer';
import implyImage from '../../assets/imply.svg'
import removeFolderImage from '../../assets/remove_folder.svg'
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
import { observer } from 'mobx-react';
import { categoriesFolder } from '../../application/createDemoData';

export const FilterBrowser = observer(function({style, bounds, folder, explorerModel}) {
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
            style={{paddingTop: panelPadding, ...panelBorderBottomStyle}} 
            folder={folder}
            explorerModel={explorerModel}
            />
          <FolderView style={{paddingTop: panelPadding, paddingBottom: panelPadding}}
            indentation={panelPadding}
            folder={categoriesFolder} 
            explorerModel={explorerModel}/>
        </Scroller>
        <Column style={{...zStackElementStyle, ...pointerEventsNoneStyle}} overflowVisible>
          <Flexer/>
          <Row style={{padding: panelPadding}}>
            <Flexer/>
            <Row style={pointerEventsAutoStyle}>
              <ClickablePanel mouseOverBackgroundColor={transparentBlue(0.1)}  callback={(boundingClientRect) => {
                openAddFolder(boundingClientRect);}}>
                <Icon image={icons.plus}/>
              </ClickablePanel>
              <ClickablePanel mouseOverBackgroundColor={transparentBlue(0.1)} style={{paddingLeft: "0.5em"}} 
                callback={explorerModel.selectedFolder.irremovable ? null : ((boundingClientRect) => openRemoveFolder(boundingClientRect))}>
                <Icon style={{opacity: (explorerModel.selectedFolder.irremovable ? 0.3 : 1)}} image={icons.remove}/>
              </ClickablePanel>
            </Row>
          </Row>
        </Column>
      </ZStack>
      <AddFolderPopover open={addFolderPopoverOpen} close={() => {setAddFolderPopoverOpen(false)}} boundingClientRect={clickBoundingClientRect} openAddCategoryFolderDialog={openAddCategoryFolderDialog} explorerModel={explorerModel}/>
      <RemoveFolderDialog open={RemoveFolderDialogOpen} close={() => {setRemoveFolderDialogOpen(false)}} boundingClientRect={clickBoundingClientRect} explorerModel={explorerModel}/>
      <AddCategoryFolderDialog open={addCategoryFolderDialogOpen} close={() => {setAddCategoryFolderDialogOpen(false)}} explorerModel={explorerModel}/>
    </Wrapper>
  );
});

export function RootFolderView({style, folder, explorerModel}) {
  return (
    <ClickablePanel callback={() => {explorerModel.selectFolder(folder)}}>
      <Column 
        style={style} 
        children={folder.children.map(child => 
          <FolderView 
            indentation={panelPadding}
            key={child.id}
            style={{paddingBottom:10}} 
            folder={child}
            explorerModel={explorerModel}/>)}/>
    </ClickablePanel>
  );
}

export const FolderView = observer(function({style, indentation, folder, explorerModel}) {
  //selectedFolder, selectFolder, 
  if (typeof(indentation) === "undefined") indentation = 0;
  
  const [ showArrow, setShowArrow ] = useState(false);

  function onDrop() {
    if (draggingType.value === "design") {
      Object.values(explorerModel.designSelection.items).forEach(design => {
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
        callback={() => explorerModel.selectFolder(folder)}
        // onDoubleClick={(event) => { loge("in handler");event.preventDefault(); event.stopPropagation(); explorerModel.selectFolder(folder); explorerModel.editFolderName = true;}}
        >
        <DropTarget style={{...fitStyle, height: iconSize + 2}} 
          onDragEnter={() => setShowArrow(true)}
          onDragLeave={() => setShowArrow(false)}
          onDrop={onDrop}>
          {/* ...zStackStyle, <Row style={{...zStackElementStyle, ...pointerEventsNoneStyle}}>
            <Flexer/>
            <Icon style={{paddingRight:panelPadding, display: showArrow ? "initial" : "none"}} image={implyImage}/>
          </Row> */}
          <SelectionBase style={fitStyle} selected={folder === explorerModel.selectedFolder}>
            <Row style={{...fitStyle, paddingLeft:indentation}}>
              <Icon size={iconSize} style={{marginRight: "0.5em"}} image={folderImage}/>
              {
                (folder === explorerModel.selectedFolder && explorerModel.editFolderName) ?
                <TextInput onChangeText={text => {folder.name = text}} value={folder.name} autoFocus onBlur={() => {explorerModel.editFolderName = false;}}/> 
                :
                <Text selectTextOnFocus={false} style={{lineHeight: iconSize}} onLongPress={() => {explorerModel.selectFolder(folder); explorerModel.editFolderName = true;}}>{folder.name}</Text>
              }
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
          explorerModel={explorerModel}
          />)}/>
    </Column>
  );
});