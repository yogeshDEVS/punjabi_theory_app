# gradeCpaital

React Native CLI mobile application scaffolded with React Native `0.79.1`.

## Current Status

The base native project has been created successfully. The starter screen has been replaced with a project placeholder. Design-specific screens will be implemented after the required Figma screenshots are provided.

## Tools Used

- React Native CLI
- Node.js
- npm
- OpenAI Codex for development assistance

## Libraries and Packages Used

### Runtime

- `react` `19.0.0`
- `react-native` `0.79.1`

### Development

- `typescript`
- `jest`
- `eslint`
- `prettier`
- `@react-native-community/cli`
- `@react-native-community/cli-platform-android`
- `@react-native-community/cli-platform-ios`
- `@react-native/babel-preset`
- `@react-native/eslint-config`
- `@react-native/metro-config`
- `@react-native/typescript-config`

## Setup and Installation

1. Install prerequisites from the official React Native environment setup guide:
   - Android Studio and Android SDK for Android development
   - Xcode and CocoaPods for iOS development on macOS
   - Node.js 18 or later

2. Move into the project directory:

```bash
cd gradeCpaital
```

3. Install dependencies if needed:

```bash
npm install
```

4. Start Metro:

```bash
npm start
```

5. Run on Android:

```bash
npm run android
```

6. Run on iOS:

```bash
bundle install
bundle exec pod install
npm run ios
```

## Available Scripts

- `npm start` - starts the Metro bundler
- `npm run android` - builds and runs the Android app
- `npm run ios` - builds and runs the iOS app
- `npm test` - runs tests
- `npm run lint` - runs ESLint
