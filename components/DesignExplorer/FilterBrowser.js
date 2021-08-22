import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import React, { Component, useState } from 'react';
import { Column, columnStyle, fitStyle, flexAutoStyle, flexAutoWidthStyle, Flexer, flexGrowShrinkAutoStyle, flexGrowShrinkStyle, Middle, pointerEventsAutoStyle, pointerEventsNoneStyle, Row, Wrapper, ZStack, zStackElementStyle, zStackStyle } from '../Layout';
import { Icon } from '../Icon';

import { ClickablePanel } from '../ClickablePanel';
import { iconSize, panelBorderBottomStyle, panelBorderRightStyle, panelPadding, panelPaddingStyle, panelStyle, SelectionBase, sidePanelWidth, Spacer, topPanelHeight, transparentBlue, transparentGray } from '../Style';
import { log, loge, logg, loggg } from '../utility/Debug';

import { Scroller, scrollerContentStyle } from '../Scroller';
import { icons } from '../Icons';
import { Button, IconButton, LargeMenuItem, MenuItem } from '../Widgets';
import { AddCategoryFolderDialog, AddFolderPopover } from './AddFolder';
import { RemoveFolderDialog } from './RemoveFolder';
import { observer } from 'mobx-react';
import { FolderView, RootFolderView } from './FolderView';
import { Design } from '../../application/model/Design';
import { categoriesFolder } from '../../application/model/Vault';


export const FilterBrowser = observer(function({style, bounds, maxWidth, folder, explorerModel}) {
  const [addFolderPopoverOpen, setAddFolderPopoverOpen] = useState(false);
  const [RemoveFolderDialogOpen, setRemoveFolderDialogOpen] = useState(false);
  const [addCategoryFolderDialogOpen, setAddCategoryFolderDialogOpen] = useState(false);
  const [clickBoundingClientRect, setClickBoundingClientRect] = useState(false);
  const [open, setOpen] = useState(true);

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
  
  if (!open) {
    return (
      <Column style={flexAutoWidthStyle(topPanelHeight)}>
        <Column style={{...panelBorderRightStyle}}>
          <Row style={{height: topPanelHeight,...panelBorderBottomStyle}}>
            <Flexer/>
            <Middle>
              <IconButton style={{...flexAutoStyle, opacity: 0.5, marginRight: (topPanelHeight-15)/2}} size={15} 
                image={icons.chevronRight} 
                onClick={() => setOpen(true)}/>
            </Middle>
          </Row>
        </Column>
        <Column style={{...flexGrowShrinkAutoStyle, ...panelBorderRightStyle}}/>
      </Column>
    );
  }

  return (
    <Column style={flexAutoWidthStyle(maxWidth)}>
      <Column style={{...panelBorderRightStyle}}>
        <Row style={{height: topPanelHeight,...panelBorderBottomStyle}}>
          <Flexer/>
          <Middle>
            <IconButton style={{...flexAutoStyle, opacity: 0.5, marginRight: (topPanelHeight-15)/2}} size={15} 
              image={icons.chevronLeft} 
              onClick={() => {setOpen(false); explorerModel.userSelectFolder(null)}}/>
          </Middle>
        </Row>
      </Column>
      <ZStack style={{...flexGrowShrinkStyle, ...panelBorderRightStyle}}>
        <Scroller style={zStackElementStyle}>
          <RootFolderView 
            style={{paddingTop: panelPadding, ...panelBorderBottomStyle}} 
            folder={folder}
            explorerModel={explorerModel}
            />
          <FolderView style={{paddingTop: panelPadding, paddingBottom: panelPadding}}
            indentation={panelPadding-12}
            folder={categoriesFolder} 
            explorerModel={explorerModel}/>
        </Scroller>
        <Column style={{...zStackElementStyle, ...pointerEventsNoneStyle}} overflowVisible>
          <Flexer/>
          <Row style={{padding: panelPadding}}>
            <Flexer/>
            <Row style={{...pointerEventsAutoStyle}}>
              <IconButton style={{display: "block"}} image={icons.plus} 
                onClick={(boundingClientRect) => {
                  openAddFolder(boundingClientRect);
                }}/>
              <IconButton style={{display: "block", marginLeft: "0.5em"}} image={icons.remove} 
                disable={explorerModel.selectedFolder && !explorerModel.selectedFolder.irremovable}
                onClick={(boundingClientRect) => openRemoveFolder(boundingClientRect)}/>
            </Row>
          </Row>
        </Column>
      </ZStack>
      <AddFolderPopover open={addFolderPopoverOpen} close={() => {setAddFolderPopoverOpen(false)}} boundingClientRect={clickBoundingClientRect} openAddCategoryFolderDialog={openAddCategoryFolderDialog} explorerModel={explorerModel}/>
      <RemoveFolderDialog open={RemoveFolderDialogOpen} close={() => {setRemoveFolderDialogOpen(false)}} boundingClientRect={clickBoundingClientRect} explorerModel={explorerModel}/>
      <AddCategoryFolderDialog open={addCategoryFolderDialogOpen} close={() => {setAddCategoryFolderDialogOpen(false)}} explorerModel={explorerModel}/>
    </Column>
  );
});
