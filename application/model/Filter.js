import { action, autorun, observable, reaction, runInAction } from "mobx";
import { log, loge } from "../../components/utility/Debug";
import categoryFolderImage from '../../assets/folder_category.svg';
import folderImage from '../../assets/folder.svg';
import { AllDesigns } from "../createDemoData";

export function createDifferenceFilter(baseFilter, negatives) {

  function simplifyNegative(negative) {
    const negativeOk = negative.isAllIntersections();
    const baseOk = baseFilter.isAllIntersections();
    if (baseFilter.isAllIntersections() && negative.isAllIntersections()) {
      const intersectionMap = baseFilter.intersectionMap({});
      const negativeIntersectionMap = negative.intersectionMap({});
      for (let id in negativeIntersectionMap) {
        if (intersectionMap[id]) {
          delete negativeIntersectionMap[id];
        }
      }

      return createIntersectionFilter(Object.values(negativeIntersectionMap));
    }

    return negative;
  }

  negatives = negatives.map(negative => simplifyNegative(negative));

  const filter = {
    baseFilter,  
    negatives, 

    isDifferenceFilter: true,

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

    toString: function() {
      return filter.baseFilter.toString() + filter.negatives.map(filter => (" - " + filter.toString())).join("");
    }
  }
  return filter;
}

export function createCategoryFilter(category) {
  const filter = {
    category,
    isCategoryFilter: true,

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

    toString: function() {
      return category.name;
    }
  }
  return filter;
}

export function createIntersectionFilter(first, second) {
  if (first instanceof Array) {
    const categories = first; 
    const firstCategory = categories.shift();
    if (categories.length === 0) {
      return createCategoryFilter(firstCategory);
    } else {
      return createIntersectionFilter(createCategoryFilter(firstCategory), createIntersectionFilter(categories))
    }
  }
  const filter = {
    first, 
    second, 

    intersectionMap: function(map) {
      first.intersectionMap(map);
      second.intersectionMap(map);
      return map;
    },

    isAllIntersections: function() {
      return first.isAllIntersections() && second.isAllIntersections();
    },

    addAllIntersectedCategories: function(map) {
      filter.first.addAllIntersectedCategories(map);
      filter.second.addAllIntersectedCategories(map);
    },

    includes: function(design) {
      return filter.first.includes(design) && filter.second.includes(design);
    }, 
    
    categorizeToInclude(design) {
      filter.first.categorizeToInclude(design);
      filter.second.categorizeToInclude(design);
    },

    toString: function() {
      if (first.isCategoryFilter && first.category === AllDesigns) {
        return second.toString();
      } else {
        return first.toString() + " & " + second.toString();
      }
    }
  };
  return filter; 
}

export function createUnionFilter(filters) {
  const filter = {
    filters,

    intersectionMap: function(map) {
      throw new Error("Does not apply!");
    },

    isAllIntersections: function() {
      return false; 
    },

    addAllIntersectedCategories: function(map) {
      throw new Error("Does not apply!");
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

    toString: function() {
      return filter.filters.map(filter => filter.toString()).join(" + ");
    }
  };
  return filter; 
}