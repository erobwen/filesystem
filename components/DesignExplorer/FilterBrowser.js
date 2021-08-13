import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import React, { Component, useState } from 'react';
import { Column, fitStyle, flexAutoStyle, Flexer, pointerEventsAutoStyle, pointerEventsNoneStyle, Row, Wrapper, ZStack, zStackElementStyle, zStackStyle } from '../Layout';
import { Icon } from '../Icon';

import { ClickablePanel } from '../ClickablePanel';
import { iconSize, panelBorderRightStyle, panelPadding, panelStyle, SelectionBase, sidePanelWidth, transparentBlue, transparentGray } from '../Style';
import { log, loge, logg } from '../utility/Debug';
import { draggingType } from './DesignExplorer';
import implyImage from '../../assets/imply.svg'
import removeFolderImage from '../../assets/remove_folder.svg'
import addFolderImage from '../../assets/add_folder.svg'
import { Portal, PortalProvider, PortalHost } from '@gorhom/portal';

import { DropTarget } from '../DropTarget';
import { Scroller, scrollerContentStyle } from '../Scroller';

function AddFolderPopover({open, close, boundingClientRect}) {
  let width = 200;
  let height = 100;
  const bounds = {
    top: boundingClientRect.top - height,
    left: boundingClientRect.left,
    width: width,
    height: height
  }
  return <Popover open={open} close={close} bounds={bounds}/>
}

export let modalLayer = 1;

export function Popover({open, close, bounds}) {
  if (!open) return null;
  const popover = (
    <div style={{...fitStyle, backgroundColor:"rgba(0,0,0,0.05)", position: "fixed", top:0, left: 0, display: open ? "initial" : "none"}}
      onClick={() => close()}>
      <div style={{
        position:"fixed", 
        top:bounds.top, 
        left:bounds.left, 
        width:bounds.width, 
        height:bounds.height, 
        ...panelStyle}}>Foobar</div>
    </div>);

  return <Portal hostName={"ModalLayer" + modalLayer}>{popover}</Portal>
}


export function FilterBrowser({style, bounds, setFilter, folder, selection}) {
  const [selectedFolder, setSelectedFolder] = useState(folder.children[0]);
  function selectFolder(folder) {
    setSelectedFolder(folder);
    setFilter(folder.filter);
  }

  const [addFolderPopoverOpen, setAddFolderPopoverOpen] = useState(false);
  const [clickBoundingClientRect, setClickBoundingClientRect] = useState(false);

  function openAddFolder(boundingClientRect) {
    setClickBoundingClientRect(boundingClientRect);
    setAddFolderPopoverOpen(true);
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
              <ClickablePanel callback={(boundingClientRect) => {
                openAddFolder(boundingClientRect);}}>
                <Icon image={addFolderImage}/>
              </ClickablePanel>
              <ClickablePanel style={{paddingLeft: "0.5em"}} callback={(boundingClientRect) => {
                openRemoveFolder(boundingClientRect);}}>
                <Icon image={removeFolderImage}/>
              </ClickablePanel>
            </Row>
          </Row>
        </Column>
      </ZStack>
      <AddFolderPopover open={addFolderPopoverOpen} close={() => {setAddFolderPopoverOpen(false)}} boundingClientRect={clickBoundingClientRect}/>
    </Wrapper>
  );
}

export function RootFolderView({style, folder, selection, selectFolder, selectedFolder}) {
  return <Column 
    style={style} 
    children={folder.children.map(child => 
      <FolderView 
        indentation={panelPadding}
        key={child.id}
        style={{paddingBottom:10}} 
        folder={child} 
        selection={selection}
        selectFolder={selectFolder}
        selectedFolder={selectedFolder}/>)}/>;
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