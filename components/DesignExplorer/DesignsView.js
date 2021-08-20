import { observer } from 'mobx-react';
import React from 'react';
import { CenterMiddle, Column, fitStyle, flexAutoHeightStyle, flexAutoStyle, flexAutoWidthHeightStyle, flexGrowAutoStyle, Row } from '../Layout';
import { Scroller } from '../Scroller';
import { Icon } from '../Icon';
import { log, loge, logg } from '../utility/Debug';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { panelBorderBottomStyle, panelPadding, SelectionBase, transparentBlue, transparentGray } from '../Style';
import { ClickablePanel } from '../ClickablePanel';



export const DesignsView = observer(class DesignsView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}
  componentWillUnmount() {}
  componentDidUpdate(nextProps, nextState) {}

  render() {
    const {explorerModel} = this.props;
    const designSelection = explorerModel.designSelection;

    let contents; 
    if (explorerModel.displayItems === "splitView") {
      let sortedTitle = "";
      if (explorerModel.sortedDeltaStore.source && explorerModel.sortedDeltaStore.source.filter) {
        if (explorerModel.sortedSimplifiedFilter) {
          sortedTitle = explorerModel.sortedSimplifiedFilter.toEquationString();
        }
      }
      contents = [];
      if (explorerModel.unsortedDeltaStore.items.length > 0) {
        contents.push(
          <DesignsArea key="unsorted" style={{...panelBorderBottomStyle, ...flexAutoStyle}} 
            title="Unsorted"
            designSelection={designSelection} 
            deltaStore={explorerModel.unsortedDeltaStore}
            explorerModel={explorerModel}/>)
      }
      if (explorerModel.sortedDeltaStore.items.length > 0) {
        contents.push(
          <DesignsArea key="sorted" style={flexAutoStyle}
            title={sortedTitle} 
            designSelection={designSelection} 
            deltaStore={explorerModel.sortedDeltaStore}
            explorerModel={explorerModel}/>);
      }
    } else if (explorerModel.displayItems === "all") {
      contents = [
        <DesignsArea key="all" style={flexAutoStyle} 
          title={null}
          designSelection={designSelection} 
          deltaStore={explorerModel.deltaStore}
          explorerModel={explorerModel}/>,
      ]
    } else if (explorerModel.displayItems === "sorted") {
      contents = [
        <DesignsArea key="sorted" style={flexAutoStyle}
          title={null}
          designSelection={designSelection} 
          deltaStore={explorerModel.sortedDeltaStore}
          explorerModel={explorerModel}/>,
      ]
    } else if (explorerModel.displayItems === "unsorted") {
      contents = [
        <DesignsArea key="unsorted" style={flexAutoStyle} 
          title={null}
          designSelection={designSelection} 
          deltaStore={explorerModel.unsortedDeltaStore}
          explorerModel={explorerModel}/>,
      ]
    }

    return <Scroller render={({style, bounds}) => {
      let result = (
        <ClickablePanel style={{...style, padding: 0 }} 
          callback={() => designSelection.clear()} 
          children={contents}/>
      );
      return result;
    }}/>
  }
});

const DesignsArea = observer(function({style, title, deltaStore, designSelection, explorerModel}) {
  
  function selectDesign(design) {
    designSelection.click(design);
  }
  return (
    <Row style={{...flexAutoStyle, padding: 15, flexWrap: "wrap",...style}}>
      {title ? <Text style={{position: "absolute", top:0, left: 0, padding: 5, fontSize: 14, color: transparentGray(0.5)}}>{title}</Text> : null}
      {deltaStore.items.map(deltaDesign => 
        <DeltaDesignThumbView 
          key={deltaDesign.item.id} 
          deltaDesign={deltaDesign}
          selectDesign={selectDesign}
          designSelection={designSelection}
          explorerModel={explorerModel}
          selected={typeof(designSelection.items[deltaDesign.item.id]) !== "undefined"}/>)}
    </Row>
  );
});

const DeltaDesignThumbView = observer(function({style, deltaDesign, selected, designSelection, selectDesign, explorerModel}) {
  let opacity = deltaDesign.status === "original" ? 1 : 0.5;
  return ( 
    <SelectionBase id="SelectionBase" style={style} selected={selected} render={({style}) =>  
      <DesignThumbView 
        onDragStart={() => {
          if (!designSelection.items[deltaDesign.item.id]) {
            designSelection.set(deltaDesign.item);
          }
        }}
        style={{flexAutoStyle, opacity: opacity}} 
        design={deltaDesign.item} 
        selectDesign={selectDesign}
        explorerModel={explorerModel}/>
    }/>
  );
});


function DesignThumbView({style, design, selectDesign, onDragStart, explorerModel}) {
  return (
    <ClickablePanel style={{...style, marginRight: 10, marginLeft: 10, marginTop: 20, padding: 5}}
      mouseOverBackgroundColor={transparentBlue(0.1)} 
      callback={() => selectDesign(design)}>
      <Draggable style={flexAutoStyle} onDragStart={onDragStart} explorerModel={explorerModel}>
        <CenterMiddle style={flexAutoStyle}>
          <Column style={flexAutoStyle}>
            <Icon style={flexAutoWidthHeightStyle(100, 100)} image={design.image} />
            <Text style={{...flexAutoWidthHeightStyle(100, 20), overflow: "hidden"}}>{design.name}</Text>
          </Column>
        </CenterMiddle>
      </Draggable>
    </ClickablePanel>
  );
}


function Draggable({style, children, onDragStart, explorerModel}) {
  function innerOnDragStart(event) {
    if (onDragStart) onDragStart();
    explorerModel.startDraggingSelection();
    event.dataTransfer.effectAllowed = "copyMove";
    // event.preventDefault();
    event.stopPropagation();
    return true;
  }
  return <div id="Draggable" style={{...style}} draggable="true" onDragStart={innerOnDragStart} onDragEnd={() => {explorerModel.dragging = null}}>{children}</div>
}