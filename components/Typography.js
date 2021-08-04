import React from 'react';

/**
 * Icon
 */
//  export const Icon = observer(function({style, size, image, tooltip=false}) {
 export function Icon({style, size, image, tooltip=false}) {
    // if (typeof(size) === 'undefined' || size === null) size = dynamicTheme.clickTargetSize;
    if (typeof(size) === 'undefined' || size === null) size = 20;
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
  