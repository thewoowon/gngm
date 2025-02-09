module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: `.env.${process.env.NODE_ENV || 'development'}`,
        blacklist: null,
        whitelist: null,
        safe: true,
        allowUndefined: true,
      },
    ],
    'react-native-reanimated/plugin', // Reanimated 플러그인 추가
  ],
};
