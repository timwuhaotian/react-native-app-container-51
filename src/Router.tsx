import React, { Component } from 'react'
import { ActivityIndicator, View, Text } from 'react-native'
import twitter, { TWLoginButton, decodeHTMLEntities, getRelativeTime } from 'react-native-simple-twitter'
// import Spinner from 'react-native-loading-spinner-overlay'

import Toast from 'react-native-root-toast'

import { Router, Route, Link } from './common/route'
import { observer } from 'mobx-react'
import GlobalStore from './GlobalModel'
let Store = new GlobalStore()

// global.self = global // 0.44 + bug width fetch

import Keys from './config/Const'
const {
  consumer_key,
  consumer_key_secret,
  access_token,
  access_token_secret,
} = Keys

twitter.setConsumerKey(consumer_key, consumer_key_secret)
twitter.setAccessToken(access_token, access_token_secret)

import HomeScreen from './screens/Home'
import TweetScreen from './screens/Tweet'
import ReplyScreen from './screens/Reply'
import Color from './config/Color'

console.disableYellowBox = true
@observer
class App extends Component {
  constructor(props: any) {
    super(props)
  }
 
  render() {
    return (
      <Router>
        <View>
          <Route path='/' exact={true} render={(props: any) => (<HomeScreen {...props} twitter={twitter} store={Store} />)}></Route>
          <Route path='/tweet' exact={true} render={(props: any) => (<TweetScreen {...props} twitter={twitter} store={Store} />)}></Route>
          <Route path='/reply' exact={true} render={(props: any) => (<ReplyScreen {...props} twitter={twitter} store={Store} />)}></Route>
          <Toast
            visible={Store.visible}
            position={80}
            shadow={false}
            animation={true}
            backgroundColor={Color.twitter_blue}
            duration={Toast.durations.SHORT}
          >
            <Text>Success!</Text>
          </Toast>
          {Store.spinner ? 
          <ActivityIndicator style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#333',
            opacity: 0.2,
          }}></ActivityIndicator> : null}
        </View>
      </Router>
    )
  }
}

export default App

