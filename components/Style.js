import React from 'react';
import { fitStyle } from './Layout';

export const paperShadow = "1px 1px 4px 2px rgba(0, 0, 0, 0.1)"; 
export const hardPaperShadow = "1px 1px 2px 1px rgba(0, 0, 0, 0.2)"; 


export const panelStyle = {
  boxSizing: "border-box",
  borderWidth: "1px",
  borderColor: "rgb(200,200,200)",
  borderRadius: "4px",
  borderStyle: "solid",
  backgroundColor: "white",
  boxShadow: paperShadow,
};

export const sidePanelWidth = 200;

export const panelPadding = 15;

export const iconSize = 25;

export const panelPaddingStyle = {
  padding: panelPadding
};

export function transparentBlue(opacity) {
  return "rgba(30, 30, 124, " + opacity + ")";
}

export function transparentGray(opacity) {
  return "rgba(0, 0, 0, " + opacity + ")";
}

export function grayColor(value) {
  return "rgb(" + value + ", " + value + ", " + value + ")"; 
}

export const transparentColor = "rgba(1, 1, 1, 0)";

export const selectionStyle = {
  overflow: "hidden",
  boxSizing: "border-box",
  borderWidth: "1px",
  borderColor: transparentBlue(0.2),
  borderStyle: "solid",
  backgroundColor: transparentBlue(0.1),
};

export const unselectedStyle = {
  overflow: "hidden",
  boxSizing: "border-box",
  borderWidth: "1px",
  borderColor: transparentColor,
  borderStyle: "solid",
  backgroundColor: transparentColor,
}

export function SelectionBase({style, render, children, selected}) {
  if (render) {
    return <div style={{...style, ...(selected ? selectionStyle : unselectedStyle)}}>{render(fitStyle)}</div>;
  } else {
    return <div style={{...style, ...(selected ? selectionStyle : unselectedStyle)}}>{children}</div>;
  }
}

function panelBorder(direction) {
  const style = {
    overflow: "hidden",
    boxSizing: "border-box",
    borderColor: grayColor(Math.floor(0.9 *  255)),
    borderStyle: "solid",
    backgroundColor: transparentColor,
  }
  style["border" + direction + "Width"] = "1px";
  return style;
}

export const panelBorderStyle = panelBorder("");
export const panelBorderRightStyle = panelBorder("Right");
export const panelBorderLeftStyle = panelBorder("Left");
export const panelBorderTopStyle = panelBorder("Top");
export const panelBorderBottomStyle = panelBorder("Bottom");

// const borderStyle = {
//   overflow: "hidden",
//   boxSizing: "border-box",
//   borderWidth: top + "px " + right +"px " + bottom + "px " + left + "px",
//   borderStyle: "solid",
//   borderColor: borderColor,
// };