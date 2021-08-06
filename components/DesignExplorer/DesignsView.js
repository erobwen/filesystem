import { observer } from 'mobx-react';
import React from 'react';
import { Placeholder } from './DesignExplorer';

export const DesignsView = observer(class DesignsView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}
  componentWillUnmount() {}
  componentDidUpdate(nextProps, nextState) {}

  render() {
    return <Placeholder style={this.props.style} name="Designs"/>
  }
});
