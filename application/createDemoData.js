import { createCategory, createDesign, createStore, createTree } from "./model/TreeModel";
import boat1 from "../assets/designs/boat1.jpg";
import boat2 from "../assets/designs/boat2.jpg";
import boat3 from "../assets/designs/boat3.jpg";
import cat1 from "../assets/designs/cat1.jpg";
import cat2 from "../assets/designs/cat2.jpg";
import cat3 from "../assets/designs/cat3.jpg";
import catboat1 from "../assets/designs/catboat1.jpg";
import catboat2 from "../assets/designs/catboat2.jpg";
import catdog1 from "../assets/designs/catdog1.jpg";
import catdog2 from "../assets/designs/catdog2.jpg";
import catdog3 from "../assets/designs/catdog3.jpg";
import catdogboat1 from "../assets/designs/catdogboat1.jpg";
import dog1 from "../assets/designs/dog1.jpg";
import dog2 from "../assets/designs/dog2.jpg";
import dog3 from "../assets/designs/dog3.jpg";
import dogboat1 from "../assets/designs/dogboat1.jpg";
import dogboat2 from "../assets/designs/dogboat2.jpg";

const Dog = createCategory("Dog");
const Cat = createCategory("Cat");
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
[Dog, Cat, Boat, RibbonDesign, Felting, Draft, Finished, Locked, Favorite, MyEpic2, RecycleBin].forEach(category => categories.items.push(category));

let tree = createTree;
export const demoTree = tree("Quick access",
    tree("My Designs",
        tree(Cat, 
            tree(RibbonDesign)),
        tree(Dog, 
            tree(RibbonDesign)),
        tree(Boat)),
    tree("Design Stages", 
        tree(Draft), 
        tree(Finished), 
        tree(Locked)),
    tree(Favorite),
    tree(MyEpic2),
    tree(RecycleBin)
);
demoTree.setupFilters();

export const demoDesigns = createStore();
demoDesigns.items.push(createDesign("Striped Boat", boat1));
demoDesigns.items.push(createDesign("Stylized boat", boat2));
demoDesigns.items.push(createDesign("Boat with red cross", boat3));
demoDesigns.items.push(createDesign("Fancy cat", cat1));
demoDesigns.items.push(createDesign("Multi cat", cat2));
demoDesigns.items.push(createDesign("Yawn!", cat3));
demoDesigns.items.push(createDesign("Cat on water", catboat1));
demoDesigns.items.push(createDesign("Window scene", catboat2));
demoDesigns.items.push(createDesign("Friends", catdog1));
demoDesigns.items.push(createDesign("Red and blue cat", catdog2));
demoDesigns.items.push(createDesign("Best Friends", catdog3));
demoDesigns.items.push(createDesign("Happy ride!", catdogboat1));
demoDesigns.items.push(createDesign("Mr dog", dog1));
demoDesigns.items.push(createDesign("Shepherd", dog2));
demoDesigns.items.push(createDesign("Funky dog", dog3));
demoDesigns.items.push(createDesign("Sailor dog", dogboat1));
demoDesigns.items.push(createDesign("Away", dogboat2));

