import { computed, makeObservable, observable } from "mobx";
import { categories, createCategory } from "../../application/model/Category";
import { createDifferenceFilter, createUnionFilter } from "../../application/model/Filter";
import { createFolder } from "../../application/model/Folder";
import { createDeltaStore, createFilterStore } from "../../application/model/Store";
import { featureSwitches } from "../../config";
import { appState } from "../AppState";
import { log, loge } from "../utility/Debug";
import { capitalizeEveryFirstLetter } from "../utility/javaScriptUtility";
import { DesignSelection } from "./DesignSelection";

export class FolderSelection {
  constructor({selectedFolder, designSelection}) {  
    this.designSelection = designSelection;
    this.selectedFolder = selectedFolder;

    this.filteredStore = createFilterStore();
    this.deltaStore = createDeltaStore();

    this.unsortedFilteredStore = createFilterStore();
    this.unsortedDeltaStore = createDeltaStore();

    this.sortedFilteredStore = createFilterStore();
    this.sortedDeltaStore = createDeltaStore();

    this.designSelection = new DesignSelection(this);

    this.editFolderName = false;    
    log(featureSwitches.splitPanelUnsorted)
    log(appState)
    log(featureSwitches)
    // Valid values: "all" | "unsorted" | "splitView" | "sorted"(only for union) 
    this.displayItems = featureSwitches.splitPanelUnsorted ? "splitView" : "all"; 
    log(this.displayItems)
    makeObservable(this, {
      displayItems: observable.ref,
      editFolderName: observable,
      selectedFolder: observable.ref,
      filter: computed,
      unsortedFilter: computed, 
      sortedFilter: computed, 
    });
  }

  initialize(designs) {
    this.filteredStore.initialize(this.filter, designs);
    this.deltaStore.initialize(this.filteredStore);

    this.unsortedFilteredStore.initialize(this.unsortedFilter, designs);
    this.unsortedDeltaStore.initialize(this.unsortedFilteredStore);

    this.sortedFilteredStore.initialize(this.sortedFilter, designs);
    this.sortedDeltaStore.initialize(this.sortedFilteredStore);
  }

  get unsortedFilter() {
    if (this.filter && !this.filter.isUnionFilter && this.selectedFolder.children.length > 0) {
      return createDifferenceFilter(this.filter, this.selectedFolder.children.map(child => child.filter));
    } else {
      return null;
    }
  }

  get sortedFilter() {
    if (this.filter && !this.filter.isUnionFilter && this.selectedFolder.children.length > 0) {
      log("Union sorted filter!");
      return createUnionFilter(this.selectedFolder.children.map(child => child.filter));
    } else {
      // log("No filter!");
      return null;
    }
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

    this.unsortedFilteredStore.filter = this.unsortedFilter;
    this.unsortedDeltaStore.reInitialize();

    this.sortedFilteredStore.filter = this.sortedFilter;
    this.sortedDeltaStore.reInitialize();
  }

  onDesignSelectionChange() {
    this.sortedDeltaStore.resetDelta();
    this.unsortedDeltaStore.resetDelta();
    this.deltaStore.resetDelta();
  }
  
  selectFolder(folder) {
    log(folder.filter);
    this.selectedFolder = folder; 

    if (this.filter.isUnionFilter || this.selectedFolder.children.length === 0) {
      loge("setting display items to all")
      this.displayItems = "all"
    } else {
      this.displayItems = (featureSwitches.splitPanelUnsorted) ? "splitView" : "all"
    }

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
      parent.removeChild(this.selectedFolder);
      this.selectFolder(parent)
    }
  }
}