import { action, autorun, observable, reaction, runInAction } from "mobx";
import { log, loge } from "../../components/utility/Debug";


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
    store.filter = filter; 
    store.reactionDisposer = reaction(
      () => {
        let result = [];
        source.items.forEach(item => { 
          if (store.filter && store.filter.includes(item)) {
            result.push(item);
          }
        })
        return result; 
      },
      (result, previousValue, reaction) => {
        runInAction(() => {
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

  store.reInitialize = function() {
    if (store.newItems) {
      runInAction(() => {
        store.originalMap = {};
        store.items.length = 0;
        store.newItems.map(item => {
          const deltaItem = createDeltaItem(item, "original");
          store.items.push(deltaItem);
          store.originalMap[item.id] = deltaItem;
        });          
      });
      delete store.newItems;
    }
  }

  store.initialize = function(source) {
    runInAction(() => {
      store.source = source; 
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
        const newMap = {};
        store.newItems = newItems;
        newItems.forEach(item => { 
          newMap[item.id] = item;
        });

        runInAction(() => {
          for (let id in store.originalMap) {
            if (typeof(newMap[id]) === "undefined") {
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
