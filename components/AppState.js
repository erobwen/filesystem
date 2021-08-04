import { log, logg, loggg } from './utility/Debug.js';
import { observer } from "mobx-react";
import { autorun, observable } from "mobx";

export const appState = observable({
  mobileStyle: null,
  dimensions: null,
  fullScreen: false,
  framed: window.top !== window
});

export function setAppState(property, value, inRender) {
  if (typeof(inRender) === 'undefined') inRender = false; 
  if (appState[property] !== value) {
    // let rendertag = inRender ? " ("+ inRender+")" : "";
    // log("setAppState: " + property + " = " + value + rendertag); 
    if (inRender === "inRender")  {
      setTimeout(() => { // Not allowed to change state directly in render.
        appState[property] = value;
      }, 0);    
    } else {
      appState[property] = value;
    }
  }
}