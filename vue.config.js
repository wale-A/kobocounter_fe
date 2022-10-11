// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  devServer: {
    compress: true,
    disableHostCheck: true,
  },
  pwa: {
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "./src/service-worker.js",
    },
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [path.resolve(__dirname, "./src/styles/main.scss")],
    },
  },
};
