import { action, autorun, observable, reaction, runInAction } from "mobx";
import { icons } from "../../components/Icons";
import { log, loge } from "../../components/utility/Debug";
import { categories } from "./Vault";


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

  const category = observable({
    id: nextId++,
    isCategory: true,
    name,
    image,
    canBeFilter
  });

  categories.items.unshift(category);

  return category; 
}

export const AllDesigns = createCategory("All Designs", icons.allDesigns);