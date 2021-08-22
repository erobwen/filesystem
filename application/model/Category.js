import { action, autorun, observable, reaction, runInAction } from "mobx";
import { log, loge } from "../../components/utility/Debug";


let nextId = 1;
export function createCategory(name, image) {
  let canBeFilter = true; 

  if (typeof (name) === "object") {
    const setup = name; 
    name = setup.name;
    image = setup.image; 
    if (typeof(setup.canBeFilter) !== "undefined") {
      canBeFilter = setup.canBeFilter;
    } 
  }

  return observable({
    id: nextId++,
    isCategory: true,
    name,
    image,
    canBeFilter
  });
}