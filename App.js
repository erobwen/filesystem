import { StatusBar } from 'expo-status-bar';

import React from 'react';

import { StyleSheet, Button, Text, View, TextInput, ScrollView, SuperScript } from 'react-native';
import { ScreenAnalyzer } from './components/ScreenAnalyzer';
import { Column, Row, fitStyle } from './components/Layout';
import { Scroller, scrollerContentStyle } from './components/Scroller';
import { demoTree } from './application/createDemoData.js';
import { TreeView } from './components/TreeView';
import catdog2 from "./assets/designs/catdog2.jpg";
import { Icon } from './components/Typography';

export default function App() {
  
  return (
    <ScreenAnalyzer style={fitStyle} render={({style, bounds}) => 
      <Column class="Column" style={{padding: 20, ...fitStyle, width: bounds.width, height: bounds.height}}>
        <Icon style={{width: 100, height: 100}} image={catdog2}/>
        <Row style={fitStyle} class="Row">
          <TreeView style={{width:"20%", height:"100%", backgroundColor:"lightgray"}} tree={ demoTree }/>
          <div></div>
        </Row>
      <StatusBar style="auto" />
      </Column>
    }/>
  );
}

// style={styles.container}
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
