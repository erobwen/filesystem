import { observer } from 'mobx-react';
import React from 'react';
import { Column, flexAutoStyle, flexAutoWidthHeightStyle, Row } from '../Layout';
import { Scroller } from '../Scroller';
import { Icon } from '../Typography';
import { Placeholder } from './DesignExplorer';

export const DesignsView = observer(class DesignsView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}
  componentWillUnmount() {}
  componentDidUpdate(nextProps, nextState) {}


  render() {
    return <Scroller render={({style, bounds}) => {
      return (
        <Row style={{...style, flexWrap: "wrap" }}>
          {this.props.designs.map(design => <DesignThumbView design={design}/>)}
        </Row>
      );
    }}/>
  }
});


export function DesignThumbView({style, design}) {
  return (
    <Column style={style}>
      <Icon style={flexAutoWidthHeightStyle(100, 100)} image={design.image} />
      <Text style={flexAutoStyle}>{design.name}</Text>
    </Column>
  );
}