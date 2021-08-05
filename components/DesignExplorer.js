import React from 'react';

import { StyleSheet, Button, Text, View, TextInput, ScrollView, SuperScript } from 'react-native';
import { Scroller, scrollerContentStyle } from './Scroller';
import { demoTree } from '../application/createDemoData.js';
import { TreeView } from './TreeView';
import { Column, fitStyle, Row, CenterMiddle, flexAutoStyle, flexGrowShrinkStyle } from './Layout';

export function DesignExplorer({style, bounds}) {
  return (
    <Row style={fitStyle} class="Row">
      <FilterBrowser style={flexAutoStyle}/>
      <Column style={flexGrowShrinkStyle}>
        <FilterView style={flexAutoStyle}/>
        <DesignsView style={flexGrowShrinkStyle}/>
        <CategoriesView style={flexAutoStyle}/>
      </Column>
      <DesignView style={flexAutoStyle}/>
    </Row>
  );
}
 
export function FilterBrowser({style, bounds}) {
  return <TreeView sytle={style} bounds={bounds} tree={demoTree}/>;
}

export function FilterView({style}) {
  return <Placeholder style={style} name="Filter"/>
}

export function DesignsView({style}) {
  return <Placeholder style={style} name="Designs"/>
}

export function CategoriesView({style}) {
  return <Placeholder style={style} name="Categories"/>
}

export function DesignView({style}) {
  return <Placeholder style={style} name="Design"/>
}



export function Placeholder({style, name}) {
  const placeholderStyle = {
    overflow: "hidden",
    boxSizing: "border-box",
    borderWidth: "1px",
    borderColor: "rgba(124, 124, 124, 0.2)",
    borderStyle: "solid",
    fontSize: 16,
    fontWeight: 700,
    color: "rgba(124, 124, 124, 0.5)",
    backgroundColor: "rgba(124, 124, 124, 0.1)",
    ...style
  };
  return (
    <CenterMiddle style={placeholderStyle}>
      {name}
    </CenterMiddle>
  );
}
