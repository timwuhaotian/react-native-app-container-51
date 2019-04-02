import { observable, action } from 'mobx'

export interface TimeLineItem {
  text: string,
  user: Object,
  truncated: any,
  created_at: any,
  favorited: any,
  id_str: any,
  in_reply_to_user_id_str: any,
  entities: any,
  contributors: any,
  retweet_count: any,
  id: any,
  in_reply_to_status_id_str: any,
  geo: any,
  retweeted: any,
  in_reply_to_user_id: any,
  source: any,
  place: any,
}

export default class GlobalModel {
  @observable visible = false // toast
  @observable spinner = false // spinner
  @observable tabs = [
    { label: 'Home', active: true },
    { label: 'Explore', active: false },
    { label: 'Notifications', active: false },
    { label: 'Messages', active: false },
  ]

  @observable user = null
  @observable access_token = null
  @observable access_token_secret = null

  // timeline
  @observable timeline = null // personal home time line data from twitter server.

  // post tweet
  @observable newTweetText = ''
  @observable newTweetImages = []

  // reply tweet
  @observable replyToUser = {}
  @observable replyTweetText = ''
  @observable replyToTweetId = null

  @action setUser (user: any) {
    this.user = user
  }

  @action setNewToken (access_token: any, access_token_secret: any) {
    this.access_token = access_token
    this.access_token_secret = access_token_secret
  }

  @action showToast () {
    this.visible = true
  }
  @action hideToast () {
    this.visible = false
  }
  @action showSpinner () {
    this.spinner = true
  }
  @action hideSpinner () {
    this.spinner = false
  }

  @action updateReplyToUser(user: any, id: any) {
    this.replyToUser = user
    this.replyToTweetId = id
  }

  @action updateInputTweetReply (newText: string) {
    this.replyTweetText = newText
  }

  @action updateInputTweet (newText: string) {
    this.newTweetText = newText
  }

  @action updateTabActiveStatus (index: number) {
    this.tabs = this.tabs.map((tab, _index) => {
      return Object.assign({}, tab, { active: _index == index ? true : false })
    })
  }

  @action updateTimeline (timeline: any) {
    this.timeline = timeline
  }

}
