import { Platform } from 'react-native'
export const { Route, Link } = require('react-router-native')
export const Router = Platform.OS === 'web' ? require('react-router-native').HashRouter : require('react-router-native').NativeRouter
// BrowserRouter for nginx configured