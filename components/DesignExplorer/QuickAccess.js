import { quickAccessFolder } from "../../application/createDemoData";
import { createFolder } from "../../application/model/Folder";
import { icons } from "../Icons";
import { log, logg } from "../utility/Debug";


export function pin(standardFilter) {
  standardFilter = standardFilter.normalized(); // Create a copy for the folder
  const folder = createFolder({
    image: icons.shortcut, 
    name: standardFilter.toEquationString(),  
    filter: standardFilter
  });
  quickAccessFolder.addChild(folder);
}



export function unpin(standardFilter) {
  let matchingFolder;
  quickAccessFolder.children.forEach(folder => {
    if (folder.filter.fingerprint() === standardFilter.fingerprint()) {
      matchingFolder = folder; 
    }
  });
  quickAccessFolder.removeChild(matchingFolder);
}


export function isPinned(standardFilter) {
  let result = false;
  quickAccessFolder.children.forEach(folder => {
    if (folder.filter.fingerprint() === standardFilter.fingerprint()) {
      result = true; 
    }
  });
  return result; 
}