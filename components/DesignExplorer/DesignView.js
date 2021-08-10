import { observer } from "mobx-react";
import React from "react";
import { Column, flexAutoWidthHeightStyle } from "../Layout";
import { panelBorderLeftStyle, panelPaddingStyle, sidePanelWidth } from "../Style";
import { Placeholder } from "./DesignExplorer";
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { log, logg } from "../utility/Debug";
import { Icon } from "../Icon";

export const DesignView = observer(function({style, selection}) {
  logg("Design View... ")
  let contents;
  let selectedItems = Object.values(selection.items);
  if (selectedItems.length === 0) {
    contents = [];
  } else if (selectedItems.length === 1){
    const design = selectedItems[0];
    contents = [
      <Icon key={"icon"} style={flexAutoWidthHeightStyle(150, 150)} image={design.image} />,
      <Text key={"text"} style={{...flexAutoWidthHeightStyle(150, 20), overflow: "hidden"}}>{design.name}</Text>
    ];
  } else {
    contents = [
      <Text key={"text"} style={{...flexAutoWidthHeightStyle(100, 20), overflow: "hidden"}}>{selectedItems.length + " designs selected"}</Text>
    ];
  }
  log(contents);
  return (
    <Column style={{...panelBorderLeftStyle, ...panelPaddingStyle,  width: sidePanelWidth, ...style}} children={contents}/>
  );
});
