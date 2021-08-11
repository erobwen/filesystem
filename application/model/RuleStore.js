
const ruleStore = {
  rules: [],
  addRule: (cause, effect) => {
    rules.push({
      cause, 
      effect,
      folder: null,
    })
  }
}