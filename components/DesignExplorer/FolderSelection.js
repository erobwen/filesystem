import { computed, makeObservable, observable } from "mobx";
import { createFolder } from "../../application/model/Folder";
import { capitalizeEveryFirstLetter } from "../utility/javaScriptUtility";

export class FolderSelection {
  constructor(selectedFolder, filteredStore, deltaStore, designSelection) {   
    this.filteredStore = filteredStore;
    this.deltaStore = deltaStore;
    this.designSelection = designSelection;
    
    this.selectedFolder = selectedFolder;
    this.filterOverride = null;
    makeObservable(this, {
      filterOverride: observable,
      selectedFolder: observable,
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
    this.selectedFolder = folder; 
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

  removeSelectedFolder() {
    if (this.selectedFolder && this.selectedFolder.parent) {
      let parent = this.selectedFolder.parent;
      parent.children.remove(this.selectedFolder);
      this.selectFolder(parent)
    }
  }
}