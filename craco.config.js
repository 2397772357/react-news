const path = require("path");
// HtmlWebpackPlugin
const { whenProd, getPlugin, pluginByName } = require("@craco/craco");
module.exports = {
  webpack: {
    alias: {
      "@": path.join(__dirname, "src"),
    },
    configure: (webpackConfig) => {
      // 对webpack进行配置
      whenProd(() => {
        // 只会在生产环境执行
        webpackConfig.externals = {
          react: "React",
          "react-dom": "ReactDOM",
          redux: "Redux",
          "redux-thunk": "ReduxThunk",
          axios: "axios",
          antd: "antd",
          lodash: "_",
          echarts: 'echarts',
        };
      });

      return webpackConfig;
    },
  },
};
