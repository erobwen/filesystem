import { action, autorun, observable, reaction, runInAction } from "mobx";
import { log, loge } from "../../components/utility/Debug";
import categoryFolderImage from '../../assets/folder_category.svg';
import folderImage from '../../assets/folder.svg';
import { createStore } from "./Store";
// import { AllDesigns } from "../createDemoData";


let nextId = 1;
export function createCategory(name, image) {
  let canBeFilter = true; 

  if (typeof (name) === "object") {
    const setup = name; 
    name = setup.name;
    image = setup.image; 
    if (typeof(setup.canBeFilter) !== "undefined") {
      canBeFilter = setup.canBeFilter;
    } 
  }

  return observable({
    id: nextId++,
    isCategory: true,
    name,
    image,
    canBeFilter
  });
}