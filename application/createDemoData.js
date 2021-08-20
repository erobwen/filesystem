import { createStore } from "./model/Store";
import { Design } from "./model/Design";
import { createCategory } from "./model/Category";
import { createFolder, folder } from "./model/Folder";
import { vault, categories, designs } from "./model/Vault";

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
import { icons } from "../components/Icons";


export const AllDesigns = createCategory("All Designs", icons.allDesigns);

const Animal = createCategory("Animal");
const Dog = createCategory("Dog");
const Cat = createCategory("Cat");
const Vehicle = createCategory("Vehicle");
const Boat = createCategory("Boat");
const Car = createCategory("Car");

const Ribbon = createCategory("Ribbon");
const Felting = createCategory("Felting");

const Draft = createCategory("Draft");
const Finished = createCategory("Finished");
const Protected = createCategory("Protected", icons.lock);

const Favorite = createCategory("Favorite", icons.heart);
const MyEpic2 = createCategory("My Epic 2", icons.sewingMachine);
const RecycleBin = createCategory({name: "Recycle Bin", image: icons.trashCan, canBeFilter: false});

[Animal, Dog, Cat, Vehicle, Boat, Car, Ribbon, Felting, Draft, Finished, Protected, Favorite, MyEpic2, RecycleBin].forEach(category => categories.items.unshift(category));

export const quickAccessFolder = folder({image: icons.quickAccess, name:"Quick Access", category: null, irremovable: true});

vault.folder = folder("Quick access",
  quickAccessFolder,
  folder({image: icons.heart, category: Favorite, irremovable: true}),
  folder({category: Protected, irremovable: true}),
  folder({image: icons.sewingMachine, category: MyEpic2, irremovable: true}),
  folder({image: icons.trashCan, category: RecycleBin, irremovable: true}),

  folder({image: icons.allDesigns, category: AllDesigns, name: "All Designs", irremovable: true},

    folder("Things", 
      folder(Cat), 
      folder(Dog, 
        folder(Ribbon),
        folder(Felting)),
      folder(Boat)),
    folder("Techniques", 
      folder(Ribbon),
      folder(Felting)))

    // folder(Cat, folder(Dog)),
    // folder(Dog)),
);

export const categoriesFolder = createFolder({name: "Categories", image: icons.tagsFlat, category: null, irremovable: true, open: false});
categories.items.forEach(category => {
  const categoryFolder = createFolder({image: icons.tagFlat, category: category, irremovable: true});
  categoriesFolder.addChild(categoryFolder)
  if (category === Animal) {
    categoryFolder.addChild(folder({image: icons.imply, category: Cat}))
    categoryFolder.addChild(folder({image: icons.imply, category: Dog}))
  }
});
// demoFolder.addChild(categoriesFolder);
vault.folder.setupFilters();

designs.items.push(new Design("Striped Boat", boat1, [Boat]));
designs.items.push(new Design("Stylized boat", boat2, [Boat, Ribbon]));
designs.items.push(new Design("Boat with red cross", boat3, [Boat, Felting]));
designs.items.push(new Design("Fancy cat", cat1, [Cat, Favorite,  Ribbon, Draft]));
designs.items.push(new Design("Multi cat", cat2, [Cat]));
designs.items.push(new Design("Yawn!", cat3, [Cat, Favorite,  Draft]));
designs.items.push(new Design("Cat on water", catboat1, [Cat, Favorite,  Boat, Felting]));
designs.items.push(new Design("Window scene", catboat2, [Cat, Favorite,  Boat, Finished, Protected]));
designs.items.push(new Design("Friends", catdog1, [Cat, Favorite,  Dog]));
designs.items.push(new Design("Red and blue cat", catdog2, [Cat, Favorite,  Dog]));
designs.items.push(new Design("Best Friends", catdog3, [Cat, Favorite,  Dog, Ribbon]));
designs.items.push(new Design("Happy ride!", catdogboat1, [Cat, Favorite,  Dog, Boat, Felting, MyEpic2]));
designs.items.push(new Design("Mr dog", dog1, [Dog, Finished]));
designs.items.push(new Design("Shepherd", dog2, [Dog, Felting, Protected, Finished]));
designs.items.push(new Design("Funky dog", dog3, [Dog, Favorite]));
designs.items.push(new Design("Sailor dog", dogboat1, [Dog, Boat, Draft]));
designs.items.push(new Design("Away", dogboat2, [Dog, Boat]));

global.fancyCat = designs.items[3];
global.bestFriends = designs.items[10];
