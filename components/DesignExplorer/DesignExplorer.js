import React from 'react';

import { FilterBrowser } from './FilterBrowser';
import { Column, fitStyle, Row, CenterMiddle, flexAutoStyle, flexGrowShrinkStyle, flexAutoWidthStyle, columnStyle } from '../Layout';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { createDeltaStore, createFilterStore } from '../../application/model/Store';
import { DesignsView } from './DesignsView';
import { log, loge, logg } from '../utility/Debug';
import { FilterView } from './FilterView';
import { createCategoryFilter } from '../../application/model/Filter';
import { AllDesigns } from '../../application/createDemoData';
import { DesignView } from './DesignView';
import { anyKeyDown } from '../KeyStateTracker';
import { createSelection } from './DesignSelection';
import { CategoriesView } from './CategoriesView';
import { sidePanelWidth } from '../Style';



export const DesignExplorer = observer(class DesignExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      filter: createCategoryFilter(AllDesigns) 
    };
    this.vault = props.vault;
    this.filteredStore = createFilterStore();
    this.deltaStore = createDeltaStore();

    this.selection = createSelection(this.deltaStore);
    // this.selection.add(this.vault.designs.items[0]);
    // this.selection.add(this.vault.designs.items[1]);
    // setTimeout(() => {
    //   this.vault.designs.items.pop();
    //   this.vault.designs.items.shift();
    // },5000);
  }
  
  componentDidMount() {
    this.filteredStore.initialize(null, this.vault.designs);
    this.deltaStore.initialize(this.filteredStore);
    
  }
  
  componentWillUnmount() {}
  componentDidUpdate(nextProps, nextState) {}

  render() {
    const me = this; 
    const {style, bounds, vault } = this.props;
    const {filter} = this.state; 

    function setFilter(filter) {
      me.selection.clear();
      me.setState({filter: filter});
      me.filteredStore.filter = filter; 
      me.deltaStore.reInitialize();
      // me.deltaStore.resetDelta();
    }

    return (
      <Row style={fitStyle} class="Row">
        <FilterBrowser key={"left"} style={flexAutoStyle} setFilter={setFilter} folder={this.vault.folder} />
        <Column style={flexAutoWidthStyle(sidePanelWidth)} key={"center"} style={flexGrowShrinkStyle}>
          <FilterView key={"filter"} style={flexAutoStyle} filter={filter}/>
          <DesignsView key={"designs"} style={flexGrowShrinkStyle} selection={this.selection} deltaDesigns={this.deltaStore.items}/>
        </Column>
        <DesignView key={"right"} style={flexAutoWidthStyle(sidePanelWidth)} selection={this.selection}/>
      </Row>
    );
   }
});
 



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
