/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  Component,
} from 'react';

import { 
  AppRegistry,
  StyleSheet,
  Platform,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';

import {
  isFirstTime,
  isRolledBack,
  packageVersion,
  currentVersion,
  checkUpdate,
  downloadUpdate,
  switchVersion,
  switchVersionLater,
  markSuccess,
} from 'react-native-update';

import _updateConfig from './update.json';
const {appKey} = _updateConfig[Platform.OS];


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {

  componentWillMount(){
    if (isFirstTime) {
      Alert.alert('提示', '这是当前版本第一次启动,是否要模拟启动失败?失败将回滚到上一版本', [
        {text: '是', onPress: ()=>{throw new Error('模拟启动失败,请重启应用')}},
        {text: '否', onPress: ()=>{markSuccess()}},
      ]);
    } else if (isRolledBack) {
      Alert.alert('提示', '刚刚更新失败了,版本被回滚.');
    }
  }
  doUpdate = info => {
    downloadUpdate(info).then(hash => {
      Alert.alert('提示', '下载完毕,是否重启应用?', [
        {text: '是', onPress: ()=>{switchVersion(hash);}},
        {text: '否',},
        {text: '下次启动时', onPress: ()=>{switchVersionLater(hash);}},
      ]);
    }).catch(err => { 
      Alert.alert('提示', '更新失败.');
    });
  };
  checkUpdate = () => {
    checkUpdate(appKey).then(info => {
      if (info.expired) {
        Alert.alert('提示', '您的应用版本已更新,请前往应用商店下载新的版本', [
          {text: '确定', onPress: ()=>{info.downloadUrl && Linking.openURL(info.downloadUrl)}},
        ]);
      } else if (info.upToDate) {
        Alert.alert('提示', '您的应用版本已是最新.');
      } else {
        Alert.alert('提示', '检查到新的版本'+info.name+',是否下载?\n'+ info.description, [
          {text: '是', onPress: ()=>{this.doUpdate(info)}},
          {text: '否',},
        ]);
      }
    }).catch(err => { 
      Alert.alert('提示', '更新失败.');
    });
  };


  render() {
    let pic = {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
    };

    return (
      
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
        {/* <Text>Hello world</Text> */}

        <View style = {{alignItems: 'center'}}>
          <Greeting name='Rexxar'/>
          <Greeting name='Valeera'/>
        </View>

        <Image source = {pic} style = {{width: 193, height: 110}}/>

        <View style = {{alignItems: 'center'}}>
          <Blink Text = 'Look at me look at me look at me'/>
        </View>

        <View>
          <Text style={styles.red}>just red</Text>
        </View>

        <View style={styles.container}>
          <Text style={styles.welcome}>
            欢迎使用热更新服务
          </Text>
          <Text style={styles.instructions}>
            这是版本一 {'\n'}
            当前包版本号: {packageVersion}{'\n'}
            当前版本Hash: {currentVersion||'(空)'}{'\n'}
          </Text>
          <TouchableOpacity onPress={this.checkUpdate}>
            <Text style={styles.instructions}>
              点击这里检查更新
            </Text>
          </TouchableOpacity>
      </View>

        <View style={{
          flex: 1, 
          flexDirection:'row',
          justifyContent:'space-between'
          }}>
          {/* <View style={{width: 100, height: 20, backgroundColor: styles.red.color }}/> */}
          <View style={{width: 20, height: 10, backgroundColor: 'powderblue'}}/>
          <View style={{width: 20, height: 10, backgroundColor: 'skyblue'}} />
          <View style={{width: 20, height: 10, backgroundColor: 'steelblue'}} />
        </View>

      </View>
    );
  }
};

class Greeting extends Component {
  render() {
    return (
      <Text style={styles.welcome}>hello {this.props.name}!</Text>
    );
  }
};

class Blink extends Component {
  constructor(props) {
    super(props);
    this.state = { showText: true};

    setInterval(() => {
      this.setState(previousState => {
        return { showText: !previousState.showText };
      });
    }, 1000);
  }

  render() {
    let display = this.state.showText ? this.props.Text : ' ';
    return (
      <Text style = {styles.instructions}>{display}</Text>
    );
  }
};

// export default class HelloWorldApp extends Component {
//   render() {
//     return (
//       <Text>Hello world</Text>
//     );
//   }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  bigblue: {
    color: 'blue',
    fontSize: 30,
    fontWeight: 'bold',
  },
  red:{
    color: 'red',
  },
});

