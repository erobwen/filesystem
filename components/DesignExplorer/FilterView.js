import React, { useState } from 'react';
import { Row } from '../Layout';
import { iconSize, panelBorderBottomStyle, panelPaddingStyle } from '../Style';
import { Placeholder } from './DesignExplorer';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import folderImage from '../../assets/folder_outline.svg';
import { Icon } from '../Icon';

export function FilterView({style, filter}) {
  return (
    <Row style={{...panelBorderBottomStyle, ...panelPaddingStyle, ...style}}>
      <Icon size={iconSize} style={{marginRight: "0.5em"}} image={folderImage}/>
      <Text style={{lineHeight: iconSize}}>{filter.toString()}</Text>
    </Row>
  )
}
