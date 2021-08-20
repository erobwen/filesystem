import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import React, { Component, useState } from 'react';
import { Column, columnStyle, fitStyle, flexAutoStyle, flexAutoWidthStyle, Flexer, flexGrowShrinkAutoStyle, flexGrowShrinkStyle, Middle, pointerEventsAutoStyle, pointerEventsNoneStyle, Row, Wrapper, ZStack, zStackElementStyle, zStackStyle } from '../Layout';
import { Icon } from '../Icon';

import { ClickablePanel } from '../ClickablePanel';
import { iconSize, panelBorderBottomStyle, panelBorderRightStyle, panelPadding, panelPaddingStyle, panelStyle, SelectionBase, sidePanelWidth, Spacer, transparentBlue, transparentGray } from '../Style';
import { log, loge, logg, loggg } from '../utility/Debug';
import implyImage from '../../assets/imply.svg'

import { DropTarget } from '../DropTarget';
import { icons } from '../Icons';
import { Button, IconButton, LargeMenuItem, MenuItem } from '../Widgets';
import { observer } from 'mobx-react';
import { createFolder } from '../../application/model/Folder';
import { Rule } from '../../application/model/RuleStore';

export function RootFolderView({style, folder, explorerModel}) {
  return (
    <ClickablePanel callback={() => {explorerModel.userSelectFolder(folder)}}>
      <Column 
        style={style} 
        children={folder.children.map(child => 
          <FolderView 
            indentation={panelPadding - 12}
            key={child.id}
            style={{paddingBottom:10}} 
            folder={child}
            explorerModel={explorerModel}/>)}/>
    </ClickablePanel>
  );
}

export const FolderView = observer(function({style, indentation, folder, explorerModel}) {
  //selectedFolder, userSelectFolder, 
  if (typeof(indentation) === "undefined") indentation = 0;
  
  const [ showArrow, setShowArrow ] = useState(false);

  function onDrop() {
    if (explorerModel.isDraggingDesigns()) {
      if (folder.filter) {
        explorerModel.dragging.forEach(design => {
          folder.filter.categorizeToInclude(design);
        });
      }
      explorerModel.dragging = null;
    } else if (explorerModel.isDraggingFilter()){
      const newFolder = createFolder({ 
        name: explorerModel.dragging.toEquationString(), 
        filter: explorerModel.dragging, 
        image: icons.imply});
      const cause = explorerModel.dragging.addAllIntersectedCategories({});
      const effect = folder.filter.addAllIntersectedCategories({})
      newFolder.rule = new Rule(newFolder, effect, cause); 
      folder.addChild(newFolder);
      explorerModel.dragging = null;
    }
  }

  const folderImage = folder.getImage();
  return (
    <Column id="FolderView" style={style}>
      <ClickablePanel key="folder" style={{...fitStyle}} 
        mouseOverBackgroundColor={transparentBlue(0.1)} 
        callback={() => explorerModel.userSelectFolder(folder)}
        // onDoubleClick={(event) => { loge("in handler");event.preventDefault(); event.stopPropagation(); explorerModel.userSelectFolder(folder); explorerModel.editFolderName = true;}}
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
              <Middle style={{width: 10, marginRight: 2}}>
                <IconButton style={{display: !folder.open && folder.children.length > 0 ? "inherit" : "none"}} size={10} onClick={() => {folder.open=true;}} image={icons.chevronRight}/>
                <IconButton style={{display: folder.open && folder.children.length > 0 ? "inherit" : "none"}} size={10} onClick={() => {folder.open=false;}} image={icons.chevronDown}/>
              </Middle>
              <Icon size={iconSize} style={{marginRight: "0.5em"}} image={folderImage}/>
              {
                (folder === explorerModel.selectedFolder && explorerModel.editFolderName) ?
                <TextInput onChangeText={text => {folder.name = text}} value={folder.name} autoFocus onBlur={() => {explorerModel.editFolderName = false;}}/> 
                :
                <Text selectTextOnFocus={false} style={{lineHeight: iconSize}} onLongPress={() => {explorerModel.userSelectFolder(folder); explorerModel.editFolderName = true;}}>{folder.name}</Text>
              }
              <Icon style={{paddingRight:panelPadding, marginLeft: "0.5em" ,display: showArrow ? "initial" : "none"}} image={implyImage}/>
            </Row>
          </SelectionBase>
        </DropTarget>
      </ClickablePanel>
      <Column style={{display: folder.open ? "inherit" : "none", ...flexAutoStyle}} key="children" children={folder.children.map(child => 
        <FolderView 
          indentation={indentation + Math.floor(iconSize / 2)} 
          key={child.id} 
          folder={child}
          explorerModel={explorerModel}
          />)}/>
    </Column>
  );
});