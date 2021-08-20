import { DesignsView } from "../../components/DesignExplorer/DesignsView";
import { vault } from "./Vault";

let nextRuleId = 1;

export class Rule {
  constructor({cause, effect, folder}) {
    this.id = nextRuleId++;
    this.cause = cause; 
    this.effect = effect;
    this.folder = folder;
    vault.rules.addRule(this);
  }
}

export class RuleStore {
  constructor() {
    this.rules = [];
  }

  addRule(rule) {
    this.rules.push(rule);
  }

  removeRule(rule) {
    this.rules.remove(rule);
    // designSto.
  }
}