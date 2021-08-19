import React, { useState } from 'react';

import { FilterBrowser } from './FilterBrowser';
import { Column, fitStyle, Row, CenterMiddle, flexAutoStyle, flexGrowShrinkStyle, flexAutoHeightStyle, Middle } from '../Layout';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { createDeltaStore, createFilterStore } from '../../application/model/Store';
import { DesignsView } from './DesignsView';
import { log, loge, logg } from '../utility/Debug';
import { FilterView } from './FilterView';
import { createCategoryFilter } from '../../application/model/Filter';
import { AllDesigns } from '../../application/createDemoData';
import { DesignView } from './DesignView';
import { anyKeyDown } from '../KeyStateTracker';
import { createSelection } from './DesignSelection';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { iconSize, panelBorderTopStyle, panelPaddingStyle, panelStyle } from '../Style';
import { Icon } from '../Icon';
import { ClickablePanel } from '../ClickablePanel';
import { Chip, IconButton } from '../Widgets';
import { icons } from '../Icons';
import { SelectCategoryDialog } from './SelectCategoryDialog';

export const CategoriesView = observer(function({style, designSelection}) {
  const [addFilterDialogOpen, setAddFilterDialogOpen] = useState(false);

  const selectedDesigns = Object.values(designSelection.items);

  const categoryInfos = {}
  selectedDesigns.forEach(design => {
    design.categories.forEach(category => {
      if (typeof(categoryInfos[category.id]) === "undefined") {
        categoryInfos[category.id] = {
          category: category,
          state: "all"
        }
      }
    });
  });

  for (let categoryId in categoryInfos) {
    const categoryInfo = categoryInfos[categoryId];
    selectedDesigns.forEach(design => {
      if (!design.in(categoryInfo.category)) {
        categoryInfo.state = "some";
      }
    });
  }

  const nonAvailable = {};
  for (let categoryId in categoryInfos) {
    const categoryInfo = categoryInfos[categoryId];
    if (categoryInfo.state === "all") {
      nonAvailable[categoryInfo.category.id] = categoryInfo.category.id;
    }
  }

  function removeCategory(category) {
    selectedDesigns.forEach(design => {
      design.uncategorize(category);
    });
  }

  const children = Object.values(categoryInfos).map(categoryInfo => 
    <CategoryInfoView 
      key={categoryInfo.category.id} 
      style={flexAutoStyle}
      removeCategory={removeCategory} 
      categoryInfo={categoryInfo}/>)

  if (selectedDesigns.length > 0) {
    children.push(
      <Middle key="add" style={{height: 25, marginLeft: "0.5em"}}>
        <IconButton style={flexAutoStyle} image={icons.plus} size={15}
        onClick={() => {
          setAddFilterDialogOpen(true);
        }}/>
      </Middle>
    )
    children.push(
      <SelectCategoryDialog open={addFilterDialogOpen} close={() => setAddFilterDialogOpen(false)} 
        allowCreate={true}
        nonAvailable={nonAvailable}
        onSelect={(category) => {
          setAddFilterDialogOpen(false);
          selectedDesigns.forEach(design => {
            design.categorize(category);
          });
        }}
      />
    )
  }

  return (
    <Row 
      style={{...panelBorderTopStyle, alignItems:"flex-start", alignContent: "flex-start", ...panelPaddingStyle, flexWrap: "wrap" , ...style}} 
      children={children}/>
  )
})

function CategoryInfoView({style, categoryInfo, removeCategory}) {
  return <Chip 
    style={{opacity: categoryInfo.state === "all" ? 1 : 0.4,...style}}
    text={categoryInfo.category.name} 
    onDelete={() => removeCategory(categoryInfo.category)}/>
}