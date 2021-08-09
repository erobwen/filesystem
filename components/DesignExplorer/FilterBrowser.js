import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import React, { Component, useState } from 'react';
import { Column, fitStyle, flexAutoStyle, Row } from '../Layout';
import { Icon } from '../Icon';
import folderImage from '../../assets/folder_category.svg';
import { ClickablePanel } from '../ClickablePanel';
import { panelBorderRight, panelPadding, SelectionBase, transparentBlue } from '../Style';

export function FilterBrowser({style, bounds, folder}) {
  const [selectedFolder, setSelectedFolder] = useState(folder.children[0]);
  return <Column 
    style={{paddingTop:20, width: 200, ...panelBorderRight, ...style}} 
    children={folder.children.map(child => 
      <FolderView 
        indentation={20}
        key={child.id}
        style={{paddingBottom:10, ...style}} 
        bounds={bounds} 
        folder={child} 
        selectFolder={setSelectedFolder}
        selectedFolder={selectedFolder}/>)}/>
}

export function FolderView({style, bounds, indentation, folder, selectedFolder, selectFolder}) {
  if (typeof(indentation) === "undefined") indentation = 0;
  return (
    <Column id="FolderView" style={style}>
      <ClickablePanel style={flexAutoStyle} 
        mouseOverBackgroundColor={transparentBlue(0.1)} 
        callback={() => selectFolder(folder)}>
        <SelectionBase selected={folder === selectedFolder}>
          <Row style={{...fitStyle, paddingLeft:indentation}}>
            <Icon style={{marginRight: "0.5em"}} image={folderImage}/>
            <Text>{folder.name}</Text>
          </Row>
        </SelectionBase>
      </ClickablePanel>
      <Column style={flexAutoStyle} children={folder.children.map(child => 
        <FolderView 
          indentation={indentation + 20} 
          key={child.id} 
          folder={child}
          selectedFolder={selectedFolder}
          selectFolder={selectFolder}
          />)}/>
    </Column>
  );
}