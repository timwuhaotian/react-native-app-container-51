import React, { Component } from 'react'
import { ActivityIndicator, Text, Alert, RefreshControl, Image, View, AsyncStorage, FlatList, ScrollView, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native'
import { TWLoginButton, decodeHTMLEntities } from 'react-native-simple-twitter'
import moment from 'moment'
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures'

import { observer } from 'mobx-react'
import Helper from '../common/Helper'

import Nav from '../components/Nav'

import {
  ICON_REPLY,
  ICON_RETWEET,
  ICON_RETWEET_ACTIVE,
  ICON_STAR,
  ICON_STAR_ACTIVE,
  ICON_SHARE,
} from '../common/Images'

import Color from '../config/Color'

import {
  GET_TIMELINE,
  RETWEET_TWEET,
  STAR_TWEET,
  UN_RETWEET_TWEET,
  UN_STAR_TWEET,
} from '../common/api'

const GestureConfig = {
  velocityThreshold: 0.2,
  directionalOffsetThreshold: 20
}

type Props = {
  twitter: any,
  store: any,
  location: any,
  history: any,
  match: any,
}

@observer
class HomeScreen extends Component<Props> {
  constructor(props: any) {
    super(props)
  }

  state = {
    token: null,
    tokenSecret: null,
    myText: 'I\'m ready to get swiped!',
    gestureName: 'none',
    backgroundColor: '#fff'
  }
  
  async componentDidMount() {
    // console.log(getRelativeTime(new Date(new Date().getTime() - 32390)))
    // console.log(getRelativeTime('Thu Apr 06 15:28:43 +0000 2017'))
    if (this.props.store.visible) {
      this.props.store.hideToast()
    }
    if (!this.props.store.timeline || this.props.store.user) {
      this.fetchDefaultList()
    }
  }

  fetchDefaultList = async () => {
    this.props.store.showSpinner()
    let res = await this.props.twitter.get(GET_TIMELINE, {})
    res && this.props.store.updateTimeline(res)
    this.props.store.hideSpinner()
  }

  onGetAccessToken = async ({ oauth_token: token, oauth_token_secret: tokenSecret }: any) => {
    try {
      // await AsyncStorage.setItem('user', JSON.stringify({ ...user, token: this.state.token, tokenSecret: this.state.tokenSecret }))
      this.props.store.showSpinner()
      this.props.store.setNewToken(token, tokenSecret)
      this.props.twitter.setAccessToken(token, tokenSecret)
      const user = await this.props.twitter.get('account/verify_credentials.json', { include_entities: false, skip_status: true, include_email: true })
      user && this.props.store.setUser(user)
      await AsyncStorage.setItem('user', JSON.stringify(user))
      this.fetchDefaultList()
      this.props.store.hideSpinner()
    }
    catch (err) {
      console.log(err)
    }
  }

  onSuccess = async (user: any) => {
    // try {
    //   await AsyncStorage.setItem('user', JSON.stringify({ ...user, token: this.state.token, tokenSecret: this.state.tokenSecret }))
    //   let res = await this.props.twitter.get(GET_TIMELINE, {})
    //   console.log('timeline res', res)
    //   res && this.props.store.updateTimeline(res)
    // }
    // catch (err) {
    //   console.log(err)
    // }
  }

  onPress = (e: any) => {
    console.log('button pressed')
  }

  onClose = (e: any) => {
    console.log('press close button')
  }

  onError = (err: any) => {
    console.log(err)
  }

  onSwipe(gestureName: any, gestureState: any) {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    this.setState({gestureName: gestureName});
    switch (gestureName) {
      case SWIPE_UP:
        this.setState({backgroundColor: 'red'});
        break;
      case SWIPE_DOWN:
        this.setState({backgroundColor: 'green'});
        break;
      case SWIPE_LEFT:
        this.setState({backgroundColor: 'blue'});
        break;
      case SWIPE_RIGHT:
        this.setState({backgroundColor: 'yellow'});
        break;
    }
  }

  onSwipeUp(gestureState: any) {
    this.setState({myText: 'You swiped up!'})
  }
 
  onSwipeDown(gestureState: any) {
    this.setState({myText: 'You swiped down!'})
  }
 
  onSwipeLeft(gestureState: any) {
    console.log('You swiped left!')
    this.setState({myText: 'You swiped left!'})
  }
 
  onSwipeRight(gestureState: any) {
    this.setState({myText: 'You swiped right!'})
  }

  handleTabSwitch = async (index: number) => {
    this.props.store.updateTabActiveStatus(index)
  }

  handleTweet = () => {
    // publish a new tweet
    // let res = await twitter.post(POST_TWEET, {
    //   status: new_status
    // })
    this.props.history.push('/tweet', { tweet: 'tweeeeeet' })
  }

  handleReplyTweet = (user: any, id: any) => {
    this.props.store.updateReplyToUser(user, id)
    this.props.history.push('/reply')
  }
  
  handleRetweetTweet = async (user: any, id: any) => {
    this.props.store.showSpinner()
    let res = await this.props.twitter.post(RETWEET_TWEET.replace(':id', id), {
      id,
    })
    this.props.store.hideSpinner()
    if (res) {
      this.props.store.showToast()
      setTimeout(() => {
        this.props.store.hideToast()
      }, 2500)
    }
  }

  handleUnretweet = async (user: any, id: any) => {
    this.props.store.showSpinner()
    let res = await this.props.twitter.post(UN_RETWEET_TWEET.replace(':id', id), {
      id,
    })
    this.props.store.hideSpinner()
    if (res) {
      this.props.store.showToast()
      setTimeout(() => {
        this.props.store.hideToast()
      }, 2500)
    }
  }

  handleStarTweet = async (user: any, id: any) => {
    this.props.store.showSpinner()
    let res = await this.props.twitter.post(STAR_TWEET, {
      id,
    })
    this.props.store.hideSpinner()
    if (res) {
      this.props.store.showToast()
      setTimeout(() => {
        this.props.store.hideToast()
      }, 2500)
    }
  }

  handleUnstarTweet = async (user: any, id: any) => {
    this.props.store.showSpinner()
    let res = await this.props.twitter.post(UN_STAR_TWEET, {
      id,
    })
    this.props.store.hideSpinner()
    if (res) {
      this.props.store.showToast()
      setTimeout(() => {
        this.props.store.hideToast()
      }, 2500)
    }
  }

  render() {
    const {
      timeline = [] // main data
    } = this.props.store
    return (
      <View style={{ height: Helper.Height }}>
        <Nav
          onRight={() => this.handleTweet()}
          midComponent={() => (
            <Text>Home</Text>  
          )}
          rightComponent={() => (
            <Image style={{ width: 20, height: 20 }} source={require('../assets/tweet.png')}></Image>
          )}
        />
        <View style={[styles.flex, styles.topbar]}>
          <Text style={styles.userName}>{this.props.store.user ? `Hello ${this.props.store.user.name}` : "Hi TL, default is Tim's data"}</Text>
          {!Helper.isWeb() ?
            <TWLoginButton
                type='TouchableOpacity'
                onPress={this.onPress}
                onGetAccessToken={this.onGetAccessToken}
                onSuccess={this.onSuccess}
                onClose={this.onClose}
                onError={this.onError}
              >
              <Text style={{ textAlign: 'center', fontSize: 14, color: Color.twitter_blue }}>Login with other account</Text>
            </TWLoginButton> : null}
        </View>
        {/* <View style={[styles.flex, styles.tab]}>
          {this.props.store.tabs.map((tab, index) => {
            const { label, active } = tabpaddingTop
            return (
            <TouchableOpacity onPress={() => this.handleTabSwitch(index)} key={index} style={[styles.flex, styles.tabItem, active && styles.tabItemActive]}>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
            </TouchableOpacity>
            )
          })}
        </View> */}
        <ScrollView
            horizontal={false}
            refreshControl={(
              <RefreshControl
                onRefresh={this.fetchDefaultList}
                refreshing={this.props.store.spinner}
              ></RefreshControl>
            )}
            style={{ marginBottom: 5 }}>
        {timeline ? <FlatList
            data={timeline}
            renderItem={({ item }: any) => {
              const { id_str, id, user, text, created_at, entities, retweet_count, retweeted, favorited, favorite_count } = item
              const { name, profile_image_url_https, screen_name, } = user
              return (
                <GestureRecognizer
                  onSwipe={(direction: any, state: any) => this.onSwipe(direction, state)}
                  onSwipeUp={(state: any) => this.onSwipeUp(state)}
                  onSwipeDown={(state: any) => this.onSwipeDown(state)}
                  onSwipeLeft={(state: any) => this.onSwipeLeft(state)}
                  onSwipeRight={(state: any) => this.onSwipeRight(state)}
                  config={GestureConfig}
                  style={styles.timelineItem}
                >
                <View style={[styles.flex, { alignItems: 'flex-start', justifyContent: 'flex-start' }]}>
                  {/* avatar */}
                  <View style={styles.avatarWrapper}>
                    <Image style={styles.avatar} source={{ uri: profile_image_url_https }}></Image>
                  </View>

                  <View style={[styles.flexCol, { marginBottom: 5 }]}>
                    <View style={[styles.flex, { justifyContent: 'flex-start' }]}>
                      <Text style={{ color: '#333', fontWeight: 'bold', fontSize: 14 }}>{name}  </Text>
                      <Text style={{ color: '#888', fontSize: 14 }}>@{screen_name}  </Text>
                      <Text style={{ color: '#888', fontSize: 14 }}>@{moment(created_at).fromNow()}</Text>
                    </View>
                    <View style={[styles.flex, { justifyContent: 'flex-start', marginBottom: 5 }]}>
                      <Text style={{ color: '#333', fontSize: 14 }}>{decodeHTMLEntities(text)}</Text>
                    </View>
                    <View>
                      {entities && entities.media && entities.media.map((m: any, _index: any) => {
                        const { url, media_url_https } = m
                        return (
                          <ImageBackground key={_index} source={{ uri: media_url_https }} style={[styles.flex, styles.flexCol, { justifyContent: 'flex-start', alignItems: 'flex-start', borderRadius: 15, overflow: 'hidden', marginVertical: 5 }]}>
                            <View style={{ height: 170 }}></View>
                          </ImageBackground>
                        )
                      })}
                    </View>
                    <View style={[styles.flex]}>
                      <TouchableOpacity style={[styles.flex, { flex: 1, justifyContent: 'flex-start' }]} onPress={() => this.handleReplyTweet(user, id_str)}>
                        <Image style={styles.actionIcon} source={ICON_REPLY}></Image>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.flex, { flex: 1, justifyContent: 'flex-start' }]} onPress={() => !retweeted ? this.handleRetweetTweet(user, id_str) : this.handleUnretweet(user, id_str)}>
                        <Image style={styles.actionIcon} source={retweeted ? ICON_RETWEET_ACTIVE : ICON_RETWEET}></Image>
                        <Text style={{ color: retweeted ? Color.twitter_blue : '#333' }}>{retweet_count > 0 && ` ${retweet_count}`}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.flex, { flex: 1, justifyContent: 'flex-start' }]} onPress={() => !favorited ? this.handleStarTweet(user, id_str) : this.handleUnstarTweet(user, id_str)}>
                        <Image style={styles.actionIcon} source={favorited ? ICON_STAR_ACTIVE : ICON_STAR}></Image> 
                        <Text style={{ color: favorited ? Color.twitter_blue : '#333' }}>{favorite_count > 0 && ` ${favorite_count}`}</Text>
                      </TouchableOpacity>
                      {/* <TouchableOpacity style={[styles.flex, { flex: 1, justifyContent: 'flex-start' }]}>
                        <Image style={styles.actionIcon} source={ICON_SHARE}></Image>
                      </TouchableOpacity> */}
                    </View>
                  </View>
                </View>
              </GestureRecognizer>
              )
            }}
          ></FlatList>  : <ActivityIndicator style={{ marginTop: 50 }}></ActivityIndicator>}
        </ScrollView>
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
  userName: {
    fontSize: 14,
    fontWeight: 'bold',

    marginRight: 5,
  },
  topbar: {
    paddingHorizontal: 10,
    height: 49,
    justifyContent: 'flex-start'
  },
  tab: {
    height: 49,
  },
  tabItem: {
    flex: 1,
    height: 49,
  },
  tabItemActive: {
    borderBottomColor: Color.twitter_blue,
    borderBottomWidth: 2,
    borderStyle: 'solid',
  },
  tabLabel: {
    fontSize: 14,
  },
  tabLabelActive: {
    color: Color.twitter_blue,
  },
  timelineItem: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 9,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  avatar: {
    width: 44,
    height: 44,
  },
  avatarWrapper: {
    borderRadius: 40,
    overflow: 'hidden',
    marginHorizontal: 5,
  },
  actionIcon: {
    width: 17.5,
    height: 17.5,
  },
  copy: {},
})

export default HomeScreen
