import { computed, makeObservable, observable } from "mobx";
import { categories, createCategory } from "../../application/model/Category";
import { createFolder } from "../../application/model/Folder";
import { log } from "../utility/Debug";
import { capitalizeEveryFirstLetter } from "../utility/javaScriptUtility";

export class FolderSelection {
  constructor(selectedFolder, filteredStore, deltaStore, designSelection) {   
    this.filteredStore = filteredStore;
    this.deltaStore = deltaStore;
    this.designSelection = designSelection;
    this.editFolderName = false;
    
    this.selectedFolder = selectedFolder;
    this.filterOverride = null;
    makeObservable(this, {
      filterOverride: observable.ref,
      selectedFolder: observable.ref,
      editFolderName: observable,
      filter: computed,
    });
  }

  initialize(designs) {
    this.filteredStore.initialize(this.filter, designs);
    this.deltaStore.initialize(this.filteredStore);
  }

  get filter() {
    if (this.filterOverride) {
      return this.filterOverride;
    } else {
      return this.selectedFolder ? this.selectedFolder.filter : null;
    }
  }
  
  onFilterChange() {
    this.designSelection.clear();
    this.filteredStore.filter = this.filter; 
    this.deltaStore.reInitialize();
  }
  
  overrideFilter(filter) {
    this.filterOverride = filter;
    this.onFilterChange();
  }

  resetFilterOverride() {
    this.filterOverride = null;
    this.onFilterChange();
  }

  selectFolder(folder) {
    log(folder.filter);
    this.selectedFolder = folder; 
    this.filterOverride = null;
    this.onFilterChange();
  }

  addFilterFolder(nameOrCategory) {
    let category;
    if (typeof(nameOrCategory) === "string") {
      let name = nameOrCategory;
      name = capitalizeEveryFirstLetter(name);
      category = createCategory(name);
      categories.items.push(category);
    } else {
      category = nameOrCategory;
    }
    this.selectedFolder.addChild(createFolder(category));
  }

  createNewFolderGroup() {
    const newFolder = createFolder()
    this.selectedFolder.addChild(newFolder);
    this.selectFolder(newFolder);
    this.editFolderName = true; 
  }

  removeSelectedFolder() {
    if (this.selectedFolder && this.selectedFolder.parent) {
      let parent = this.selectedFolder.parent;
      parent.children.remove(this.selectedFolder);
      this.selectFolder(parent)
    }
  }
}