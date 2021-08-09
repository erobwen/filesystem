import { action, autorun, observable, reaction, runInAction } from "mobx";
import { log, loge } from "../../components/utility/Debug";
import categoryFolderImage from '../../assets/folder_category.svg';
import folderImage from '../../assets/folder.svg';
// import { AllDesigns } from "../createDemoData";



export function createCategory(name) {
  return observable({
    isCategory: true,
    name,
  });
}