import React, { useState } from 'react';
import { Flexer, Row } from '../Layout';
import { iconSize, panelBorderBottomStyle, panelPaddingStyle } from '../Style';
import { Placeholder } from './DesignExplorer';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import folderImage from '../../assets/folder_outline.svg';
import { Icon } from '../Icon';
import { icons } from '../Icons';
import { ClickablePanel } from '../ClickablePanel';


function IconButton({image, onClick}) {
  return(
    <ClickablePanel callback={onClick}>
      <Icon size={iconSize} image={icons.unsorted}/>
    </ClickablePanel>
  );
}

export function FilterView({style, filter, selectedFolder}) {
  return (
    <Row style={{...panelBorderBottomStyle, ...panelPaddingStyle, ...style}}>
      <Icon size={iconSize} style={{marginRight: "0.5em"}} image={icons.folderFilterBlue}/>
      <Text style={{lineHeight: iconSize}}>{filter.toString()}</Text>
      <Flexer/>
      <IconButton image={icons.unsorted} onClick={() => {}}/>
    </Row>
  )
}
