import { action, autorun, observable, reaction, runInAction } from "mobx";
import { log, loge } from "../../components/utility/Debug";
import categoryFolderImage from '../../assets/folder_category.svg';
import folderImage from '../../assets/folder.svg';
import { AllDesigns } from "../createDemoData";

export function createDifferenceFilter(baseFilter, negatives) {
  const filter = {
    baseFilter, 
    negatives, 
   
    includes: function(design) {
      const andNotReducer = (accumulator, currentValue) => accumulator && !currentValue;
      return filter.baseFilter.includes(design) && filter.negatives.map(filter => filter.includes(design)).reduce(andNotReducer, true);
    },

    categorizeToInclude(design) {},

    toString: function() {
      return filter.baseFilter.toString() + filter.negatives.map(filter => (" - " + filter.toString())).join("");
    }
  }
  return filter;
}

export function createCategoryFilter(category) {
  const filter = {
    category,

    includes: function(design) {
      if (filter.category === AllDesigns) {
        return true;
      } else {
        return design.in(category); 
      }
    },

    categorizeToInclude(design) {
      design.categorize(filter.category);
    },

    toString: function() {
      return category.name;
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
    
    categorizeToInclude(design) {
      filter.first.categorizeToInclude(design);
      filter.second.categorizeToInclude(design);
    },

    toString: function() {
      return first.toString() + " / " + second.toString();
    }
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

    categorizeToInclude(design) {
      if (!filter.filters.empty()) {
        filter.filters[0].categorizeToInclude(design);
      }
    },

    toString: function() {
      return filter.filters.map(filter => filter.toString()).join(" + ");
    }
  };
  return filter; 
}