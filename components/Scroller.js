import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import React, { Component } from 'react';
import { observer } from 'mobx-react';

export const Scroller = observer(function({style, bounds, render, children}) {
  if (render) {
    return (
      <ScrollView style={style} 
        children={
          render({
            style: scrollerContentStyle(), 
            bounds: {
              width: bounds ? bounds.width : null, 
              height: null}})}/>
    );  
  } else {
    return (
      <ScrollView style={style} children={children}/>
    )
  }
});

export function scrollerContentStyle() {
  return {
    padding: 15
  };
}