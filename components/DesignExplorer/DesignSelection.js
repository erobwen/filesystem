import { observable } from "mobx";
import { anyKeyDown } from "../KeyStateTracker";
import { log, loge } from "../utility/Debug";


export function createSelection(deltaStore) {
  const selection = {
    add: function(itemOrItems) {
      deltaStore.resetDelta();
      let items = itemOrItems;
      if (!(items instanceof Array)) items = [items];
      items.forEach(item => selection.items[item.id] = item);
    }, 

    set: function(itemOrItems) {
      deltaStore.resetDelta();
      let items = itemOrItems;
      if (!(items instanceof Array)) items = [items];
      for (let itemId in selection.items) {
        delete selection.items[itemId];
      }
      items.forEach(item => selection.items[item.id] = item);
    }, 


    remove: function(itemOrItems) {
      deltaStore.resetDelta();
      let items = itemOrItems;
      if (!(items instanceof Array)) items = [items];
      items.forEach(item => delete selection.items[item.id]);
    },
  
    clear: function() {
      deltaStore.resetDelta();
      for (let itemId in selection.items) {
        delete selection.items[itemId];
      }
    }, 

    click: function(item) {
      if (anyKeyDown(["ControlLeft", "ControlRight"])) {
        if (selection.items[item.id]) {
          selection.remove(item);
        } else {
          selection.add(item);
        }  
      } else {
        selection.set(item);
      }
    },
  
    items: observable({})
  };
  return selection;
}
