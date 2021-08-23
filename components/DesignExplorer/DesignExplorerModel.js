import { computed, makeObservable, observable } from "mobx";
import { categories, createCategory } from "../../application/model/Category";
import { createDifferenceFilter } from "../../application/model/Filter";
import { createFolder } from "../../application/model/Folder";
import { createDeltaStore, createFilterStore } from "../../application/model/Store";
import { featureSwitches } from "../../config";
import { appState } from "../AppState";
import { log, loge, logg } from "../utility/Debug";
import { capitalizeEveryFirstLetter } from "../utility/javaScriptUtility";
import { DesignSelection } from "./DesignSelection";

export class DesignExplorerModel {
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

    this.filter = selectedFolder.filter.normalized();

    this.dragging = null;

    this.editFolderName = false;    

    // Valid values: "all" | "unsorted" | "splitView" | "sorted"(only for union) 
    this.displayItems = featureSwitches.splitPanelUnsorted ? "splitView" : "all"; 

    makeObservable(this, {
      displayItems: observable.ref,
      editFolderName: observable,
      selectedFolder: observable.ref,
      filter: observable.ref,
      dragging: observable.ref,
      unsortedFilter: computed, 
      sortedFilter: computed,
      sortedSimplifiedFilter: computed 
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
    if (this.selectedFolder && this.filter && !this.filter.isUnionFilter && this.selectedFolder.children.length > 0) {
      return createDifferenceFilter(this.filter, this.selectedFolder.getSimplifiedChildUnion());
    } else {
      return null;
    }
  }

  get sortedFilter() {
    if (this.selectedFolder && this.filter && !this.filter.isUnionFilter && this.selectedFolder.children.length > 0) {
      return this.selectedFolder.getChildUnionFilter();
    } else {
      return null;
    }
  }
  
  get sortedSimplifiedFilter() {
    if (this.selectedFolder && this.selectedFolder.filter && !this.selectedFolder.filter.isUnionFilter && this.selectedFolder.children.length > 0) {
      return this.selectedFolder.getSimplifiedChildUnionFilter();
    } else {
      return null;
    }
  }
  
  onDesignSelectionChange() {
    this.sortedDeltaStore.resetDelta();
    this.unsortedDeltaStore.resetDelta();
    this.deltaStore.resetDelta();
  }
  
  onUserFilterChange() {
    this.selectFolder(null);
    this.onFilterChange();
  }

  onFilterChange() {
    this.designSelection.clear();
    this.deltaStore.reInitialize();

    this.unsortedFilteredStore.filter = this.unsortedFilter;
    this.unsortedDeltaStore.reInitialize();

    this.sortedFilteredStore.filter = this.sortedFilter;
    this.sortedDeltaStore.reInitialize();
  }

  userSelectFolder(folder) {
    this.selectFolder(folder);
    this.onFilterChange();
  }

  selectFolder(folder) {
    this.selectedFolder = folder; 
    if (this.selectedFolder === null) {
      this.displayItems = "all"
    } else {
      this.filter = this.selectedFolder.filter ? this.selectedFolder.filter.normalized() : null;
      this.filteredStore.filter = this.filter; 

      if (!this.filter || this.filter.isUnionFilter || this.selectedFolder.children.length === 0) {
        this.displayItems = "all"
      } else {
        this.displayItems = (featureSwitches.splitPanelUnsorted) ? "splitView" : "all"
      }  
    }
  }

  addFilterFolder(category) {
    this.selectedFolder.addChild(createFolder(category));
  }

  createNewFolderGroup() {
    const newFolder = createFolder()
    this.selectedFolder.addChild(newFolder);
    this.userSelectFolder(newFolder);
    this.editFolderName = true; 
  }

  removeSelectedFolder() {
    if (this.selectedFolder && this.selectedFolder.parent) {
      let parent = this.selectedFolder.parent;
      parent.removeChild(this.selectedFolder);
      this.userSelectFolder(parent)
    }
  }

  startDraggingFilter() {
    this.dragging = this.filter; 
  }

  startDraggingSelection() {
    this.dragging = Object.values(this.designSelection.items);
  }

  isDraggingDesigns() {
    return this.dragging && this.dragging instanceof Array;
  }

  isDraggingFilter() {
    return this.dragging && !!this.dragging.isFilter;
  }
}