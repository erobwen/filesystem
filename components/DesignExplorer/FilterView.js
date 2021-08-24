import React, { useState } from 'react';
import { flexAutoStyle, Flexer, Middle, Row } from '../Layout';
import { iconSize, panelBorderBottomStyle, panelPaddingStyle, topPanelHeight, transparentBlue, transparentLightBlue } from '../Style';
import { Placeholder } from './DesignExplorer';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import folderImage from '../../assets/folder_outline.svg';
import { Icon } from '../Icon';
import { icons } from '../Icons';
import { ClickablePanel } from '../ClickablePanel';
import { log, loge, logg } from '../utility/Debug';
import { observer } from 'mobx-react';
import { Chip, IconButton } from '../Widgets';
import { SelectCategoryDialog } from './SelectCategoryDialog';
import { createCategoryFilter } from '../../application/model/Filter';
import { isPinned, pin, unpin } from './QuickAccess';
import { AllDesigns } from '../../application/model/Vault';

export const FilterView = observer(function({style, explorerModel}) {
  const [addFilterDialogOpen, setAddFilterDialogOpen] = useState(false);

  const filter = explorerModel.filter;
  if (filter === null) {
    return null;
  } else {
    const pinned = isPinned(filter);
    const nonAvailable = {};
    filter.filters.forEach(filter => {nonAvailable[filter.category.id] = filter.category});
    return (
      <Row style={{...panelBorderBottomStyle, ...panelPaddingStyle, height: topPanelHeight, ...style}}>
        <Draggable explorerModel={explorerModel} onDragStart={
          () => {
            explorerModel.dragging = explorerModel.filter; 
          }
        }>
          <Icon key="fie" size={iconSize} style={{marginRight: "0.5em"}} image={icons.filterBlue}/>
        </Draggable>
        {explorerModel.filter.filters.map(filter => {
          if (filter.category === AllDesigns) {
            if (explorerModel.filter.filters.length > 1) return null;
            return (
              <Chip 
                key={filter.category.name}
                style={{...flexAutoStyle, backgroundColor: transparentLightBlue(0.1)}}
                text={filter.category.name}/>
            );
          }
          return (
            <Chip
              key={filter.category.name}
              style={{...flexAutoStyle, backgroundColor: transparentLightBlue(0.1)}}
              text={filter.category.name} 
              onDelete={() => {
                explorerModel.filter.filters.remove(filter); 
                if (explorerModel.filter.filters.length === 0) {
                  explorerModel.filter.filters.push(createCategoryFilter(AllDesigns));
                } 
                log(explorerModel.filter.filters.length);
                explorerModel.onUserFilterChange();
              }}/>
          );
        })}
        <Middle style={{marginLeft: "0.5em"}}>
          <IconButton style={flexAutoStyle} image={icons.plus} size={15}
          onClick={() => {
            setAddFilterDialogOpen(true);
          }}/>
        </Middle>
        <SelectCategoryDialog open={addFilterDialogOpen} close={() => setAddFilterDialogOpen(false)} 
          allowCreate={false}
          nonAvailable={nonAvailable}
          onSelect={(category) => {filter.filters.push(createCategoryFilter(category)); setAddFilterDialogOpen(false); explorerModel.onUserFilterChange()}}
        />
        <Flexer/>
        {
          pinned ? 
          <Middle key="pinned" style={{marginLeft: "0.5em"}}>
            <IconButton style={flexAutoStyle} image={icons.pinned} size={15}
              onClick={() => {
                unpin(filter);
              }}/>
          </Middle>
          :
          <Middle key="pin" style={{marginLeft: "0.5em"}}>
            <IconButton style={flexAutoStyle} image={icons.pin} size={15}
              onClick={() => {
                pin(filter);
              }}/>
          </Middle>
        }
      </Row>
    )  
  }
});

function Draggable({style, children, onDragStart, explorerModel}) {
  function innerOnDragStart(event) {
    if (onDragStart) onDragStart();
    explorerModel.startDraggingFilter();
    event.dataTransfer.effectAllowed = "copyMove";
    // event.preventDefault();
    event.stopPropagation();
    return true;
  }
  return <div id="Draggable" style={{...style, cursor: "grab"}} draggable="true" onDragStart={innerOnDragStart} onDragEnd={() => {explorerModel.dragging = null}}>{children}</div>
}