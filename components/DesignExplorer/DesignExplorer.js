import React, { useState } from 'react';

import { FolderView } from '../FolderView';
import { Column, fitStyle, Row, CenterMiddle, flexAutoStyle, flexGrowShrinkStyle } from '../Layout';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { createDeltaStore, createFilterStore, createIntersectionFilter } from '../../application/model/Model';
import { DesignsView } from './DesignsView';
import { log, logg } from '../utility/Debug';
import { panelPadding } from '../Style';

function createSelection(deltaStore) {
  const selection = {
    add: function(itemOrItems) {
      deltaStore.resetDelta();
      let items = itemOrItems;
      if (!(items instanceof Array)) items = [items];
      log(items);
      items.forEach(item => selection.items[item.id] = item);
    }, 
  
    remove: function(itemOrItems) {
      deltaStore.resetDelta();
      let items = itemOrItems;
      if (!(items instanceof Array)) items = [items];
      items.forEach(item => delete selection.items[item.id]);
    },
  
    clear: function() {
      deltaStore.resetDelta();
      for (let itemId in selection.items) {
        delete selection.items[itemId];
      }
    }, 
  
    items: observable({})
  };
  return selection;
}



export const DesignExplorer = observer(class DesignExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.vault = props.vault;
    this.filteredStore = createFilterStore();
    this.deltaStore = createDeltaStore();
    this.filter = createIntersectionFilter();

    this.selection = createSelection(this.deltaStore);
    this.selection.add(this.vault.designs.items[0]);
    this.selection.add(this.vault.designs.items[1]);
    setTimeout(() => {
      logg("removing!");
      this.vault.designs.items.pop();
      this.vault.designs.items.shift();
    },5000);
  }
  
  componentDidMount() {
    this.filteredStore.initialize(this.filter, this.vault.designs);
    this.deltaStore.initialize(this.filteredStore);
    
    log(this.vault.designs.items[0]);
  }
  
  componentWillUnmount() {}
  componentDidUpdate(nextProps, nextState) {}

  render() {
    const {style, bounds, vault } = this.props;
    log("DesignExplorer:render");
    log(vault);
    log(this.filteredStore);
    log(this.filter);

    return (
      <Row style={fitStyle} class="Row">
        <FilterBrowser style={flexAutoStyle} filter={this.filter} folder={this.vault.folder} />
        <Column style={flexGrowShrinkStyle}>
          <FilterView style={flexAutoStyle} filter={this.filter}/>
          <DesignsView style={flexGrowShrinkStyle} selection={this.selection} deltaDesigns={this.deltaStore.items}/>
          <CategoriesView style={flexAutoStyle} selection={this.selection}/>
        </Column>
        <DesignView style={flexAutoStyle} selection={this.selection}/>
      </Row>
    );
   }
});
 
export function FilterBrowser({style, bounds, folder}) {
  const [selectedFolder, setSelectedFolder] = useState(folder.children[0]);
  return <Column style={{...panelPadding, ...style}} children={folder.children.map(child => <FolderView sytle={style} bounds={bounds} folder={child} selectedFolder={selectedFolder}/>)}/>
}

export function FilterView({style}) {
  return <Placeholder style={style} name="Filter"/>
}


export function CategoriesView({style}) {
  return <Placeholder style={style} name="Categories"/>
}

export function DesignView({style}) {
  return <Placeholder style={style} name="Design"/>
}



export function Placeholder({style, name}) {
  const placeholderStyle = {
    overflow: "hidden",
    boxSizing: "border-box",
    borderWidth: "1px",
    borderColor: "rgba(124, 124, 124, 0.2)",
    borderStyle: "solid",
    fontSize: 16,
    fontWeight: 700,
    color: "rgba(124, 124, 124, 0.5)",
    backgroundColor: "rgba(124, 124, 124, 0.1)",
    ...style
  };
  return (
    <CenterMiddle style={placeholderStyle}>
      {name}
    </CenterMiddle>
  );
}
