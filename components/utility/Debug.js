
import { production } from '../../config.js';

// IE compatibility issue. 
export function IEConsoleFix() {
  if(!window.console) {
    window.console = {
      log : function(){},
      warn : function(){},
      error : function(){},
      time : function(){},
      timeEnd : function(){}
    }
  }    
}


export let afterTenSeconds = false;
export let afterFiveSeconds = false;
setTimeout(() => { afterTenSeconds = true; }, 10000)
setTimeout(() => { afterFiveSeconds = true; }, 5000)

// export const log = (!window.console) ? (()=>{}) : console.log; // Would be better since chromes file/row direction would work, but it does not work with IE. 

IEConsoleFix();

let terminateLogging = false; 
let suspendLogging = 0;

export function xlog() {
  if (terminateLogging || suspendLogging > 0) return;
  loggg("End of log");
  terminateLogging = true;
}

const actionInfos = {};

export function logNthTime(count, action) {
  const string = action.toString();
  if (typeof(actionInfos[string]) === 'undefined') {
    actionInfos[string] = {
      actionCount: 1,
      logOnActionCount: count
    }
  }
  const actionInfo = actionInfos[string]; 
  const suspend = actionInfo.actionCount !== actionInfo.logOnActionCount;
  if(suspend) suspendLogging++;
  const returnValue = action();
  actionInfo.actionCount++;
  if(suspend) suspendLogging--;
  return returnValue;
}


export function trace(value) {
  log(value);
  return value;
}

export function log(a) {
  if (production || terminateLogging || suspendLogging > 0) return;
  // throw new Error("Find lost logs!"); 

  // Flatten MobX objects.
  if (a && a.constructor && a.constructor.name.startsWith("Observable")) {
    // try {
      // a = JSON.parse(JSON.stringify(a));

      const visitedSet = {};

      function mobXToJs(entity) {
        if (typeof(entity) === 'object' && entity && entity.$mobx) {

          // Check if mobX object is encountered before.
          if (typeof(visitedSet[entity.$mobx.name]) === "undefined") {
            if (entity.constructor.name === "ObservableArray$$1" ) {
              // MobX array case
              const result = [];
              visitedSet[entity.$mobx.name] = result;
              for (let element of entity) {
                result.push(mobXToJs(element));
              } 
            } else {
              const result = {};
              visitedSet[entity.$mobx.name] = result;
              // MobX object case
             for (let property in entity) {
                // if (!property.startsWith("_")) {
                  result[property] = mobXToJs(entity[property]);
                // }
              }
            }
          }

          // Get cached converted object
          return visitedSet[entity.$mobx.name]; 
        } else {
          return entity;
        }
      }
      a = mobXToJs(a);
    // } catch (error) {
      // console.log("[failed to convert MobX object]");
      // Could not convert, probably because of a loop in the data. 
    // }
  }

  console.log(a);
  return a;
  // Function.apply(console.log, arguments);
}

export function loge(string) { 
  log("<<<" + string + ">>>");
}

export function logg(title) {
  if (typeof(title) !== 'undefined') {
    log("--------------------- " + title + " ---------------------");
  } else {
    log("-----------------------------------------------------------------");
  }
} 

export function loggg(title) {
  if (typeof(title) !== 'undefined') {
    log("==================== " + title + " ====================");
  } else {
    log("========================================================");
  }
}
