import React from "react";
import { log } from "./utility/Debug";
 
const keyStates = {};

let initialized = false;

export function initializeKeyTracker() {
  if (initialized) return;

  document.addEventListener("keydown", function(event) {
    log(event.key);
    keyStates[event.code] = 1;
    // log(keyStates);
  }, true);
  
  document.addEventListener("keyup", function(event) {
    keyStates[event.code] = 0;
    // log(keyStates);
  }, true);
 
  initialized = true; 
}

export function keyDown(code) {
  return typeof(keyStates[code]) === 'undefined' ? 0 : keyStates[code]; 
}
 
export function anyKeyDown(codes) {
  for (let code of codes) {
    if (keyDown(code)) return true;
  }
  return false;
}
 
 