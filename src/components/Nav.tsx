import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'

import Helper from '../common/Helper'
import Keys from '../config/Const'
import Color from '../config/Color'

type Props = {
  leftComponent?: any,
  midComponent?: any,
  rightComponent?: any,
  onLeft?: any,
  onMid?: any,
  onRight?: any,
  style?: any,
}

class Nav extends Component<Props> {
  render () {
    const {
      leftComponent,
      midComponent,
      rightComponent,
      onLeft,
      onMid,
      onRight,
      style,
    } = this.props 
    
    return (
      <View style={[styles.flex, styles.nav]}>
        <TouchableOpacity style={[styles.flex, styles.flexCol, styles.section, { paddingHorizontal: 20, justifyContent: 'flex-start' }]} onPress={onLeft ? () => onLeft() : () => {}}>
          {leftComponent ? leftComponent() : <Text>Back</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.flex, styles.flexCol, styles.section]} onPress={onMid ? () => onMid() : () => {}}>
          {midComponent ? midComponent() : <Text>Page title</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.flex, styles.flexCol, styles.section, { paddingHorizontal: 20, justifyContent: 'flex-end' }]} onPress={onRight ? () => onRight() : () => {}}>
          {rightComponent ? rightComponent() : <Text></Text>}
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  nav: {
    marginTop: 20,
    height: 44,
  },
  section: {
    height: 44,
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexCol: {
    flex: 1,
  },
  copy: {},
})

export default Nav