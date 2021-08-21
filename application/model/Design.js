import { action, autorun, observable, reaction, runInAction } from "mobx";
import { log, loge } from "../../components/utility/Debug";
import categoryFolderImage from '../../assets/folder_category.svg';
import folderImage from '../../assets/folder.svg';
import { makeObservable, computed, flow } from "mobx"
import { AllDesigns } from "../createDemoData";
import { vault } from "./Vault";
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
    this.userCategories = observable({});
    makeObservable(this, {
        name: observable,
        image: observable,
        ruleCategories: computed,
        userCategories: observable,
        categories: computed,
    });

    categories.forEach(category => {
      this.categorize(category);
    });
  }

  get categories() {
    let result = {}
    for (let id in this.ruleCategories) {
      const category = this.ruleCategories[id];
      if (this.userCategories[id]) {
        result[id] = {
          category,
          user: true,
          rule: true
        };
      } else {
        result[id] ={
          category,
          rule: true,
          user: false
        };
      }
    }

    for (let id in this.userCategories) {
      const category = this.userCategories[id];
      if (!this.ruleCategories[id]) {
        result[id] = {
          category,
          user: true, 
          rule: false
        };
      }
    }
    return result; 
  }

  get ruleCategories() {
    const necessaryUserCategories = {};

    function isCauseMet(userCategories, ruleCategories, cause) { 
      for (let id in cause) {
        if (typeof(ruleCategories[id]) !== "undefined") {
          // Another rule supported the cause
        } else if (typeof(userCategories[id]) !== "undefined") {
          // User supported cause 
          necessaryUserCategories[id] = cause[id];
        } else {
          // No one supported cause
          return false; 
        }
      }
      return true;
    }

    const activeRules = vault.rules.rules.toMap("id");
    let result = {};
    
    let done = false; 
    while (!done) {
      done = true; 
      for (let ruleId in activeRules) {
        const rule = activeRules[ruleId];
        if (isCauseMet(this.userCategories, result, rule.cause)) {
          for(let id in rule.effect) {
            result[id] = rule.effect[id]
          }
          done = false;
          delete activeRules[ruleId];
        }
      }
    }

    const unecessaryUserCategories={};
    for (let id in this.userCategories) {
      if (result[id] && !necessaryUserCategories[id]) {
        unecessaryUserCategories[id] = this.userCategories[id];
      }
    }

    setTimeout(() => {
      for (let id in unecessaryUserCategories) {
        this.uncategorize(unecessaryUserCategories[id]);
      }
    }, 0)

    return result; 
  }

  in(category) {
    return typeof(this.categories[category.id]) !== "undefined";
  }

  categorize(category) {
    if (category === AllDesigns) return;
    this.userCategories[category.id] = category;
  }

  uncategorize(category) {
    delete this.userCategories[category.id];
  }
}
