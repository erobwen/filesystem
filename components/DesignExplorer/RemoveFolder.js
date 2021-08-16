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
import { LargeMenuItem, MenuItem } from '../Widgets';


export function RemoveFolderDialog({open, removeSelectedFolder, selectedFolder, close, boundingClientRect}) {
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