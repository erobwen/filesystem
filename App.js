import React from 'react';

import { StatusBar } from 'expo-status-bar';
import { ScreenAnalyzer } from './components/ScreenAnalyzer';
import { CenterMiddle, Column, fitStyle, flexAutoStyle, flexGrowShrinkStyle } from './components/Layout';
import { DesignExplorer } from './components/DesignExplorer/DesignExplorer';
import { panelStyle } from './components/Style';
import { javaScriptUtility } from './components/utility/javaScriptUtility';
import { initializeKeyTracker } from './components/KeyStateTracker';
import { log, logg, loggg } from './components/utility/Debug';
import { Portal, PortalProvider, PortalHost } from '@gorhom/portal';
import { configure } from "mobx"
import { vault } from './application/model/Vault';

javaScriptUtility.install();
initializeKeyTracker();

configure({
    enforceActions: "never"
})

export default function App() {
  loggg()
  return (
    <ScreenAnalyzer style={fitStyle} render={({style, bounds}) => 
      <ModalDialogWrapper style={style} bounds={bounds} render={({style, bounds}) => 
        <MaxSizePadder style={bounds} bounds={bounds} maxWidth={1000} maxHeight={700} render={({style, bounds}) => 
          <Column style={style}>
            <DesignExplorer style={flexGrowShrinkStyle} bounds={bounds} vault={vault}/>
            <StatusBar style={flexAutoStyle}/>
          </Column>
        }/>      
      }/>
    }/>
  );
}


function ModalDialogWrapper({style, bounds, render}) {
  return (
    <PortalProvider>
      {render({fitStyle, bounds})}
      <PortalHost name="ModalLayer1"/>
    </PortalProvider>
  );
}


function MaxSizePadder({style, bounds, maxWidth, maxHeight, render}) {
  const restricted = bounds.width < maxWidth + 10 || bounds.height < maxHeight + 10; 

  if (restricted) { // Note: this if statement could potentially cause flicker as the synthetic dom is rearranged. 
    return render({style: {...style, width: bounds.width-1, height: bounds.height-1}, bounds})
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
