import { createCategory, createStore, createTree } from "./model/TreeModel";

const Dog = createCategory("Dog");
const Cat = createCategory("Cat");
const Car = createCategory("Car");
const Boat = createCategory("Boat");

const RibbonDesign = createCategory("RibbonDesign");
const Felting = createCategory("Felting");

const Draft = createCategory("Draft");
const Finished = createCategory("Finished");
const Locked = createCategory("Locked");

const Favorite = createCategory("Favorite");
const MyEpic2 = createCategory("MyEpic2");
const RecycleBin = createCategory("RecycleBin");


const categories = createStore();
[Dog, Cat, Car, Boat, RibbonDesign, Felting, Draft, Finished, Locked, Favorite, MyEpic2, RecycleBin].forEach(category => categories.items.push(category));

export function createTestTree() {
    let tree = createTree;
    let newTree = tree("Quick access",
        tree("My Designs",
            tree(Cat, 
                tree(RibbonDesign)),
            tree(Dog, 
                tree(RibbonDesign)),
            tree(Car, 
                tree(Boat)),
            tree(Boat)),
        tree("Design Stages", 
            tree(Draft), 
            tree(Finished), 
            tree(Locked)),
        tree(Favorite),
        tree(MyEpic2),
        tree(RecycleBin)
    );
    newTree.setupFilters();
    return newTree; 
} 