import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import React, { Component } from 'react';

export function Scroller({style, bounds, render}) {
  return (
    <ScrollView style={style} children={render({style: scrollerContentStyle(), bounds: {width: bounds.width}})}/>
  );
}

export function scrollerContentStyle() {
  return {
    padding: 15
  };
}