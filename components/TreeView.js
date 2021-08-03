import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import React, { Component } from 'react';
import { Column, Row } from './Layout';

export function TreeView({style, bounds, tree}) {
    console.log("render Tree View: " + tree.name);
    console.log(tree.children.map(child => <TreeView tree={child}/>));
    return (
        <Column>
            <Row><Text>{tree.name}</Text></Row>
            <Column style={{paddingLeft: 20}} children={tree.children.map(child => <TreeView tree={child}/>)}/>
        </Column>
    );
}