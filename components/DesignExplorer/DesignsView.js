import { observer } from 'mobx-react';
import React from 'react';
import { Column, flexAutoHeightStyle, flexAutoStyle, flexAutoWidthHeightStyle, Row } from '../Layout';
import { Scroller } from '../Scroller';
import { Icon } from '../Typography';
import { log, logg } from '../utility/Debug';
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
    const {designs} = this.props;
    log("DesignsView:render");
    const designsCopy = designs.slice();
    return <Scroller render={({style, bounds}) => {
      let result = (
        <Row style={{...style, flexWrap: "wrap", justifyContent:"space-between" }}>
          {designsCopy.map(design => <DesignThumbView key={design.id} design={design}/>)}
        </Row>
      );
      return result;
    }}/>
  }
});


export function DesignThumbView({style, design}) {
  return (
    <Column style={{...style, marginRight: 10, marginLeft: 10, marginTop: 20}}>
      <Icon style={flexAutoWidthHeightStyle(100, 100)} image={design.image} />
      <Text style={flexAutoHeightStyle(20)}>{design.name}</Text>
    </Column>
  );
}