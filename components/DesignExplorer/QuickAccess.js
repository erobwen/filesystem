import { quickAccessFolder } from "../../application/createDemoData";
import { createFolder } from "../../application/model/Folder";
import { icons } from "../Icons";
import { log, logg } from "../utility/Debug";


export function pin(standardFilter) {
  logg("pin");
  log(standardFilter.toEquationString())
  standardFilter = standardFilter.normalized(); // Create a copy for the folder
  log(standardFilter.toEquationString());
  const folder = createFolder({
    image: icons.shortcut, 
    name: standardFilter.toEquationString(),  
    filter: standardFilter
  })
  log(folder.filter);
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
  logg("isPinned")
  let result = false; 
  log(quickAccessFolder)
  quickAccessFolder.children.forEach(folder => {
    log(folder.filter.fingerprint());
    log(standardFilter.fingerprint())
    if (folder.filter.fingerprint() === standardFilter.fingerprint()) {
      result = true; 
    }
  });
  log(result);
  return result; 
}