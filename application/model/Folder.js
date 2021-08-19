import { action, autorun, makeObservable, observable, reaction, runInAction } from "mobx";
import { log, loge, logg } from "../../components/utility/Debug";
// import categoryFolderImage from '../../assets/folder_filter.svg';
import folderImage from '../../assets/folder_outline.svg';
import { createCategoryFilter, createIntersectionFilter, createNullFilter, createUnionFilter, simplifyUnion } from "./Filter";
import { icons } from "../../components/Icons";
import { featureSwitches } from "../../config";

export function createFolder(input) {
  return folder(input);
}

export function folder(input, ...children) {
  let name = ""; 
  let image;
  let category;
  let irremovable;
  let open = true;

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
        if (input.category.image) {
          image = input.category.image;
        }
      }
    
      if (input.image) {
        image = input.image;
      }

      if (input.name) {
        name = input.name;
      }

      if (input.irremovable) {
        irremovable = input.irremovable; 
      }

      if (typeof(input.open) !== "undefined") {
        open = input.open;
      }
    }
  }

  return new Folder(name, image, category, null, irremovable, children, open);
}


let nextFolderId = 1;

export class Folder {
  constructor(name, image, category, rule, irremovable, children, open) {
    this.id = nextFolderId++;

    this.irremovable = irremovable; 
    this.name = name; 
    this.image = image; 
    this.category = category;
    this.rule = rule;
    this.open = open; 
    
    this.parent = null;
    this.children = observable(children);
    children.forEach(child => child.parent = this);

    this.filter = null;

    makeObservable(this, {
      open: observable,
      name: observable,
      image: observable,
      category: observable,
      rule: observable,
      filter: observable.ref,
      addChild: action,
      removeChild: action,
      // parent: observable,
    });    
  }

  isCategoryFolder() {
    return this.category !== null;
  }

  isTransparentFolder() {
    return this.category === null 
      && this.parent 
      && this.filter === this.parent.filter;
  }

  isUnionFolder() {
    return this.category === null  
      && this.filter.isUnionFilter;
  }

  isNullFolder() {
    return this.filter === null;
  }


  getImage() {
    if (this.image) {
      return this.image;
    } else if (this.category) {
      // return icons.folderCategoryOutline;
      return icons.object;
      return icons.filterPad;
      return icons.folderFilter;
      // return icons.tag;
      // return icons.tagFlat;
        return icons.filter;
    } else {
      // return icons.bullet;
      return icons.objectGroup;
      // return icons.foldersOutline;
      return icons.folderDashed;
    }
  }

  addChild(child) {
    const noIntersectionFilter = (this.filter === null || this.filter.isUnionFilter);
    const trueRoot = this.parent === null;
    
    child.parent = this; 
    child.setupFilters(noIntersectionFilter ? null : this.filter);
    this.children.unshift(child);
    
    if (child.filter && featureSwitches.unionFolders) {
      if (!trueRoot) {
        if (this.filter === null) {   
          this.filter = createUnionFilter([child.filter]);
        } else if (this.filter.isUnionFilter) {
          this.filter.filters.push(child.filter)
        }  
      }
    }
  }

  removeChild(child) {
    this.children.remove(child);

    if (this.filter && this.filter.isUnionFilter) {
      this.filter.filters.remove(child.filter);
    }
  }

  addParentCategoryFilters(map) {
    // Note may only work for filter folders
    if (this.filter) this.filter.addAllIntersectedCategories(map);
  }


  addDirectChildCategoryFilters(map) {
    this.children.forEach(child => {
      if (child.category) {
        map[child.category.id] = child.category;
      }
    })
  }

  addAllIntersectedCategories(map) {
    if (this.filter) this.filter.addAllIntersectedCategories(map);
  }

  setupFilters(parentFilter) {
    let bottomUpFilter = false;
    let nullFilter = false;  
    if (parentFilter && this.category) {
      this.filter = createIntersectionFilter([parentFilter, createCategoryFilter(this.category)]);
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
      this.filter = featureSwitches.unionFolders ? createUnionFilter(this.children.map(child => child.filter)) : null;
    } else if (nullFilter) {
      this.filter = null; 
    }
  }

  getChildUnionFilter() {
    const result = [];
    this.children.forEach(child => child.addUnionFilter(result))
    return createUnionFilter(result);
  }

  getChildUnion() {
    const result = [];
    this.children.forEach(child => child.addUnionFilter(result))
    return result; 
  }

  getSimplifiedChildUnion() {
    let result = [];
    this.children.forEach(child => child.addUnionFilter(result));
    result = simplifyUnion(this.filter, result);
    return result; 
  }

  getSimplifiedChildUnionFilter() {
    return createUnionFilter(this.getSimplifiedChildUnion());
  }

  addUnionFilter(result) {
    if (this.isUnionFolder() || this.isCategoryFolder()) {
      result.push(this.filter);
    } else if (this.isTransparentFolder()) {
      this.children.forEach(child => child.addUnionFilter(result))
    }
  }
}