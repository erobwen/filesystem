import React from 'react';

import { TreeView } from '../TreeView';
import { Column, fitStyle, Row, CenterMiddle, flexAutoStyle, flexGrowShrinkStyle } from '../Layout';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { createFilterStore, createIntersectionFilter } from '../../application/model/Model';
import { DesignsView } from './DesignsView';
import { log } from '../utility/Debug';

export const DesignExplorer = observer(class DesignExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.vault = props.vault;
    this.filteredStore = createFilterStore();
    this.filter = createIntersectionFilter();

    this.selected =  observable([]);
  }

  componentDidMount() {
    this.filteredStore.initialize(this.filter, this.vault.designs);
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
        <FilterBrowser style={flexAutoStyle} filter={this.filter} tree={this.vault.tree} />
        <Column style={flexGrowShrinkStyle}>
          <FilterView style={flexAutoStyle} filter={this.filter}/>
          <DesignsView style={flexGrowShrinkStyle} designs={this.filteredStore.items}/>
          <CategoriesView style={flexAutoStyle} selected={this.selected}/>
        </Column>
        <DesignView style={flexAutoStyle} selected={this.selected}/>
      </Row>
    );
   }
});
 
export function FilterBrowser({style, bounds, tree}) {
  return <TreeView sytle={style} bounds={bounds} tree={tree}/>;
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
