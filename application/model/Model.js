import { action, autorun, observable, reaction, runInAction } from "mobx";
import { log, loge } from "../../components/utility/Debug";
import categoryFolderImage from '../../assets/folder_category.svg';
import folderImage from '../../assets/folder.svg';

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
    }
  }

  const folder = observable({
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

export function createCategoryFilter(category) {
  const filter = {
    category,
    includes: function(design) {
      log(design.categories);
      return design.categories.contains(category); 
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

export function createUnionFilter(first, second) {
  const filter = {
    first, 
    second, 
    includes: function(design) {
      return filter.first.includes(design) || filter.second.includes(design);
    }, 
  };
  return filter; 
}

export function createCategory(name) {
  return observable({
    isCategory: true,
    name,
  });
}

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

export function createStore() {
  return observable({
    items: observable([]),
    reactionDisposer: null
  });
}

export function createFilterStore(filter) {
  if (typeof(filter) === "undefined") filter = null;
  let store = createStore();
  store.filter = filter;
  store.initialize = function(filter, source) {
    store.reactionDisposer = reaction(
      () => {
        loge("trigger filter store");
        let result = [];
        source.items.forEach(item => { 
          if (!store.filter || store.filter.includes(item)) {
            result.push(item);
          }
        })
        // log(result);
        return result; 
      },
      (result, previousValue, reaction) => {
        // log("before action")
        runInAction(() => {
          loge("updating filter store");
          store.items.splice(0, store.items.length);
          result.forEach((item) => store.items.push(item));
        });
      }, {fireImmediately: true});    
  }
  return store;
}

function createDeltaItem(item, status) {
  return observable({
    item: item,
    status: status
  });
}

export function createDeltaStore() {
  const store = createStore();

  store.resetDelta = function() {
    for (let id in store.originalMap) {
      let deltaItem = store.originalMap[id];
      if (deltaItem.status === "removed") {
        store.items.remove(deltaItem);
        delete store.originalMap[id]
      } else if (deltaItem.status === "added") {
        deltaItem.status = "original";
      }
    }
  }

  store.initialize = function(source) {
    runInAction(() => {
      store.originalMap = {};
      store.items.length = 0;
      source.items.map(item => {
        const deltaItem = createDeltaItem(item, "original");
        store.items.push(deltaItem);
        store.originalMap[item.id] = deltaItem;
      });    
    });

    store.reactionDisposer = reaction(
      () => {
        const newItems = [];
        source.items.forEach(item => { 
          newItems.push(item);
        })
        return newItems; 
      },
      (newItems, previousValue, reaction) => {
        loge("delta store reacting.");
        const newMap = {};
        newItems.forEach(item => { 
          newMap[item.id] = item;
        });

        runInAction(() => {
          for (let id in store.originalMap) {
            if (typeof(newMap[id]) === "undefined") {
              loge("setting removed");
              store.originalMap[id].status = "removed"
            } else {
              store.originalMap[id].status = "original"
            }
          }
          for (let id in newMap) {
            if (typeof(store.originalMap[id]) === "undefined") {
              const newDeltaItem = createDeltaItem(newMap[id], "added");
              store.items.push(newDeltaItem); // TODO: Insert in right place? But adding is not supported/needed right now. 
              store.originalMap[id] = newDeltaItem;
            }
          }
        });
      }
    );    
  }
  return store; 
}
