import { DesignsView } from "../../components/DesignExplorer/DesignsView";

let nextRuleId = 1;

class Rule {
  constructor({cause, effect, folder}) {
    this.id = nextRuleId++;
    this.cause = cause; 
    this.effect = effect;
    this.folder = folder; 
  }
}


class RuleStore {
  constructor() {
    this.rules = [];
  }

  addRule(ownerFolder, cause, effect) {
    rules.push(new Rule({
      cause, 
      effect,
      folder: ownerFolder,
    }));
  }

  removeRule(rule) {
    this.rules.remove(rule);
    designSto.
  }
}