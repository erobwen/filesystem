import { observer } from 'mobx-react';
import React from 'react';
import { CenterMiddle, Column, fitStyle, flexAutoHeightStyle, flexAutoStyle, flexAutoWidthHeightStyle, flexGrowAutoStyle, Row } from '../Layout';
import { Scroller } from '../Scroller';
import { Icon } from '../Icon';
import { log, loge, logg } from '../utility/Debug';
import { draggingType } from './DesignExplorer';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { panelBorderBottomStyle, SelectionBase, transparentBlue } from '../Style';
import { ClickablePanel } from '../ClickablePanel';



export const DesignsView = observer(class DesignsView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}
  componentWillUnmount() {}
  componentDidUpdate(nextProps, nextState) {}

  render() {
    const {folderSelection} = this.props;
    const designSelection = folderSelection.designSelection;

    let contents; 
    if (folderSelection.displayItems === "splitView") {
      contents = [
        <DesignsArea key="unsorted" style={{...panelBorderBottomStyle, ...flexAutoStyle}} 
          designSelection={designSelection} 
          deltaStore={folderSelection.unsortedDeltaStore}/>,
        <DesignsArea key="sorted" style={flexAutoStyle} 
          designSelection={designSelection} 
          deltaStore={folderSelection.sortedDeltaStore}/>  
      ]
    } else if (folderSelection.displayItems === "all") {
      contents = [
        <DesignsArea key="all" style={flexAutoStyle} 
          designSelection={designSelection} 
          deltaStore={folderSelection.deltaStore}/>,
      ]
    } else if (folderSelection.displayItems === "sorted") {
      contents = [
        <DesignsArea key="sorted" style={flexAutoStyle} 
          designSelection={designSelection} 
          deltaStore={folderSelection.sortedDeltaStore}/>,
      ]
    } else if (folderSelection.displayItems === "unsorted") {
      contents = [
        <DesignsArea key="unsorted" style={flexAutoStyle} 
          designSelection={designSelection} 
          deltaStore={folderSelection.unsortedDeltaStore}/>,
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

const DesignsArea = observer(function({style, deltaStore, designSelection}) {
  
  function selectDesign(design) {
    designSelection.click(design);
  }
  return (
    <Row style={{...flexAutoStyle, padding: 15, flexWrap: "wrap",...style}}>
      {deltaStore.items.map(deltaDesign => 
        <DeltaDesignThumbView 
          key={deltaDesign.item.id} 
          deltaDesign={deltaDesign}
          selectDesign={selectDesign}
          designSelection={designSelection}
          selected={typeof(designSelection.items[deltaDesign.item.id]) !== "undefined"}/>)}
    </Row>
  );
});

const DeltaDesignThumbView = observer(function({style, deltaDesign, selected, designSelection, selectDesign}) {
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
        selectDesign={selectDesign}/>
    }/>
  );
});


function DesignThumbView({style, design, selectDesign, onDragStart}) {
  return (
    <ClickablePanel style={{...style, marginRight: 10, marginLeft: 10, marginTop: 20, padding: 5}}
      mouseOverBackgroundColor={transparentBlue(0.1)} 
      callback={() => selectDesign(design)}>
      <Draggable style={flexAutoStyle} onDragStart={onDragStart}>
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


function Draggable({style, children, onDragStart}) {
  function innerOnDragStart(event) {
    if (onDragStart) onDragStart();
    draggingType.value = "design";
    event.dataTransfer.effectAllowed = "copyMove";
    event.stopPropagation();
    return true;
  }
  return <div id="Draggable" style={{...style}} draggable="true" onDragStart={innerOnDragStart} onDragEnd={() => {draggingType.value = null}}>{children}</div>
}