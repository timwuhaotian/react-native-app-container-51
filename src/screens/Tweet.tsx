import React, { Component } from 'react'
import { Text, Alert, Image, View, TextInput, AsyncStorage, Button, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import moment from 'moment'
// import NaviBar from 'react-native-pure-navigation-bar'

import { observer } from 'mobx-react'
import Helper from '../common/Helper'
import Keys from '../config/Const'
import Color from '../config/Color'

import Nav from '../components/Nav'

import {
  POST_TWEET,
} from '../common/api'

type Props = {
  twitter: any,
  store: any,
  location: any,
  history: any,
  match: any,
}

// screen to post a new tweets
@observer
class TweetScreen extends Component<Props> {
  componentDidMount () {
    console.log('this.props in tweet', this.props)
  }

  handleInputTweet = (newText: string) => {
    // update the tweet as it goes
    this.props.store.updateInputTweet(newText)
  }

  handleSubmitTweet = async () => {
    // publish a new tweet
    this.props.store.showSpinner()
    let res = await this.props.twitter.post(POST_TWEET, {
      status: this.props.store.newTweetText
    })
    this.props.store.hideSpinner()
    if (res) {
      // success
      this.props.store.showToast()
      this.props.store.updateInputTweet('')
      setTimeout(() => {
        this.props.history.replace('/')
      }, 1500)
    }
  }

  render () {
    return (
      <View style={{ height: Helper.Height }}>
        <Nav
          onLeft={() => this.props.history.goBack()}
          midComponent={() => (
            <Text>Post a tweet</Text>  
          )}
        />
        {/* {!Helper.isWeb() ? <NaviBar title='Post Tweet' onLeft={() => this.props.history.goBack()}></NaviBar> : null} */}
        <TextInput
          onChangeText={(newText: string) => this.handleInputTweet(newText)}
          defaultValue={this.props.store.newTweetText}
          style={{ padding: 10, fontSize: 14, alignItems: 'flex-start', height: 100 }}
          multiline={true}
          placeholder="What's appening?"
          maxLength={200}></TextInput>
        <TouchableOpacity
          onPress={() => this.handleSubmitTweet()}
          style={[styles.flex, { marginVertical: 10, marginHorizontal: 5, backgroundColor: Color.twitter_blue, height: 39 }]}>
          <Text style={{ color: '#fff', fontSize: 20, }}>submit</Text>
        </TouchableOpacity>
      </View>
    )
  }
}


const styles = StyleSheet.create({
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

export default TweetScreen