import { action, autorun, observable, reaction, runInAction } from "mobx";
import { log, loge } from "../../components/utility/Debug";
import categoryFolderImage from '../../assets/folder_category.svg';
import folderImage from '../../assets/folder.svg';
import { AllDesigns } from "../createDemoData";

export function simplifyUnion(baseFilter, unionFilterList) {
  function simplifyFilter(filter) {
    const baseOk = baseFilter.isAllIntersections();
    const filterOk = filter.isAllIntersections();
    if (baseFilter.isAllIntersections() && filter.isAllIntersections()) {
      const baseMap = baseFilter.addAllIntersectedCategories({});
      const filterMap = filter.addAllIntersectedCategories({});
      for (let id in filterMap) {
        if (baseMap[id]) {
          delete filterMap[id];
        }
      }
      const categories = Object.values(filterMap);
      return createIntersectionFilter(categories.map(category => createCategoryFilter(category)));
    }
    throw new Error("Could not simplify!")
  }
      
  return unionFilterList.map(filter => simplifyFilter(filter));
}

export function createDifferenceFilter(baseFilter, negatives) {
  const filter = {
    isFilter: true,
    isDifferenceFilter: true,

    baseFilter,  
    negatives, 

    isAllIntersections: function() {
      return false;
    },
   
    addAllIntersectedCategories: function(map) {
      throw new Error("Does not apply");
    },

    addAllIntersectedFilters: function(list) {
      throw new Error("Does not apply");
    },

    includes: function(design) {
      const andNotReducer = (accumulator, currentValue) => accumulator && !currentValue;
      return filter.baseFilter.includes(design) && filter.negatives.map(filter => filter.includes(design)).reduce(andNotReducer, true);
    },

    categorizeToInclude(design) {},

    toEquationString: function() {
      return filter.baseFilter.toEquationString() + filter.negatives.map(filter => (" - " + filter.toEquationString())).join("");
    }
  }
  return filter;
}

export function createCategoryFilter(category) {
  const filter = {
    isFilter: true,
    isCategoryFilter: true,
    category,

    isAllIntersections: function() {
      return true;
    },

    normalized() {
      const children = [filter];
      let result = createIntersectionFilter(children);
      result.isNormalized = true;
      return result;
    },

    addAllIntersectedCategories: function(map) {
      map[filter.category.id] = filter.category;
      return map;
    },

    addAllIntersectedFilters: function(list) {
      list.push(this);
      return list;
    },

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

    toEquationString: function() {
      return category.name;
    }
  }
  return filter;
}

export function createIntersectionFilter(filters) {
  const filter = {
    isFilter: true,
    isIntersectionFilter: true,
    filters: observable(filters), 

    isAllIntersections: function() {
      for (let child of filter.filters) {
        if (!child.isAllIntersections()) {
          return false;
        }  
      }
      return true;
    },

    isAllDesignsFilter() {
      return filter.filters.length === 1 
        && filter.filters[0].isCategoryFilter 
        && filter.filters[0].category === AllDesigns;
    },

    fingerprint() {
      if (!filter.isNormalized) throw new Error("Normalize first");
      return "[" + 
      filter.filters
        .map(filter => filter.category.id)
        .sort((a, b) => (a - b))
        .join("|") 
      + "]";
    },

    normalized() {
      loge("normalize")
      const children = [];
      filter.addAllIntersectedFilters(children);
      children.sortOn(child => child.category.id);
      let result = createIntersectionFilter(children);
      result.isNormalized = true;
      log(result.isNormalized)
      return result; 
    },

    addAllIntersectedCategories: function(map) {
      filter.filters.forEach(filter => filter.addAllIntersectedCategories(map));
      return map;
    },

    addAllIntersectedFilters: function(list) {
      filter.filters.forEach(filter => filter.addAllIntersectedFilters(list));
      return list;
    },

    includes: function(design) {
      for (let child of filter.filters) {
        if (!child.includes(design)) {
          return false; 
        }
      }
      return true; 
    }, 
    
    categorizeToInclude(design) {
      filter.filters.forEach(filter => filter.categorizeToInclude(design));
    },

    toEquationString: function() {
      // return "Foo"
      let result = "";
      let first = true;
      filter.filters.forEach(child => {
        if (child.isCategoryFilter && child.category === AllDesigns) {
          if (filter.filters.length === 1) {
            result += child.toEquationString();
          }
        } else {
          if (first) {
            first = false; 
          } else {
            result += ", ";
          }

          result += child.toEquationString()
        }
      });
      return result;
    }
  };
  return filter; 
}

export function createUnionFilter(filters) {
  const filter = {
    filters,
    isFilter: true,
    isUnionFilter: true,

    isAllIntersections: function() {
      return false; 
    },

    addAllIntersectedCategories: function(map) {
      // throw new Error("Does not apply!");
    },

    addAllIntersectedFilters: function(list) {
      // throw new Error("Does not apply!");
    },

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

    toEquationString: function() {
      return filter.filters.map(filter => filter.toEquationString()).join(" + ");
    }
  };
  return filter; 
}
