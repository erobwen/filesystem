import { action, autorun, observable, reaction, runInAction } from "mobx";
import { log, loge } from "../../components/utility/Debug";

let nextTreeId = 1;
export function createTree(categoryOrName, ...children) {
    let name; 
    let category;
    if (typeof(categoryOrName) == "string") {
        name = categoryOrName;
        category = null;
    } else {
        name = categoryOrName.name;
        category = categoryOrName;
    }
    const tree = observable({
        id: nextTreeId++,
        parent: null,
        name,
        category,
        filter: createIntersectionFilter(),
        children: observable(children),
        disposeFilterSetup: null,
        setupFilters: function() {
            tree.disposeFilterSetup = reaction(
                () => {
                    let categories = [];
                    if (tree.parent) {
                        tree.parent.filter.categories.forEach(category => categories.push(category));
                    }
                    if (tree.category) {
                        categories.push(tree.category) 
                    }
                    return categories;
                },
                categories => {
                    action(() => {
                        tree.filter.categories.length = 0;
                        categories.forEach(category => tree.filter.push(category));
                    });
                }
            );
        }
    })
    children.forEach(child => child.parent = tree);
    return tree; 
}

export function createIntersectionFilter() {
    const filter = {
        includes: function(design) {
            for (let category of filter.categories) {
                if (design.categories.indexOf(category) == -1) return false;
            }
            return true; 
        }, 
        categories: observable([])
    };
    return filter; 
}

export function createCategory(name) {
    return observable({
        name,
    });
}

let nextDesignId = 1;
export function createDesign(name, image, categories) {
    return observable({
        id: nextDesignId++,
        name,
        image, 
        categories: observable(categories)
    });
}

export function createStore() {
    return observable({
        items: observable([]),
        reactionDisposer: null
    });
}

export function createFilterStore() {
    let store = createStore();
    store.initialize = function(filter, source) {
        store.reactionDisposer = reaction(
            () => {
                loge("trigger filter store");
                let result = [];
                source.items.forEach(item => { 
                    if (filter.includes(item)) {
                        result.push(item);
                    }
                })
                log(result);
                return result; 
            },
            (result, previousValue, reaction) => {
                log("before action")
                runInAction(() => {
                    loge("updating filter store");
                    store.items.splice(0, store.items.length);
                    result.forEach((item) => store.items.push(item));
                });
            }, {fireImmediately: true});    
    }
    return store;
}



// export class TreeModel {
//     constructor() {

//     }
// }