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
import crossIcon from '../../assets/cross.svg';
import { iconSize, panelBorderTopStyle, panelPaddingStyle, panelStyle } from '../Style';
import { Icon } from '../Icon';

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
      if (!design.categories.contains(categoryInfo.category)) {
        categoryInfo.state = "some";
      }
    });
  }

  log(categoryInfos);
  return (
    <Row 
      style={{...panelBorderTopStyle, alignItems:"flex-start", alignContent: "flex-start", ...panelPaddingStyle, flexWrap: "wrap" , ...style}} 
      children={Object.values(categoryInfos).map(categoryInfo => <CategoryInfoView key={categoryInfo.category.id} style={flexAutoStyle} categoryInfo={categoryInfo}/>)}/>
  )
})


function CategoryInfoView({style, categoryInfo}) {
  return (
    <Row style={{...panelStyle, padding:5, marginBottom: 3, marginRight: 3, opacity: categoryInfo.state === "all" ? 1 : 0.4, ...style}}>
      <Text key={"text"} style={{...flexAutoStyle, marginRight: "0.5em",  overflow:"visible", lineHeight: 15}}>{categoryInfo.category.name}</Text>
      <Middle key={"cross"}>
        <Icon size={10} image={crossIcon}/>
      </Middle>
    </Row>
  );
}