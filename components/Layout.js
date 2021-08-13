import React from 'react';

import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { log, logg } from './utility/Debug';

/**
 * ZStack
 */
 export const zStackElementStyle = {
  ...fitStyle,
  position:"absolute", 
  top:0, 
  left:0,
  width: "100%",
  height: "100%",
}

export const zStackStyle = {
  position: "relative"
}

export function ZStack({style, children}) {
  return <div className="ZStack" style={{...style, position: "relative"}} children={children}/>;
}

export const pointerEventsAutoStyle = {
  pointerEvents: "auto"
}

export const pointerEventsNoneStyle = { // For divs that can be clicked through. 
  pointerEvents: "none" 
}

export const whiteFadeStyle = {
  backgroundImage: "linear-gradient(to bottom, rgba(255, 255, 255, 0), white, white)"
}

/**
 * Padders
 */

export function Flexer({style, overflowVisible=false}) {
  if (overflowVisible) style={...style, overflow: "visible"};
  return <div className="Flexer" style={{...flexGrowShrinkStyle, ...style}}/>
}

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

/**
 * Center and middle
 */
export function Middle({style, children}) {
  const spaceAround = {
    justifyContent : "space-around" // Note: did not work with camel case for some reason!
  };
  return <div className="Middle" style={{...columnStyle, ...spaceAround, ...style}} children={children}/>;
}

export function Center({style, children}) {
  const spaceAround = {
    justifyContent : "space-around" // Note: did not work with camel case for some reason!
  };
  return <div className="Center" style={{...rowStyle, ...spaceAround, ...style}} children={children}/>;
}

export function CenterMiddle({style, children, overflowVisible=false}) {
  if (overflowVisible) style={...style, overflow: "visible"};
  return (
    <Center style={style}>
      <Middle style={{overflow: overflowVisible ? "visible" : "hidden"}} children={children}/>
    </Center>
  );
}


/**
 * Child placement styles
 */
 export const naturalSizeStyle = { // For bottom up components inside scroll compoennts
  overflow: "visible",
  flexGrow: 0,
  flexShrink: 0,
  flexBasis: 'auto'
}

export const fitStyle = {
  overflow: "hidden", // Enforce top down bounds. If set to auto or display, bounds might be influenced by grand children that are too large to fit within their given space. 
  boxSizing: "border-box",  // Each component needs to be responsible of their own padding/border space...
  width: "100%",
  height: "100%"
} 

// For components that needs to grow and shrink without regard to its contents. Scroll panels typically, or for equal distribution of space.
export const flexGrowShrinkStyle = {
  overflow: "hidden", 
  boxSizing: "border-box",
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 1,
}

export function flexGrowShrinkRatioStyle(ratio) {
  return {
    overflow: "hidden", 
    boxSizing: "border-box",
    flexGrow: ratio,
    flexShrink: 1,
    flexBasis: 1,
  };
}

// For a component that stubbornly needs to keep its size in the flex direction. For buttons etc.  
export const flexAutoStyle = {
  overflow: "hidden",
  boxSizing: "border-box",
  flexGrow: 0,
  flexShrink: 0,
  flexBasis: 'auto'
};

export const flexShrinkAutoStyle = {
  overflow: "hidden",
  boxSizing: "border-box",
  flexGrow: 0,
  flexShrink: 1,
  flexBasis: 'auto'
};

// Convenience for an auto width style with fixed width. 
export function flexAutoWidthStyle(width) {
  return {
    overflow: "hidden",
    boxSizing: "border-box",
    width: width, 
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto'    
  };
};

// Convenience for an auto width style with fixed height. 
export function flexAutoHeightStyle(height) {
  return {
    overflow: "hidden",
    boxSizing: "border-box",
    height: height, 
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto'
  };
};

// Convenience for an auto width style with fixed width. 
export function flexAutoWidthHeightStyle(width, height) {
  return {
    overflow: "hidden",
    boxSizing: "border-box",
    width: width, 
    height: height, 
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto'    
  };
};

// For components that needs to grow and shrink with the size of its contents as base. This was needed for some IE11 support. 
export const flexGrowShrinkAutoStyle = {
  overflow: "hidden",
  boxSizing: "border-box",
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 'auto',
}

export const flexGrowAutoStyle = {
  overflow: "hidden",
  boxSizing: "border-box",
  flexGrow: 1,
  flexShrink: 0,
  flexBasis: 'auto',  
} 

export function Wrapper({style, children, overflowVisible=false}) {
  if (overflowVisible) style={...style, overflow: "visible"};
  const divStyle = {
    overflow: "hidden", // Enforce top down bounds. If set to auto or display, bounds might be influenced by grand children that are too large to fit within their given space. 
    boxSizing: "border-box",  // Each component needs to be responsible of their own padding/border space...
    ...style
  };
  return <div className="Wrapper" style={divStyle} children={children}/>;
}

