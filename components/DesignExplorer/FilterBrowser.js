import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import React, { Component, useState } from 'react';
import { Column, fitStyle, flexAutoStyle, Flexer, pointerEventsNoneStyle, Row, zStackElementStyle, zStackStyle } from '../Layout';
import { Icon } from '../Icon';

import { ClickablePanel } from '../ClickablePanel';
import { iconSize, panelBorderRightStyle, panelPadding, SelectionBase, sidePanelWidth, transparentBlue, transparentGray } from '../Style';
import { log, loge, logg } from '../utility/Debug';
import { draggingType } from './DesignExplorer';
import implyImage from '../../assets/imply.svg'
import { DropTarget } from '../DropTarget';


export function FilterBrowser({style, setFilter, bounds, folder, selection}) {
  const [selectedFolder, setSelectedFolder] = useState(folder.children[0]);
  function selectFolder(folder) {
    setSelectedFolder(folder);
    setFilter(folder.filter);
  }
  // log(selection)
  return <Column 
    style={{paddingTop:panelPadding, ...panelBorderRightStyle, ...style}} 
    children={folder.children.map(child => 
      <FolderView 
        indentation={panelPadding}
        key={child.id}
        style={{paddingBottom:10, ...style}} 
        bounds={bounds} 
        folder={child} 
        selection={selection}
        selectFolder={selectFolder}
        selectedFolder={selectedFolder}/>)}/>
}


export function FolderView({style, bounds, indentation, folder, selectedFolder, selectFolder, selection}) {
  if (typeof(indentation) === "undefined") indentation = 0;
  // log(selection)
  
  const [ showArrow, setShowArrow ] = useState(false);

  function onDrop() {
    if (draggingType.value === "design") {
      // log(selection)
      logg("foo")
      Object.values(selection.items).forEach(design => {
        folder.filter.categorizeToInclude(design);
      });
      draggingType.value=null;
    }
  }

  const folderImage = folder.getImage();
  return (
    <Column id="FolderView" style={style}>
      <ClickablePanel style={{...fitStyle}} 
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
      <Column style={flexAutoStyle} children={folder.children.map(child => 
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