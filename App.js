import { StatusBar } from 'expo-status-bar';

import React from 'react';

import { StyleSheet, Button, Text, View, TextInput, ScrollView, SuperScript } from 'react-native';
import { ScreenAnalyzer } from './components/ScreenAnalyzer';
import { Column, Row } from './components/Layout';
import { Scroller, scrollerContentStyle } from './components/Scroller';

export default function App() {
  
  return (
    <ScreenAnalyzer render={({style, bounds}) => {
      return (
        <View>
          <Column>
            <Row>
              <Text>Foobar! + { bounds.width + ", " + bounds.height}</Text>
              <StatusBar style="auto" />
            </Row>
          </Column>
        </View>
      )
    }}/>
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
