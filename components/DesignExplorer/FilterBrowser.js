import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import React, { Component, useState } from 'react';
import { Column, fitStyle, flexAutoStyle, Row } from '../Layout';
import { Icon } from '../Icon';

import { ClickablePanel } from '../ClickablePanel';
import { iconSize, panelBorderRightStyle, panelPadding, SelectionBase, sidePanelWidth, transparentBlue } from '../Style';
import { log } from '../utility/Debug';


export function FilterBrowser({style, setFilter, bounds, folder}) {
  const [selectedFolder, setSelectedFolder] = useState(folder.children[0]);
  function selectFolder(folder) {
    setSelectedFolder(folder);
    setFilter(folder.filter);
  }

  return <Column 
    style={{paddingTop:panelPadding, ...panelBorderRightStyle, ...style}} 
    children={folder.children.map(child => 
      <FolderView 
        indentation={panelPadding}
        key={child.id}
        style={{paddingBottom:10, ...style}} 
        bounds={bounds} 
        folder={child} 
        selectFolder={selectFolder}
        selectedFolder={selectedFolder}/>)}/>
}


export function FolderView({style, bounds, indentation, folder, selectedFolder, selectFolder}) {
  if (typeof(indentation) === "undefined") indentation = 0;
  const folderImage = folder.getImage();
  return (
    <Column id="FolderView" style={style}>
      <ClickablePanel style={flexAutoStyle} 
        mouseOverBackgroundColor={transparentBlue(0.1)} 
        callback={() => selectFolder(folder)}>
        <SelectionBase selected={folder === selectedFolder}>
          <Row style={{...fitStyle, paddingLeft:indentation}}>
            <Icon size={iconSize} style={{marginRight: "0.5em"}} image={folderImage}/>
            <Text style={{lineHeight: iconSize}}>{folder.name}</Text>
          </Row>
        </SelectionBase>
      </ClickablePanel>
      <Column style={flexAutoStyle} children={folder.children.map(child => 
        <FolderView 
          indentation={indentation + Math.floor(iconSize / 2)} 
          key={child.id} 
          folder={child}
          selectedFolder={selectedFolder}
          selectFolder={selectFolder}
          />)}/>
    </Column>
  );
}