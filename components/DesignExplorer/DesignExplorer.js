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
import { DesignSelection } from './DesignSelection';
import { sidePanelWidth } from '../Style';
import { DesignExplorerModel } from './DesignExplorerModel';

export let draggingType = { value: null};

export const DesignExplorer = observer(class DesignExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.explorerModel = new DesignExplorerModel({
      selectedFolder: props.vault.folder.children[0]
    });
  }
  
  componentDidMount() {
    this.explorerModel.initialize(this.props.vault.designs)
  }
  
  componentWillUnmount() {}
  componentDidUpdate(nextProps, nextState) {}

  render() {
    const { vault } = this.props;

    return (
      <Row style={fitStyle} class="Row">
        <FilterBrowser key={"left"} maxWidth={sidePanelWidth} 
          folder={vault.folder}
          explorerModel={this.explorerModel}/>
        <Column style={flexGrowShrinkStyle} key={"center"} style={flexGrowShrinkStyle}>
          <FilterView key={"filter"} style={flexAutoStyle} explorerModel={this.explorerModel}/>
          <DesignsView key={"designs"} style={flexGrowShrinkStyle} explorerModel={this.explorerModel}/>
        </Column>
        <DesignView key={"right"} style={flexAutoWidthStyle(sidePanelWidth)} designSelection={this.explorerModel.designSelection}/>
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
