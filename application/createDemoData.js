import { createStore } from "./model/Store";
import { Design } from "./model/Design";
import { createCategory } from "./model/Category";
import { createFolder } from "./model/Folder";

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
import trashCanImage from "../assets/trash_can.svg"
import sewingMachineImage from "../assets/sewing_machine.svg"
import heartImage from "../assets/heart.svg"
import lockImage from "../assets/lock.svg"
import allDesignsImage from "../assets/all_designs.svg"
import vaultImage from "../assets/vault.svg"
import implyImage from "../assets/imply.svg"


export const AllDesigns = createCategory("AllDesigns");

const Dog = createCategory("Dog");
const Cat = createCategory("Cat");
const Boat = createCategory("Boat");

const Ribbon = createCategory("Ribbon");
const Felting = createCategory("Felting");

const Draft = createCategory("Draft");
const Finished = createCategory("Finished");
const Vault = createCategory("Vault");

const Favorite = createCategory("Favorite");
const MyEpic2 = createCategory("MyEpic2");
const RecycleBin = createCategory("RecycleBin");


const categories = createStore();
[Dog, Cat, Boat, Ribbon, Felting, Draft, Finished, Vault, Favorite, MyEpic2, RecycleBin].forEach(category => categories.items.push(category));

let folder = createFolder;
export const demoFolder = folder("Quick access",
  folder({image: allDesignsImage, category: AllDesigns, name: "All Designs"},
    folder(Cat, 
      folder(Ribbon)),
    folder(Dog, 
      folder(Felting)),
    folder(Boat)),
  folder("Design Stages", 
    folder({image: implyImage, category: Draft}), 
    folder({image: implyImage, category: Finished})), 
  folder({image: vaultImage, category: Vault}),
  folder({image: heartImage, category: Favorite}),
  folder({image: sewingMachineImage, category: MyEpic2}),
  folder({image: trashCanImage, category: RecycleBin})
);
demoFolder.setupFilters();

export const demoDesigns = createStore();
demoDesigns.items.push(new Design("Striped Boat", boat1, [Boat]));
demoDesigns.items.push(new Design("Stylized boat", boat2, [Boat, Ribbon]));
demoDesigns.items.push(new Design("Boat with red cross", boat3, [Boat, Felting]));
demoDesigns.items.push(new Design("Fancy cat", cat1, [Cat, Ribbon, Draft]));
demoDesigns.items.push(new Design("Multi cat", cat2, [Cat]));
demoDesigns.items.push(new Design("Yawn!", cat3, [Cat, Draft]));
demoDesigns.items.push(new Design("Cat on water", catboat1, [Cat, Boat, Felting]));
demoDesigns.items.push(new Design("Window scene", catboat2, [Cat, Boat, Finished, Vault]));
demoDesigns.items.push(new Design("Friends", catdog1, [Cat, Dog]));
demoDesigns.items.push(new Design("Red and blue cat", catdog2, [Cat, Dog]));
demoDesigns.items.push(new Design("Best Friends", catdog3, [Cat, Dog, Ribbon]));
demoDesigns.items.push(new Design("Happy ride!", catdogboat1, [Cat, Dog, Boat, Felting, MyEpic2]));
demoDesigns.items.push(new Design("Mr dog", dog1, [Dog, Finished]));
demoDesigns.items.push(new Design("Shepherd", dog2, [Dog, Felting, Vault, Finished]));
demoDesigns.items.push(new Design("Funky dog", dog3, [Dog]));
demoDesigns.items.push(new Design("Sailor dog", dogboat1, [Dog, Boat, Draft]));
demoDesigns.items.push(new Design("Away", dogboat2, [Dog, Boat]));


export const demoVault = {
    designs: demoDesigns,
    folder: demoFolder,
    categories: categories
}

