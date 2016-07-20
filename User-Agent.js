// window.navigator.userAgent = 'react-native';
if (window.navigator && Object.keys(window.navigator).length == 0) {
  window = Object.assign(window, { navigator: { userAgent: 'ReactNative' }});
}
