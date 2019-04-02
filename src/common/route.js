import { Platform } from 'react-native'
export const { Route, Link } = require('react-router-native')
export const Router = Platform.OS === 'web' ? require('react-router-native').BrowserRouter : require('react-router-native').NativeRouter