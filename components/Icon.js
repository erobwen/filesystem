import React from 'react';
import { iconSize } from './Style';

/**
 * Icon
 */
//  export const Icon = observer(function({style, size, image, tooltip=false}) {
 export function Icon({style, size, image, tooltip=false}) {
    // if (typeof(size) === 'undefined' || size === null) size = dynamicTheme.clickTargetSize;
    if (typeof(size) === 'undefined' || size === null) size = iconSize;
    let img =  <img style={{width: size, height: size, ...style}} src={image}/>
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
  

  
