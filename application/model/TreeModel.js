import { autorun, observable, reaction } from "mobx";

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
        parent: null,
        name,
        category,
        children: observable(children)
    })
    children.forEach(child => child.parent = tree);
    return tree; 
}

export function createCategory(name) {
    return observable({
        name,
    });
}

export function createDesign(name, image, categories) {
    return observable({
        name,
        image, 
        categories: observable(categories)
    });
}

export function createStore() {
    return observable({
        items: observable([])
    });
}

export function createFilterStore(filter, source) {
    let store = createStore();
    store.reactionDisposer = reaction(
        () => {
            let result = [];
            source.items.forEach(item => { 
                if (filter.include(item)) {
                    result.push(item);
                }
            })
            return result; 
        },
        result => {
            action(() => {
                store.items.splice(0, store.items.length);
                result.forEach((item) => store.items.push(item));
            })();
        });
    return store;
}



// export class TreeModel {
//     constructor() {

//     }
// }