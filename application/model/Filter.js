import { action, autorun, observable, reaction, runInAction } from "mobx";
import { log, loge } from "../../components/utility/Debug";
import categoryFolderImage from '../../assets/folder_category.svg';
import folderImage from '../../assets/folder.svg';
import { AllDesigns } from "../createDemoData";

export function createCategoryFilter(category) {
  const filter = {
    category,
    includes: function(design) {
      // log(design.categories);
      // return design.categories.contains(category); 
      if (filter.category === AllDesigns) {
        return true;
      } else {
        return design.categories.contains(category); 
      }
    } 
  }
  return filter;
}

export function createIntersectionFilter(first, second) {
  const filter = {
    first, 
    second, 
    includes: function(design) {
      return filter.first.includes(design) && filter.second.includes(design);
    }, 
  };
  return filter; 
}

export function createUnionFilter(filters) {
  const filter = {
    filters,
    includes: function(design) {
      for (let childFilter of filter.filters) {
        if (childFilter.includes(design)) {
          return true;
        }
      }
      return false; 
    }, 
  };
  return filter; 
}