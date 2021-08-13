import { action, autorun, makeObservable, observable, reaction, runInAction } from "mobx";
import { log, loge, logg } from "../../components/utility/Debug";
import categoryFolderImage from '../../assets/folder_filter.svg';
import folderImage from '../../assets/folder_outline.svg';
import { createCategoryFilter, createIntersectionFilter, createNullFilter, createUnionFilter } from "./Filter";


export function folder(input, ...children) {
  let name; 
  let image;
  let category;

  if (typeof(input) == "string") {
    name = input;
    category = null;
  } else if (typeof(input) === "object"){
    if (input.isCategory) {
      name = input.name;
      category = input;  
    } else {
      // Setup object
      if (input.category) {
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

  return new Folder(name, image, category, null, children);
}


let nextFolderId = 1;

export class Folder {
  constructor(name, image, category, rule, children) {
    this.id = nextFolderId++;

    this.name = name; 
    this.image = image; 
    this.category = category;
    this.rule = rule;
    
    this.parent = null;
    this.children = observable(children);
    children.forEach(child => child.parent = folder);

    this.filter = null;

    makeObservable(this, {
      name: observable,
      image: observable,
      category: observable,
      rule: observable,
      // parent: observable,
      // filter: observable,
    });    
  }

  getImage() {
    if (this.image) {
      return this.image;
    } else if (this.category) {
      return categoryFolderImage;
    } else {
      return folderImage;
    }
  }

  setupFilters(parentFilter) {
    let bottomUpFilter = false;
    let nullFilter = true;  
    if (parentFilter && this.category) {
      if (parentFilter.isNullFilter) throw new Error("Fuck!");
      this.filter = createIntersectionFilter(parentFilter, createCategoryFilter(this.category));
    } else if (parentFilter) {
      this.filter = parentFilter
    } else if (this.category) {
      this.filter = createCategoryFilter(this.category);
    } else if (this.parent) {
      bottomUpFilter = true;
    } else {
      nullFilter = true; 
    }

    this.children.forEach(child => child.setupFilters(this.filter));
    
    if (bottomUpFilter) {
      this.filter = createUnionFilter(this.children.map(child => child.filter));
    } else if (nullFilter) {
      // this.filter = createNullFilter();
    }
  }
}