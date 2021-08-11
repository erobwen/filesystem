import { action, autorun, observable, reaction, runInAction } from "mobx";
import { log, loge } from "../../components/utility/Debug";
import categoryFolderImage from '../../assets/folder_category.svg';
import folderImage from '../../assets/folder.svg';
import { makeObservable, computed, flow } from "mobx"
// import { AllDesigns } from "../createDemoData";



export class Categorization {
  constructor(design, category, rule) {
    this.design = design;
    this.category = category; 
    this.rule = rule; // = null if categorization was done by user
  }
}

let nextDesignId = 1;

export class Design {
  constructor(name, image, categories) {
    if (typeof(categories) === "undefined") categories = [];
    
    this.id = nextDesignId++;
    this.name = name; 
    this.image = image; 
    this.categorizations = observable([]);
    makeObservable(this, {
        name: observable,
        image: observable,
        categories: computed,
    });

    categories.forEach(category => {
      this.categorizations.push(new Categorization(this, category, null))
    });
  }

  get categories() {
    let categories = {};
    for (let categorization of this.categorizations) {
      categories[categorization.category.id] = categorization.category;
    }
    return Object.values(categories);
  }

  in(category) {
    return this.categories.contains(category);
  }

  uncategorize(category, rule) {
    if (typeof(rule) === "undefined") rule = null;
    this.categorizations.removeWhere(categorization => (categorization.rule === rule && categorization.category === category));
  }
}
