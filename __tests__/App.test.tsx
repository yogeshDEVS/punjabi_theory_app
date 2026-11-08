/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('react-native-webview', () => {
  const {View} = require('react-native');

  return {
    WebView: function MockWebView(): React.JSX.Element {
      return <View />;
    },
  };
});

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
