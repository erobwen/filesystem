import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import React, { Component } from 'react';
import { Column, Row } from './Layout';
import { Icon } from './Typography';
import folderImage from '../assets/folder_category.svg';

export function FolderView({style, bounds, folder}) {
  return (
    <Column style={style}>
      <Row>
        <Icon style={{marginRight: "0.5em"}} image={folderImage}/>
        <Text>{folder.name}</Text>
      </Row>
      <Column style={{paddingLeft: 20}} children={folder.children.map(child => <FolderView key={child.id} folder={child}/>)}/>
    </Column>
  );
}