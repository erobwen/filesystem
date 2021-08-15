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
import { categories } from '../../application/createDemoData';

function MenuItem({image, text, onClick}) {
  return (
    <ClickablePanel mouseOverBackgroundColor={transparentBlue(0.1)} callback={onClick}>
      <Row>
        <Icon style={{marginRight: "0.5em"}} image={image}/>
        <Text style={{lineHeight: iconSize}}>{text}</Text>
      </Row>
    </ClickablePanel>
  ); 
}

function LargeMenuItem({image, text, onClick}) {
  return (
    <ClickablePanel mouseOverBackgroundColor={transparentBlue(0.1)} callback={onClick}>
      <Row>
        <Icon size={iconSize*1.5} style={{marginRight: "0.5em"}} image={image}/>
        <Text style={{lineHeight: text.length < 20 ? iconSize*1.5 : 20}}>{text}</Text>
      </Row>
    </ClickablePanel>
  ); 
}

function CategorySelector({categoryName, selectCategory, selectedFolder}) {
  const nonAvailable = {};
  selectedFolder.addDirectChildCategoryFilters(nonAvailable);
  selectedFolder.addAllIntersectedCategories(nonAvailable);
  const availableCategories = []
  categories.items.forEach(category => {
    if (category.name.toLowerCase().replace(/\s/g, "").startsWith(categoryName.toLowerCase().replace(/\s/g, ""))
        && !nonAvailable[category.id]) {
          
      availableCategories.push(category);
    }
  });
  return (
    <Scroller>
      <Column children={availableCategories.map(category =>  
          <MenuItem 
            image={category.image ? category.image : icons.folderFilter}
            text={category.name}
            onClick={() => {selectCategory(category)}}/>
      )}/>
    </Scroller>
  );
}

function AddCategoryFolderDialog({open, close, selectedFolder}) {
  return <ModalDialog open={open} close={close} render={({style}) => {
    const [categoryName, setCategoryName] = useState("");
    let spacerSize = 5;
    return (
      <div onClick={(event) => {loge("click on column"); event.preventDefault();event.stopPropagation();}}style={{...columnStyle,...panelPaddingStyle, width: 300, ...style}}>
        <Text style={{fontSize: 16}}>Add Filter Folder</Text>
        <Spacer size={spacerSize}/>
        <Row>
          <Icon style={{paddingRight: "0.5em"}} image={icons.folderFilter}/>
          <TextInput style={{height: iconSize, lineHeight: iconSize}} onChangeText={setCategoryName} value={categoryName}/>
        </Row>
        <Spacer size={spacerSize}/>
        <CategorySelector categoryName={categoryName} selectedFolder={selectedFolder}/>
        {/* <CategoryNamePopover open={true}/> */}
      </div>
    )
  }}/>
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

function AddFolderPopover({open, close, boundingClientRect, openAddCategoryFolderDialog}) {
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
        <MenuItem key="collection" text="Folder Group" image={icons.folderDashed} onClick={() => {close(); openAddFolderGroupDialog()}}/>
      </Column>
    )
  }}/>
}

function RemoveFolderDialog({open, removeSelectedFolder, selectedFolder, close, boundingClientRect}) {
  // let panelPadding = 5;
  let spacerSize = 15;
  // let width = 200 + 2*panelPadding;
  // let height = 2*iconSize + 2*panelPadding + spacerSize;

  return <ModalDialog open={open} close={close} render={({style}) => {
    return (
      <Column style={{...panelPaddingStyle, width: 300, ...style}}>
        <Text style={{fontSize: 16}}>Remove Folder "{selectedFolder.name}"</Text>
        <Spacer size={spacerSize}/>
        <LargeMenuItem key="filter" text="Just remove folder." image={icons.removeFolder} onClick={() => {removeSelectedFolder()}}/>
        <Spacer size={spacerSize}/>
        <LargeMenuItem key="collection" text="Remove folder and place its contents in the trash can." image={icons.designsInTrash} onClick={() => {}}/>
      </Column>
    )
  }}/>
}


export function FilterBrowser({style, bounds, selectFolder, removeSelectedFolder, selectedFolder, folder, selection}) {
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
        selectedFolder={selectedFolder}/>
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