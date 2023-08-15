module.exports = {
  presets: [
    [
      // "@vue/cli-plugin-babel/preset",
      "@babel/preset-env",
    ],
  ],
  plugins: [
    "@vue/babel-plugin-jsx",
    "@babel/plugin-syntax-jsx",
    "@babel/plugin-syntax-dynamic-import",
    // [
    //   "prismjs",
    //   {
    //     "languages":["html","javascript","css","markup",""],
    //     "css":true
    //   }
    // ]
    // "@babel/plugin-transform-modules-commonjs",
    // "@babel/preset-typescript"
  ],
};
