/**
 * React function component
 */
function MyComponent({style}) {
  return <div style={style}/>;
}


/**
 * React function component with state
 */
function MyComponent({style}) {
  const initialValue = 42;
  [stateVariable, setStateVariable] = useState(initialValue); // If needed! 
  return <div style={style}/>;
}


/**
 * React class component 
 */
 export class MyComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {a: 100, b:100}
  }

  componentDidMount() {}

  componentDidUpdate(nextProps, nextState) {}

  componentWillUnmount() {}

  render() {
    const {style} = this.props;
    const {a, b} = this.state; 
    return <div id="MyComponent" style={style}/>
  }
}


/**
 * React class component with reference to div
 */
export class MyComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {a: 100, b:100}
    this.myDiv = React.createRef();
  }

  componentDidMount() {
    let myDiv = this.myDiv.current;
  }

  componentDidUpdate(nextProps, nextState) {}

  componentWillUnmount() {}

  render() {
    const {style} = this.props;
    const {a, b} = this.state; 
    return <div id="MyComponent" style={style} ref={this.myDiv}/>
  }
}

/**
 * React class component MobX observer
 */
export const MyComponent = observer(class MyComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {a: 100, b:100}
  }

  componentDidMount() {
  }

  componentDidUpdate(nextProps, nextState) {}

  componentWillUnmount() {}

  render() {
    const {c, d} = this.props;
    const {a, b} = this.state;
    return <div id="MyComponent"/>
  }
});


/**
 * React function component MobX observer
 */
const MyComponent = observer(function({style}) {
  return <div style={style}/>;
})
