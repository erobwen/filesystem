import { observer } from "mobx-react";
import React from "react";
import { Column, flexAutoWidthHeightStyle, flexAutoStyle, flexGrowAutoStyle } from "../Layout";
import { panelBorderLeftStyle, panelPadding, panelPaddingStyle, sidePanelWidth, Spacer } from "../Style";
import { Placeholder } from "./DesignExplorer";
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { log, logg } from "../utility/Debug";
import { Icon } from "../Icon";
import { CategoriesView } from "./CategoriesView";
import allDesignsImage from "../../assets/all_designs.svg"


export const DesignView = observer(function({style, designSelection}) {
  let contents;
  let selectedItems = Object.values(designSelection.items);
  if (selectedItems.length === 0) {
    contents = [];
  } else if (selectedItems.length === 1){
    const design = selectedItems[0];
    contents = [
      <Icon key={"icon"} style={flexAutoWidthHeightStyle(sidePanelWidth - 2*panelPadding, 170)} image={design.image} />,
      <Text key={"text"} style={{...flexAutoWidthHeightStyle(sidePanelWidth, 30), overflow: "hidden", fontSize: 20}}>{design.name}</Text>,
      <Spacer key={"spacer"}/>,
      <Text key={"text2"} style={{...flexAutoWidthHeightStyle(sidePanelWidth, 20), overflow: "hidden"}}>Dimensions: 40 x 50</Text>,
      <Text key={"text3"} style={{...flexAutoWidthHeightStyle(sidePanelWidth, 20), overflow: "hidden"}}>Creator: Godot</Text>
    ];
  } else {
    contents = [
      <Icon key={"icon"} style={flexAutoWidthHeightStyle(170, 170)} image={allDesignsImage} />,
      <Text key={"text1"} style={{...flexAutoWidthHeightStyle(sidePanelWidth, 20), overflow: "hidden"}}>{selectedItems.length + " designs selected"}</Text>,
      <Spacer key={"spacer"}/>,
      <Text key={"text2"} style={{...flexAutoWidthHeightStyle(sidePanelWidth, 20), overflow: "hidden"}}>57 kb</Text>,
    ];
  }
  return (
    <Column style={{...panelBorderLeftStyle,  ...style}} >
      <Column key={"design"} style={{...panelPaddingStyle, ...flexAutoStyle}} children={contents}/>
      <CategoriesView key={"categories"} style={flexGrowAutoStyle} designSelection={designSelection}/>
    </Column>
  );
});
