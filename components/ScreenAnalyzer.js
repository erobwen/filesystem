
import React, { Component } from 'react'; 
import { Dimensions } from 'react-native';
import { fitStyle } from './Layout';

let dimensions = null; 

export class ScreenAnalyzer extends Component {
  constructor() {
    super();
    console.log(Dimensions);
    this.state = { 
      dimensions: this.getDimensions() 
    };
    this.myDiv = React.createRef();
  }

  getDimensions() {
    // Dimensions.get('screen').height;
    // Dimensions.get('screen').width;
    return {...Dimensions.get('window')};
  }

  componentDidMount() {
    this.listener = ({window, screen}) => {
      this.setState({dimensions: window})
    }

    Dimensions.addEventListener("change", this.listener);
  }

  componentDidUpdate() {}

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.listener);
  }

  render() {
    let { style, render } = this.props;
    return <div style={style} id="ScreenAnalyzer" ref={this.myDiv}>{render({style: fitStyle, bounds: this.state.dimensions})}</div>
  }
}