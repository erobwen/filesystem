import { action, autorun, observable, reaction, runInAction } from "mobx";
import { log, loge } from "../../components/utility/Debug";
import categoryFolderImage from '../../assets/folder_category.svg';
import folderImage from '../../assets/folder.svg';
import { createCategoryFilter, createIntersectionFilter } from "./Filter";


let nextFolderId = 1;
export function createFolder(input, ...children) {
  let name; 
  let category;
  let image;

  if (typeof(input) == "string") {
    name = input;
    category = null;
  } else if (typeof(input) === "object"){
    if (input.isCategory) {
      name = input.name;
      category = input;  
    } else {
      if (input.category) {
        // log(input);
        category = input.category;
        name = category.name;
      }
    
      if (input.image) {
        image = input.image;
      }

      if (input.name) {
        name = input.name;
      }
    }
  }

  const folder = observable({
    isFolder: true,
    id: nextFolderId++,
    parent: null,
    name,
    image,
    category,
    filter: null,
    children: observable(children),
    disposeFilterSetup: null,
    getImage: function() {
      if (folder.image) {
        return folder.image;
      } else if (folder.category) {
        return categoryFolderImage;
      } else {
        return folderImage;
      }
    },

    setupFilters: function(parentFilter) {
      if (parentFilter && folder.category) {
        folder.filter = createIntersectionFilter(parentFilter, createCategoryFilter(folder.category));
      } else if (parentFilter) {
        folder.filter = parentFilter
      } else if (folder.category) {
        folder.filter = createCategoryFilter(folder.category);
      }
      folder.children.forEach(child => child.setupFilters(folder.filter)); 
    }
  })
  children.forEach(child => child.parent = folder);
  return folder; 
}