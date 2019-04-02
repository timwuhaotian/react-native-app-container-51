import { Dimensions, Platform } from 'react-native'
import { isIphoneX as isIphoneX_helper } from 'react-native-iphone-x-helper'

export default {
  /**
   * get window size
   */
  Width: Dimensions.get('window').width,
  Height: Dimensions.get('window').height,

  isWeb(): boolean {
    return Platform.OS === 'web'
  },

  /**
   * android
   * @returns {boolean}
   */
  isAndroid(): boolean {
    return Platform.OS === 'android'
  },

  /**
   * ios
   * @returns {boolean}
   */
  isIOS(): boolean {
    return Platform.OS === 'ios'
  },

  /**
   * is iphone x ?
   */
  isIphoneX: isIphoneX_helper,

}