
import React, { Component } from 'react'; 
import { Dimensions } from 'react-native';

let dimensions = null; 

export class ScreenAnalyzer extends Component {
  constructor() {
    super();
    console.log(Dimensions);
    this.state = { 
      dimensions: this.getDimensions() 
    };
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
    const { style, child, render } = this.props
    if (child) {
      const { component, props } = child; 
      const childProps = {style, bounds: this.state.dimensions, ...props};
      return <component {... childProps}/>      
    } else {
      return render({style, bounds: this.state.dimensions})
    }
  }
}