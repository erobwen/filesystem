import React from 'react';
import { iconSize } from './Style';

/**
 * Icon
 */
//  export const Icon = observer(function({style, size, image, tooltip=false}) {
export function Icon({style, size, width, image, tooltip=false}) {
  // if (typeof(size) === 'undefined' || size === null) size = dynamicTheme.clickTargetSize;
  if (typeof(size) === 'undefined' || size === null) size = iconSize;
  if (typeof(width) === "undefined") width = size;
  let img =  <img key={width} style={{width: width, height: size, ...style}} src={image}/>
  // if (!!tooltip) {
  //   return(<Tooltip title={tooltip}>
  //    {img}
  //   </Tooltip>);
  // } else {
  return img;
    // }
};

  // Icon.getLayout = function() { 
  //   return { width : 20 };
  //   // return { width : dynamicTheme.clickTargetSize };
  // }
  

  
