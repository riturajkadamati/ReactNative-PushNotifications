import React, { Fragment,Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert

} from 'react-native';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
export default class App extends Component {
  componentDidMount(): void {
    this.checkPermission();
    this.messageListener();
    // this.createNotificationListeners()

  }

  // componentWillUnmount() {
  //   this.notificationListener();
  //   this.notificationOpenedListener();
  // }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      this.showAlert(title, body);
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getFcmToken();
    } else {
      this.requestPermission();
    }
  }

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
    } catch (error) {
      // User has rejected permissions
    }
  }

  getFcmToken = async () => {
    let fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
      await AsyncStorage.setItem('fcmToken', fcmToken);
      this.showAlert('Your Firebase Token is:', fcmToken);
    } else {
      fcmToken = await AsyncStorage.getItem('fcmToken');
      this.showAlert('Failed', 'No token received');
    }
  }

  messageListener = async () => {
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
      const { title, body } = notification;
        this.showAlert(title, body);
    });

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
      const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);

    });

    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const {title, body} = notificationOpen.notification;
      this.showAlert(title, body);
    }

    this.messageListener = firebase.messaging().onMessage((message) => {
      console.log(JSON.stringify(message));
    });
  }

  showAlert = (title, message) => {
    Alert.alert(
        title,
        message,
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
  ],
    {cancelable: false},
  );
  }

  render() {
    return (
        <View>
          <Text> textInComponent </Text>
        </View>
    )
  }
}

