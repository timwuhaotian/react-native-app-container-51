This project was meant to demonstrate a simple twitter user features with react-native also react application. 

**Usage**

This project support both Native and Web<br>
Clone and yarn:

### `yarn`

For Native, we need to open up the xcode project (minimal with Expo) and simulator.

### `open ios/rndev.xcodeproj`

To open the xcode project, and wait for it to load, and press build with iPhone 8. Then <br>

### `yarn start_rn`

This will boot up the React Native local development service. When it is ready <br>
Refresh the simulator with CMD + R or if it's not working, use Gesture in the simulator's menu to shake out the development menu.<br>
If experience error like 'config.h is not found', try this following:

### `rm -rf node_modules/ && yarn cache clean && yarn install`
### `node_modules/react-native/scripts/ios-install-third-party.sh`

The reason is because that xcode 10.0 will have this problem, I was using 9.X version.

For Web, we enter the following command:

### `yarn start`

This will boot up the React web local development service in the Chrome at http://localhost:3000 <br>
Just to mention, it takes a bit of time at its first run, and http does not support the Twitter API, <br>
So currently it is just for demo :) I will try to put it onto https server

**Features**

The application is likely a minimal reproduce of the Twitter personal homepage, it supports user to 

* auth with twitter (default with my own account info, you can login with other account and update the data)
* display home timeline of tweets
* post a tweet
* reply to a tweet
* retweet a tweet (threading a tweet)
* unretweet a tweet
* star/favorite a tweet
* unstar/favorite a tweet

As I suppose threading a tweet is actuall retweet a tweet with comment etc... but it is not offered in Twitter APIs (or I didn't find it)

Still in development: <br>

I have included gesture support for tweet item but not ready for the UI interactions yet when I am writting this: <br>

* gesture response
* remove a tweet
* send tweet as a message

Will update soon

**Production Builds**

Native: <br>
I wrote serveral scripts to split the common bundle of react-native and the specific business codes in dist folder <br>
just to run
### `yarn common_ios`
to strip out react, react-native codes, and to run
### `yarn bundle_ios`
to strip out our business codes. android is the same way

Web: <br>
For the web, it uses the original method of create-react-app but with some modification in the webpack configs. <br>
just to run
### `yarn build`
to have the production build ready in build folder


