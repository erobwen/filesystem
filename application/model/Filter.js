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
      const intersectionMap = baseFilter.intersectionMap({});
      const filterIntersectionMap = filter.intersectionMap({});
      for (let id in filterIntersectionMap) {
        if (intersectionMap[id]) {
          delete filterIntersectionMap[id];
        }
      }
      const categories = Object.values(filterIntersectionMap);
      return createIntersectionFilter(categories.map(category => createCategoryFilter(category)));
    }
    throw new Error("Could not simplify!")
  }
      
  return unionFilterList.map(filter => simplifyFilter(filter));
}

export function createDifferenceFilter(baseFilter, negatives) {
  const filter = {
    isDifferenceFilter: true,

    baseFilter,  
    negatives, 

    intersectionMap: function(map) {
      throw new Error("Does not apply!");
    },

    isAllIntersections: function() {
      return false;
    },
   
    addAllIntersectedCategories: function(map) {
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
    isCategoryFilter: true,
    category,

    intersectionMap: function(map) {
      map[category.id] = category;
      return map;
    },

    isAllIntersections: function() {
      return true;
    },

    addAllIntersectedCategories: function(map) {
      map[filter.category.id] = filter.category;
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
    isIntersectionFilter: true,
    filters, 

    intersectionMap: function(map) {
      filters.forEach(filter => filter.intersectionMap(map));
      return map;
    },

    isAllIntersections: function() {
      for (let child of filter.filters) {
        if (!child.isAllIntersections()) {
          return false;
        }  
      }
      return true;
    },

    addAllIntersectedCategories: function(map) {
      filters.forEach(filter => filter.intersectionMap(map));
      return map;
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
        if (!(child.isCategoryFilter && child.category === AllDesigns)) {
          if (first) {
            first = false; 
          } else {
            result += " & ";
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
    isUnionFilter: true,

    intersectionMap: function(map) {
      // throw new Error("Does not apply!");
    },

    isAllIntersections: function() {
      return false; 
    },

    addAllIntersectedCategories: function(map) {
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