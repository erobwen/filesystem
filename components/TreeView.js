import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import React, { Component } from 'react';
import { Column, Row } from './Layout';
import { Icon } from './Typography';
import folderImage from '../assets/folder_category_outline.svg';
export function TreeView({style, bounds, tree}) {
    console.log("render Tree View: " + tree.name);
    console.log(tree.children.map(child => <TreeView tree={child}/>));
    return (
        <Column>
            <Row>
                <Icon style={{marginRight: "0.5em"}} image={folderImage}/>
                <Text>{tree.name}</Text>
            </Row>
            <Column style={{paddingLeft: 20}} children={tree.children.map(child => <TreeView tree={child}/>)}/>
        </Column>
    );
}