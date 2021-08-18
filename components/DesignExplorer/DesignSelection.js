import { observable } from "mobx";
import { anyKeyDown } from "../KeyStateTracker";
import { log, loge } from "../utility/Debug";


export class DesignSelection {
  constructor(explorerModel) {
    this.items = observable({});;
    this.explorerModel = explorerModel;
  }

  initialize() {}

  add(itemOrItems) {
    this.explorerModel.onDesignSelectionChange();
    let items = itemOrItems;
    if (!(items instanceof Array)) items = [items];
    items.forEach(item => this.items[item.id] = item);
  }

  set(itemOrItems) {
    this.explorerModel.onDesignSelectionChange();
    let items = itemOrItems;
    if (!(items instanceof Array)) items = [items];
    for (let itemId in this.items) {
      delete this.items[itemId];
    }
    items.forEach(item => this.items[item.id] = item);
  }

  remove(itemOrItems) {
    this.explorerModel.onDesignSelectionChange();
    let items = itemOrItems;
    if (!(items instanceof Array)) items = [items];
    items.forEach(item => delete this.items[item.id]);
  }

  clear() {
    this.explorerModel.onDesignSelectionChange();
    for (let itemId in this.items) {
      delete this.items[itemId];
    }
  }

  click(item) {
    if (anyKeyDown(["ControlLeft", "ControlRight"])) {
      if (this.items[item.id]) {
        this.remove(item);
      } else {
        this.add(item);
      }  
    } else {
      this.set(item);
    }
  }
} 

