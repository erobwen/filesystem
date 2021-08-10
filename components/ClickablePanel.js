import React from 'react';

export class ClickablePanel extends React.Component {
  constructor(props) {
    super(props);
    this.myDiv = React.createRef();
    this.inAnimation = false; 
  }

  componentDidMount() {
    let me = this;
    this.setCallbackAndMouseover(me.props);
  }

  componentWillUpdate(nextProps, nextState) {
    const { mouseOverBackgroundColor, callback, callbackKey } = nextProps;
    const aNewCallback = typeof(callbackKey) !== "undefined" ? (callbackKey !== this.props.callbackKey) : (callback !== this.props.callback) 
    if (mouseOverBackgroundColor !== this.props.mouseOverBackgroundColor || aNewCallback) {    
      this.clearEventListeners();
      this.setCallbackAndMouseover(nextProps);
    }
  }

  componentWillUnmount() {
    this.clearEventListeners();
  }

  clearEventListeners() {
    // Clear old listeners
    const panel = this.myDiv.current;
    if (this.setMouseoverColor) {
      panel.removeEventListener("mouseover", this.setMouseoverColor);  
      delete this.setMouseoverColor;
    }
    if (this.removeMouseoverColor) {
      panel.removeEventListener("mouseout", this.removeMouseoverColor);
      delete this.removeMouseoverColor;
    }
    if (this.rippleAndCallback) {
      panel.removeEventListener("click", this.rippleAndCallback);
      delete this.rippleAndCallback;
    }
  }

  setCallbackAndMouseover({callback, mouseOverBackgroundColor, onMouseIn, onMouseOut}) {
    const me = this; 
    const {ripple = true, backgroundOnClick } = me.props; 
    const panel = this.myDiv.current;

    me.rippleAndCallback = function(event) {
      event.stopPropagation();
      if (me.inAnimation) {
        callback(); 
        return;
      }
      me.inAnimation = true;  
      // me.clearEventListeners();
      // panel.removeEventListener("click", me.rippleAndCallback);
      
      const circle = document.createElement('div');
      const oldStyle = {
        overflow : panel.style.overflow,
        width: panel.style.width,
        height: panel.style.height
      }

      if (backgroundOnClick) {
        panel.style.transition = "background-color 0.6 ease-in-out";
        panel.style["background-color"] = "white"; 
        setTimeout(() => {
          panel.style["background-color"] = backgroundOnClick; 
        }, 0);
      }

      if (ripple) {      
        // Fixate panel (it might grow otherwise... )
        panel.style.overflow = "hidden";
        
        const panelComputedStyle = window.getComputedStyle(panel, null);
        panel.style.width = panelComputedStyle.width;
        panel.style.height = panelComputedStyle.height;
        panel.appendChild(circle);

        const d = Math.max(panel.clientWidth, panel.clientHeight);

        circle.style.width = circle.style.height = d + 'px';
        const rect = panel.getBoundingClientRect();

        const clickLocalX = event.clientX  - rect.left;
        const clickLocalY = event.clientY - rect.top;

        const padding = me.props.style && me.props.style.padding ? me.props.style.padding : 0;
        circle.style.left = clickLocalX - d/2 + (d - rect.width) - padding + 'px';
        circle.style.top = clickLocalY - d/2 - rect.height + padding + 'px'; 

        circle.classList.add('ripple');
        
        function restorePanelAfterDelay(panel, circle, oldStyle) {
          setTimeout(() => {
            panel.removeChild(circle);
            setTimeout(() => {
              panel.style.width = oldStyle.width;
              panel.style.height = oldStyle.height;
              panel.style.overflow = oldStyle.overflow;
              me.inAnimation = false; 
            }, 0); 
          }, 300);
        }
        restorePanelAfterDelay(panel, circle, oldStyle);
      } else {
        me.inAnimation = false;
      }

      callback(); 
    }

    if (callback) {    
      panel.addEventListener("click", me.rippleAndCallback);
    }

    if (callback && (mouseOverBackgroundColor || onMouseIn || onMouseOut)) {
      me.setMouseoverColor = function() {
        if (!panel.mouseIn) {
          panel.mouseIn = true;         
          if (me.props.onMouseIn) me.props.onMouseIn();
         if (mouseOverBackgroundColor) {
            panel.style["transition"] = "background-color 0.15s";
            panel._savedBackgroundColor = panel.style["background-color"];
            panel.style["background-color"] = mouseOverBackgroundColor;            
          }
        }
      }
      panel.addEventListener("mouseover", me.setMouseoverColor);

      // panel.addEventListener("mouseenter", () => {
      // });

      me.removeMouseoverColor = function() {
        if (panel.mouseIn) {
          panel.mouseIn = false;     
          if (me.props.onMouseOut) me.props.onMouseOut();
           if (mouseOverBackgroundColor) {
            panel.style["background-color"] = panel._savedBackgroundColor; //"rgba(0, 0, 0, 0)";
          }
          // delete panel.style["background-color"]; // Note: Does not work in IE
          // panel.style["background-color"] = null; // Note: Does not work in IE
        }
      }
      panel.addEventListener("mouseout", me.removeMouseoverColor);
    }
  }
  
  render() {
    let {style, children, callback} = this.props;
    style = {...style, overflow: "hidden"};
    if (callback) {
      style.cursor = "pointer";
    }
   return (
      <div className="ClickablePanel, noSelect" ref={ this.myDiv } style={style}>{children}</div>
    );
  }
}
