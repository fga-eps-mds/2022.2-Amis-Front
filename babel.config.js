module.exports = {
  presets: [
    "@babel/preset-env",
    ["@babel/preset-react", {
      "runtime": "automatic"
    }],
    "@babel/preset-typescript",
  ],
  plugins: [
    function () {
      return {
        visitor: {
          MetaProperty(path) {
            path.replaceWithSourceString('process')
          },
        },
      }
    },
  ],
};