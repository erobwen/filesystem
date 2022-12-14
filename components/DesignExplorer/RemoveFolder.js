import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import React, { Component, useState } from 'react';
import { Column, columnStyle, fitStyle, flexAutoStyle, Flexer, pointerEventsAutoStyle, pointerEventsNoneStyle, Row, Wrapper, ZStack, zStackElementStyle, zStackStyle } from '../Layout';
import { iconSize, panelBorderRightStyle, panelPadding, panelPaddingStyle, panelStyle, SelectionBase, sidePanelWidth, Spacer, transparentBlue, transparentGray } from '../Style';
import { ModalDialog, ModalPopover, Popover } from '../Popover';
import { icons } from '../Icons';
import { LargeMenuItem, MenuItem } from '../Widgets';
import { observer } from 'mobx-react';


export const RemoveFolderDialog = observer(function({open, close, boundingClientRect, explorerModel}) {
  // let panelPadding = 5;
  let spacerSize = 15;
  // let width = 200 + 2*panelPadding;
  // let height = 2*iconSize + 2*panelPadding + spacerSize;
  const selectedFolder = explorerModel.selectedFolder;
  return <ModalDialog open={open} close={close} render={({style}) => {
    return (
      <Column style={{...panelPaddingStyle, width: 300, ...style}}>
        <Text style={{fontSize: 16}}>Remove Folder "{selectedFolder.name}"</Text>
        <Spacer size={spacerSize}/>
        <LargeMenuItem key="filter" text="Just remove folder." image={icons.removeFolder} onClick={() => {explorerModel.removeSelectedFolder(); close();}}/>
        <Spacer size={spacerSize}/>
        <LargeMenuItem key="collection" text="Remove folder and place its contents in the trash can." image={icons.designsInTrash} onClick={() => {}}/>
      </Column>
    )
  }}/>
});