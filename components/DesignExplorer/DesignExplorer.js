import React, { useState } from 'react';

import { FilterBrowser, FolderView } from './FilterBrowser';
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
      // log(items);
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
    this.state = { 
      filter: null 
    };
    this.vault = props.vault;
    this.filteredStore = createFilterStore();
    this.deltaStore = createDeltaStore();

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
    this.filteredStore.initialize(null, this.vault.designs);
    this.deltaStore.initialize(this.filteredStore);
    
    // log(this.vault.designs.items[0]);
  }
  
  componentWillUnmount() {}
  componentDidUpdate(nextProps, nextState) {}

  render() {
    const me = this; 
    const {style, bounds, vault } = this.props;
    const {filter} = this.state; 
    // log("DesignExplorer:render");
    // log(vault);
    // log(this.filteredStore);

    function setFilter(filter) {
      log(filter)
      me.setState({filter: filter});
      log(filter);
      me.filteredStore.filter = filter; 
    }

    return (
      <Row style={fitStyle} class="Row">
        <FilterBrowser style={flexAutoStyle} setFilter={setFilter} folder={this.vault.folder} />
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
