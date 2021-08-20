import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import React, { Component, useState } from 'react';
import { Column, columnStyle, fitStyle, flexAutoStyle, flexAutoWidthStyle, Flexer, flexGrowShrinkAutoStyle, Middle, pointerEventsAutoStyle, pointerEventsNoneStyle, Row, Wrapper, ZStack, zStackElementStyle, zStackStyle } from '../Layout';
import { Icon } from '../Icon';
import { iconSize, panelBorderRightStyle, panelPadding, panelPaddingStyle, panelStyle, SelectionBase, sidePanelWidth, Spacer, transparentBlue, transparentGray } from '../Style';
import { log, loge, logg } from '../utility/Debug';
import { Scroller, scrollerContentStyle } from '../Scroller';
import { ModalDialog, ModalPopover, Popover } from '../Popover';
import { icons } from '../Icons';
import { Button, LargeMenuItem, MenuItem } from '../Widgets';
import { categories, createCategory } from '../../application/model/Category';
import { capitalizeEveryFirstLetter } from '../utility/javaScriptUtility';


function normalize(name) {
  return name.toLowerCase().replace(/\s/g, "");
}

export function SelectCategoryDialog({open, close, onSelect, allowCreate=true, nonAvailable}) {
  const [categoryName, setCategoryName] = useState("");
  return <ModalDialog open={open} close={close} render={({style}) => {
    const normalizedCategoryName = normalize(categoryName);

    let exactMatch = null;
    const availableCategories = []
    categories.items.forEach(category => {
      if (typeof(category.name) === "undefined") return;
      let name = normalize(category.name);
      if (name.startsWith(normalizedCategoryName)
          && !nonAvailable[category.id] && category.canBeFilter) {      
        availableCategories.push(category);
      }
      if (name === normalizedCategoryName) {
        exactMatch = category; 
      }
    });

    let spacerSize = 15;
    return (
      <div style={{...columnStyle,...panelPaddingStyle, width: 500, height: 400, ...style}} 
        onClick={(event) => {loge("click on column"); event.preventDefault();event.stopPropagation();}}>
        <Text style={{fontSize: 16}}>Category name</Text>
        <Spacer size={spacerSize}/>
        <Row style={{flexAutoStyle}} overflowVisible>
          <Icon style={{marginRight: "0.5em"}} image={icons.object}/>
          <Middle style={flexGrowShrinkAutoStyle}>
            <TextInput style={{height: iconSize, lineHeight: iconSize}} onChangeText={setCategoryName} value={categoryName} autoFocus/>
          </Middle>
          {
            allowCreate ? 
            <Button style={{...flexAutoWidthStyle(150), marginLeft: "0.5em"}} text={"Create new category"} 
              onClick={() => {
                const normalizedCategoryName = capitalizeEveryFirstLetter(categoryName);
                const category = createCategory(normalizedCategoryName);
                categories.items.push(category);
                onSelect(category)
              }} 
              disable={(exactMatch !== null) || categoryName.length === 0}/>
            :
            null
          }
        </Row>
        <Spacer size={spacerSize}/>
        <Text style={{fontSize: 16}}>Select a category</Text>
        <Spacer size={spacerSize}/>
        <CategorySelector 
          availableCategories={availableCategories} 
          selectCategory={(category) => onSelect(category)}/>
        {/* <CategoryNamePopover open={true}/> */}
      </div>
    )
  }}/>
}




export function CategorySelector({selectCategory, availableCategories}) {

  return (
    <Scroller>
      <Column children={availableCategories.map(category =>  
          <MenuItem
            key={category.id}
            image={category.image ? category.image : icons.object}
            text={category.name}
            onClick={() => {selectCategory(category)}}/>
      )}/>
    </Scroller>
  );
}