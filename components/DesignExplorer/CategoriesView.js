import React from 'react';

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
import { Chip } from '../Widgets';

export const CategoriesView = observer(function({style, selection}) {
  const selectedDesigns = Object.values(selection.items);

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