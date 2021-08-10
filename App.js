import React from 'react';

import { StatusBar } from 'expo-status-bar';
import { ScreenAnalyzer } from './components/ScreenAnalyzer';
import { CenterMiddle, Column, fitStyle, flexAutoStyle, flexGrowShrinkStyle } from './components/Layout';
import { DesignExplorer } from './components/DesignExplorer/DesignExplorer';
import { panelStyle } from './components/Style';
import { demoVault } from './application/createDemoData';
import { javaScriptUtility } from './components/utility/javaScriptUtility';
import { initializeKeyTracker } from './components/KeyStateTracker';

javaScriptUtility.install();
initializeKeyTracker();


export default function App() {
  return (
    <ScreenAnalyzer style={fitStyle} render={({style, bounds}) => 
      <MaxSizePadder style={style} bounds={bounds} maxWidth={900} maxHeight={700} render={({style, bounds}) => 
        <Column style={style}>
          <DesignExplorer style={flexGrowShrinkStyle} bounds={bounds} vault={demoVault}/>
          <StatusBar style={flexAutoStyle}/>
        </Column>
      }/>
    }/>
  );
}



function MaxSizePadder({style, bounds, maxWidth, maxHeight, render}) {
  const restricted = bounds.width < maxWidth + 10 || bounds.height < maxHeight + 10; 

  if (restricted) { // Note: this if statement could potentially cause flicker as the synthetic dom is rearranged. 
    return render({style: style, bounds})
  } else {
    const newBounds = {
      width: Math.min(bounds.width, maxWidth) - 2,
      height: Math.min(bounds.height, maxHeight) -2
    }
    return (
      <CenterMiddle style={style} overflowVisible={true}>
        {render({style: {...panelStyle, width: newBounds.width + 2, height: newBounds.height + 2}, bounds: newBounds})}
      </CenterMiddle>
    );  
  }
}
