import React, { Component } from 'react'
import { Text, Alert, Image, View, TextInput, AsyncStorage, Button, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import moment from 'moment'

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
class ReplyScreen extends Component<Props> {
  componentDidMount () {
    console.log('this.props in tweet', this.props)
  }

  handleInputTweet = (newText: string) => {
    // update the tweet as it goes
    this.props.store.updateInputTweetReply(newText)
  }

  handleSubmitTweetReply = async () => {
    const { replyToUser, replyToTweetId } = this.props.store
    const { screen_name } = replyToUser
    // publish a new tweet
    this.props.store.showSpinner()
    let res = await this.props.twitter.post(POST_TWEET, {
      status: `${this.props.store.replyTweetText}`,
      in_reply_to_status_id: replyToTweetId,
      // auto_populate_reply_metadata: 1,
    })
    this.props.store.hideSpinner()
    if (res) {
      // success
      this.props.store.showToast()
      this.props.store.updateInputTweetReply('')
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
            <Text>reply a tweet</Text>  
          )}
        />
        {/* {!Helper.isWeb() ? <NaviBar title='Reply Tweet' onLeft={() => this.props.history.goBack()}></NaviBar> : null} */}
        <TextInput
          onChangeText={(newText: string) => this.handleInputTweet(newText)}
          defaultValue={this.props.store.replyTweetText}
          style={{ padding: 10, fontSize: 14, alignItems: 'flex-start', height: 100 }}
          multiline={true}
          placeholder="Add another tweet"
          maxLength={200}></TextInput>
        <TouchableOpacity
          onPress={() => this.handleSubmitTweetReply()}
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

export default ReplyScreen