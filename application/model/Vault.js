import { createStore } from "./Store";
import { RuleStore } from "./RuleStore";
import { log } from "../../components/utility/Debug";

export const vault = {
  designs: createStore(),
  categories: createStore(),
  folder: null,
  rules: new RuleStore(),
}

export const designs = vault.designs;

export const categories = vault.categories;

export const rules = vault.rules;

log(vault);