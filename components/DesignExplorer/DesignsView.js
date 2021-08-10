import { observer } from 'mobx-react';
import React from 'react';
import { CenterMiddle, Column, fitStyle, flexAutoHeightStyle, flexAutoStyle, flexAutoWidthHeightStyle, flexGrowAutoStyle, Row } from '../Layout';
import { Scroller } from '../Scroller';
import { Icon } from '../Icon';
import { log, loge, logg } from '../utility/Debug';
import { Placeholder } from './DesignExplorer';
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
        <Row style={{...style, flexWrap: "wrap" }}>
          {deltaDesignsCopy.map(deltaDesign => 
            <DeltaDesignThumbView 
              key={deltaDesign.item.id} 
              deltaDesign={deltaDesign}
              selectDesign={selectDesign}
              selected={typeof(selection.items[deltaDesign.item.id]) !== "undefined"}/>)}
        </Row>
      );
      return result;
    }}/>
  }
});


const DeltaDesignThumbView = observer(function({style, deltaDesign, selected, selectDesign}) {
  let opacity = deltaDesign.status === "original" ? 1 : 0.5;
  return ( 
    <SelectionBase id="SelectionBase" style={style} selected={selected} render={({style}) =>  
      <DesignThumbView style={{flexAutoStyle, opacity: opacity}} design={deltaDesign.item} selectDesign={selectDesign}/>
    }/>
  );
});


function DesignThumbView({style, design, selectDesign}) {
  return (
    <ClickablePanel style={{...style, marginRight: 10, marginLeft: 10, marginTop: 20, padding: 5}}
      mouseOverBackgroundColor={transparentBlue(0.1)} 
      callback={() => selectDesign(design)}>
      <CenterMiddle style={flexAutoStyle}>
        <Column style={flexAutoStyle}>
          <Icon style={flexAutoWidthHeightStyle(100, 100)} image={design.image} />
          <Text style={{...flexAutoWidthHeightStyle(100, 20), overflow: "hidden"}}>{design.name}</Text>
        </Column>
      </CenterMiddle>
    </ClickablePanel>
  );
}