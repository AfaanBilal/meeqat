import 'react-native-url-polyfill/auto';

if (typeof global.DOMException === 'undefined') {
  global.DOMException = class DOMException extends Error {
    constructor(message, name = 'Error') {
      super(message);
      this.name = name;
    }
  };
}

import { registerRootComponent } from 'expo';

import App from './App';

registerRootComponent(App);