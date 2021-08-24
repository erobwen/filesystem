import { createStore } from "./Store";
import { RuleStore } from "./RuleStore";
import { log } from "../../components/utility/Debug";
import { reaction, runInAction } from "mobx";
import { createFolder } from "./Folder";
import { icons } from "../../components/Icons";


export const vault = {
  designs: createStore(),
  categories: createStore(),
  folder: null,
  rules: new RuleStore(),
}


export const designs = vault.designs;

export const categories = vault.categories;

export const rules = vault.rules;

export const categoriesFolder = createFolder({name: "Categories", image: icons.tagsFlatBlue, category: null, irremovable: true, open: false});
const keyFolderMap = {};

function getFolder(key, category) {
  if (!keyFolderMap[key]) {
    keyFolderMap[key] = createFolder({image: icons.tagFlatBlue, category: category, irremovable: true});
  }
  return keyFolderMap[key]; 
}

const categoriesFolderReaction = reaction(
  () => {
    // return categories.items.copy();
    let copy = [];
    categories.items.forEach(category => copy.push(category));
    return copy; 
  },
  (categories) => {
    runInAction(() => {
      categoriesFolder.children.clear();

      categories.forEach(category => {
        const categoryFolder = getFolder(category.id, category);
        categoriesFolder.addChild(categoryFolder)
        // if (category === Animal) {
        //   categoryFolder.addChild(folder({image: icons.imply, category: Cat}))
        //   categoryFolder.addChild(folder({image: icons.imply, category: Dog}))
        // }
      });  
    });
  }, {fireImmediately: true});