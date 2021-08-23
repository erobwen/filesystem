import { observer } from 'mobx-react';
import React from 'react';
import { CenterMiddle, Column, fitStyle, flexAutoHeightStyle, flexAutoStyle, flexAutoWidthHeightStyle, flexGrowAutoStyle, Row } from '../Layout';
import { Scroller } from '../Scroller';
import { Icon } from '../Icon';
import { log, loge, logg } from '../utility/Debug';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { panelBorderBottomStyle, panelPadding, SelectionBase, transparentBlue, transparentGray } from '../Style';
import { ClickablePanel } from '../ClickablePanel';

export function DesignThumbView({style, design, selectDesign, onDragStart, explorerModel}) {
  return (
    <ClickablePanel style={{...style, marginRight: 10, marginLeft: 10, marginTop: 20, padding: 5}}
      mouseOverBackgroundColor={transparentBlue(0.1)} 
      callback={() => selectDesign(design)}>
      <Draggable style={flexAutoStyle} onDragStart={onDragStart} explorerModel={explorerModel}>
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


function Draggable({style, children, onDragStart, explorerModel}) {
  function innerOnDragStart(event) {
    if (onDragStart) onDragStart();
    explorerModel.startDraggingSelection();
    event.dataTransfer.effectAllowed = "copyMove";
    // event.preventDefault();
    event.stopPropagation();
    return true;
  }
  return <div id="Draggable" style={{...style}} draggable="true" onDragStart={innerOnDragStart} onDragEnd={() => {explorerModel.dragging = null}}>{children}</div>
}