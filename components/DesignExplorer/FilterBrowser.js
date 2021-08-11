import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import React, { Component, useState } from 'react';
import { Column, fitStyle, flexAutoStyle, Row } from '../Layout';
import { Icon } from '../Icon';

import { ClickablePanel } from '../ClickablePanel';
import { iconSize, panelBorderRightStyle, panelPadding, SelectionBase, sidePanelWidth, transparentBlue, transparentGray } from '../Style';
import { log, loge, logg } from '../utility/Debug';
import { draggingType } from './DesignExplorer';


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
  
  function drop() {
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
      <ClickablePanel style={flexAutoStyle} 
        mouseOverBackgroundColor={transparentBlue(0.1)} 
        callback={() => selectFolder(folder)}>
        <Droppable style={flexAutoStyle} onDrop={drop}>
          <SelectionBase selected={folder === selectedFolder}>
            <Row style={{...fitStyle, paddingLeft:indentation}}>
              <Icon size={iconSize} style={{marginRight: "0.5em"}} image={folderImage}/>
              <Text style={{lineHeight: iconSize}}>{folder.name}</Text>
            </Row>
          </SelectionBase>
        </Droppable>
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

// function Droppable({style, children, onDrop}) {
//   return <div id="Droppable" style={style}
//     onDragOver={(event) => { event.preventDefault();}} 
//     onDragEnter={() => {}} 
//     onDrop={(event) => onDrop(event)} 
//     children={children}/>
// }

class Droppable extends React.Component {
  constructor(props) {
    super(props);
    this.myDiv = React.createRef();
  }

  componentDidMount() {
    log(this.myDiv.current);
    const panel = this.myDiv.current;
    const mouseOverBackgroundColor = transparentBlue(0.1)
    const me = this; 
    let counter = 0;

    me.setMouseoverColor = function() {
      counter++;
      if (counter === 1) {
        loge("add")
        if (mouseOverBackgroundColor) {
          // panel.style["transition"] = "background-color 0.15s";
          panel._savedBackgroundColor = panel.style["background-color"];
          panel.style["background-color"] = mouseOverBackgroundColor;            
        }
      }
    }
    panel.addEventListener("dragenter", me.setMouseoverColor, true);
    
    me.removeMouseoverColor = function() {
      counter--;
      if (counter === 0) {
        loge("remove")
         if (mouseOverBackgroundColor) {
          panel.style["background-color"] = panel._savedBackgroundColor; //"rgba(0, 0, 0, 0)";
        }
        // delete panel.style["background-color"]; // Note: Does not work in IE
        // panel.style["background-color"] = null; // Note: Does not work in IE
      }
    }
    panel.addEventListener("dragleave", me.removeMouseoverColor, true);
  }

  componentWillUpdate(nextProps, nextState) {}

  componentWillUnmount() {
    this.clearEventListeners();
  }

  clearEventListeners() {
    // Clear old listeners
    const panel = this.myDiv.current;
    if (this.setMouseoverColor) {
      panel.removeEventListener("dragenter", this.setMouseoverColor);  
      delete this.setMouseoverColor;
    }
    if (this.removeMouseoverColor) {
      panel.removeEventListener("dragleave", this.removeMouseoverColor);
      delete this.removeMouseoverColor;
    }
  }

  render() {
    const me = this;
    const {style, children, onDrop} = this.props
    return ( 
      <div ref={this.myDiv} id="Droppable" style={style}
        onDragOver={(event) => { event.preventDefault();}} 
        // onDragEnter={(event) => {me.setMouseoverColor()}} 
        // onDragLeave={(event) => {me.removeMouseoverColor()}}
        onDrop={(event) => { me.removeMouseoverColor(); onDrop(event)} } 
        children={children}/>
    );
  }
}