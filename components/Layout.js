import React from 'react';

import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';

/**
 * Container Styles
 */
export const columnStyle = {
  overflow: "hidden", // Enforce top down bounds. If set to auto or display, bounds might be influenced by grand children that are too large to fit within their given space. 
  boxSizing: "border-box",  // Each component needs to be responsible of their own padding/border space...
  display:"flex", 
  flexDirection: "column", 
  alignContent: "stretch", 
  justifyContent: "flex-start"
};

export const rowStyle = {
  overflow: "hidden",
  boxSizing: "border-box",
  display:"flex", 
  flexDirection: "row", 
  alignItems: "stretch", 
  justifyContent: "flex-start"
};

export function Column({style, children, overflowVisible=false, top=false, bottom=false, center=false, spread=false}) {
  style={...style};
  if (overflowVisible) style.overflow = "visible";
  if (bottom) style.justifyContent = "flex-end";
  if (top) style.justifyContent = "flex-start";
  if (center) style.justifyContent = "center";
  if (spread) style.justifyContent = "space-between";
  return <View style={{...columnStyle, ...style}} children={children}/>;
}


export function Row({style, children, overflowVisible=false, left=false, right=false, center=false, spread=false}) {
  style={...style};
  if (overflowVisible) style.overflow = "visible";
  if (right) style.justifyContent = "flex-end";
  if (left) style.justifyContent = "flex-start";
  if (center) style.justifyContent = "center";
  if (spread) style.justifyContent = "space-between";
  return <View style={{...rowStyle, ...style}} children={children}/>;
}