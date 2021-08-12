import { observer } from 'mobx-react';
import React from 'react';
import { CenterMiddle, Column, fitStyle, flexAutoHeightStyle, flexAutoStyle, flexAutoWidthHeightStyle, flexGrowAutoStyle, Row } from '../Layout';
import { Scroller } from '../Scroller';
import { Icon } from '../Icon';
import { log, loge, logg } from '../utility/Debug';
import { draggingType } from './DesignExplorer';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { SelectionBase, transparentBlue } from '../Style';
import { ClickablePanel } from '../ClickablePanel';

export const DesignsView = observer(class DesignsView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}
  componentWillUnmount() {}
  componentDidUpdate(nextProps, nextState) {}

  render() {


    const {deltaDesigns, selection} = this.props;

    function selectDesign(design) {
      selection.click(design);
    }

    const deltaDesignsCopy = deltaDesigns.slice();
    return <Scroller render={({style, bounds}) => {
      let result = (//, justifyContent:"space-between"
        <ClickablePanel style={style}
          callback={() => selection.clear()}>
          <Row style={{...flexAutoStyle, flexWrap: "wrap" }}>
            {deltaDesignsCopy.map(deltaDesign => 
              <DeltaDesignThumbView 
                key={deltaDesign.item.id} 
                deltaDesign={deltaDesign}
                selectDesign={selectDesign}
                selection={selection}
                selected={typeof(selection.items[deltaDesign.item.id]) !== "undefined"}/>)}
          </Row>
        </ClickablePanel>
      );
      return result;
    }}/>
  }
});


const DeltaDesignThumbView = observer(function({style, deltaDesign, selected, selection, selectDesign}) {
  let opacity = deltaDesign.status === "original" ? 1 : 0.5;
  return ( 
    <SelectionBase id="SelectionBase" style={style} selected={selected} render={({style}) =>  
      <DesignThumbView 
        onDragStart={() => {
          if (!selection.items[deltaDesign.item.id]) {
            selection.set(deltaDesign.item);
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