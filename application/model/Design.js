import { action, autorun, observable, reaction, runInAction } from "mobx";
import { log, loge } from "../../components/utility/Debug";
import categoryFolderImage from '../../assets/folder_category.svg';
import folderImage from '../../assets/folder.svg';
// import { AllDesigns } from "../createDemoData";


let nextDesignId = 1;
export function createDesign(name, image, categories) {
  if (typeof(categories) === "undefined") categories = [];
  return observable({
    id: nextDesignId++,
    name,
    image, 
    categories: observable(categories)
  });
}