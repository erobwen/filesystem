
let finished = false;


export class MultiPromise {
  constructor(promiseFunction) {
    this.waitCount = 0;
    this.results = [];
    promiseFunction(this.waitFor.bind(this));
  }

  waitFor(promiseOrAction) {
    this.waitCount++;
    let promise = (promiseOrAction instanceof Promise) ? promiseOrAction : promiseOrAction(); 

    promise

      .then((result) => {
        this.results.push(result);
        if (--this.waitCount === 0) {
          result = this.joinFunction ? this.joinFunction(this.results) : this.results;
          result = this.onDone(result);
          if (this.onDoneResolve) this.onDoneResolve(result);
        }
      })

      .catch((error) => {
        console.warn("error in MultiPromise");
        console.log(error);
        if (this.onDoneReject) this.onDoneReject();
      }) 
  }

  then(onDone) {
    this.onDone = onDone;
    return new Promise((resolve, reject) => {
      this.onDoneResolve = resolve; 
      this.onDoneReject = reject;
    })
  }
}


export const javaScriptUtility = {
  install(){
    if (finished) return;
    finished = true;

    // This could not be here, destroyed MobX somehow!
    // Object.prototype.needsMerge = function(other) { // Returns true if there is any point to mergeing other into this
    //   for (let property in other) {
    //     if (other[property] !== this[property]) {
    //       return true; 
    //     }
    //   }
    //   return false; 
    // }

    Array.prototype.toBooleanMap = function() {
      const result = {};
      this.forEach(item => { result[item] = true; });
      return result; 
    }

    Array.prototype.empty = function() {
      return this.length === 0;
    }

    Array.prototype.clear = function() {
      this.length = 0;
    }

    Array.prototype.copy = function() {
      let copy = [];
      for (let item of this) {
        copy.push(item);
      }
      return copy;
    }

    Array.prototype.pushAll = function(other) {
      if (other instanceof Array) other.forEach(item => {this.push(item)});
    }

    Array.prototype.sortOn = function(keyFunction, reverse) {
      // logg("sortOn");  
      // log(reverse);

      function compareKey(a, b, reverse) {
        const factor = reverse ? -1 : 1;
        const type = typeof(a); 
        if (type === "number") {
          return (a - b) * factor;
        } else if (type === "string"){
          if(a < b) { return -1 * factor; }
          if(a > b) { return 1 * factor; }
          return 0;
        } else if(type === "undefined") {
          return 0;
        } else {
          throw new Error(`Key type ${type} not supported by sortOn`);
        }
      }
      
      return this.sort((itemA, itemB) => {
        let keyA = keyFunction(itemA);
        let keyB = keyFunction(itemB);

        if (keyA instanceof Array) {
          let index = 0; 
          while(index < keyA.length && keyA[index] === keyB[index]) {
            index++;
          }
          if (index === keyA.length) return 0; // Both keys are identical!
          return compareKey(keyA[index], keyB[index], reverse ? reverse[index] : false);
        } else {
          return compareKey(keyA - keyB, reverse) 
        }
      });
    }

    Array.prototype.contains = function(target) {
      const index = this.findIndex(element => {
        return element === target;
      });
      return index >= 0;
    }

    Array.prototype.remove = function(target) {
      const index = this.findIndex((element) => {
        return element === target;
      });
      if (index >= 0) {
        this.splice(index, 1);
        return true;
      } else {
        return false; 
      }
    }

    Array.prototype.replace = function(target, replacement) {
      const index = this.findIndex((element) => {
        return element === target;
      });
      if (index >= 0) {
        this.splice(index, 1, replacement);
        return true;
      } else {
        return false; 
      }
    }

    Array.prototype.first = function() {
      return this[0];
    }

    Array.prototype.last = function() {
      return this[this.length-1];
    }

    Array.prototype.withSeparator = function (separatorOrSeparatorCreator) {
      const result = [];
      this.forEach((item, index) => {
        const last = (index === this.length - 1);
        result.push(item);
        if (!last) {
          if (typeof(separatorOrSeparatorCreator) === "function") {
            result.push(separatorOrSeparatorCreator(index))
          } else {
            result.push(separatorOrSeparatorCreator);
          }
        }
      });
      return result;
    } 

    // Did not work, because it disturbs React somehow.
    // Object.prototype.SuperPrototype = function() {
    //   return Object.getPrototypeOf(Object.getPrototypeOf(this));
    // }
  }

}

export function argumentList(argumentsObject) {
  return Array.prototype.slice.call(argumentsObject);
}

export function classMixin(target, ...sources) {
  for (let source of sources) {
    classMixinOne(target, source);
  }
}

// If both mixins have the same function declared, call both with the same arguments.
function joinMethods(target, source, functionName) {
  const firstFunction = target.prototype[functionName];
  const secondFunction = source.prototype[functionName];

  target.prototype[functionName] = function() {
    const arglist = argumentList(arguments);
    // log(arglist);
    let value1 = firstFunction.apply(this, arglist);
    let value2 = secondFunction.apply(this, arglist);
    if (value1) return value1;
    if (value2) return value2;
  }
}

export function inherits(Class, PotentialBaseClass) {
  return (Class === PotentialBaseClass) || (Class.prototype instanceof PotentialBaseClass);
}

export function assert(condition) {
  // log(condition);
  if(!condition) {
    throw new Error("Failed assertion");
  }
}

export function classMixinOne(target, source) {
  // logg("mixin target: " + target.name);
  for (var key of Object.getOwnPropertyNames(source.prototype)) {
    if (!target.prototype[key]) { // !Object.hasOwnProperty(target.prototype, key)
      // log("augmenting " + key);
      target.prototype[key] = source.prototype[key];
    } else {
      // log("joining " + key);
      joinMethods(target, source, key);
    }
  }
}

// Create a property friendly string out of an object
export function objectToKey(object) {
  JSON.stringify(object).replace(/[^a-zA-Z0-9 ]/g, "_");
}

// import { assert, inherits, argumentList, classMixin } from 'components/utility/JavaScriptUtility';