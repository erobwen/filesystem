import { observer } from 'mobx-react';
import React from 'react';
import { Column, fitStyle, flexAutoHeightStyle, flexAutoStyle, flexAutoWidthHeightStyle, Row } from '../Layout';
import { Scroller } from '../Scroller';
import { Icon } from '../Typography';
import { log, loge, logg } from '../utility/Debug';
import { Placeholder } from './DesignExplorer';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';

export const DesignsView = observer(class DesignsView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}
  componentWillUnmount() {}
  componentDidUpdate(nextProps, nextState) {}


  render() {
    const {deltaDesigns, selection} = this.props;
    log("DesignsView:render");
    const deltaDesignsCopy = deltaDesigns.slice();
    return <Scroller render={({style, bounds}) => {
      let result = (//, justifyContent:"space-between"
        <Row style={{...style, flexWrap: "wrap" }}>
          {deltaDesignsCopy.map(deltaDesign => 
            <DeltaDesignThumbView 
              key={deltaDesign.item.id} 
              deltaDesign={deltaDesign} 
              selected={typeof(selection.items[deltaDesign.item.id]) !== "undefined"}/>)}
        </Row>
      );
      return result;
    }}/>
  }
});

export function transparentPurple(opacity) {
  return "rgba(107,81,150, " + opacity + ")";
  // return `rgba(108, 81, 152, ${opacity})` // the template version somehow did not work on 
}

const transparentColor = "rgba(1, 1, 1, 0)";

const selectionStyle = {
  overflow: "hidden",
  boxSizing: "border-box",
  borderWidth: "1px",
  borderColor: "rgba(30, 30, 124, 0.2)",
  borderStyle: "solid",
  backgroundColor: "rgba(30, 30, 124, 0.1)",
};

const unselectedStyle = {
  overflow: "hidden",
  boxSizing: "border-box",
  borderWidth: "1px",
  borderColor: transparentColor,
  borderStyle: "solid",
  backgroundColor: transparentColor,
}

function SelectionBase({style, render, selected}) {
  return <div style={{...style, ...(selected ? selectionStyle : unselectedStyle)}}>{render(fitStyle)}</div>;
}

const DeltaDesignThumbView = observer(function({style, deltaDesign, selected}) {
  loge("reacting");
  let opacity = deltaDesign.status === "original" ? 1 : 0.5;
  return ( 
    <SelectionBase id="SelectionBase" style={style} selected={selected} render={({style}) => 
      <div style={{...style, opacity: opacity}}>
        <DesignThumbView style={fitStyle} design={deltaDesign.item}/> 
      </div>
    }/>
  );
});


function DesignThumbView({style, design}) {
  return (
    <Column style={{...style, marginRight: 10, marginLeft: 10, marginTop: 20}}>
      <Icon style={flexAutoWidthHeightStyle(100, 100)} image={design.image} />
      <Text style={flexAutoHeightStyle(20)}>{design.name}</Text>
    </Column>
  );
}