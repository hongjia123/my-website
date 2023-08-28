const path = require("path");
const ora = require("ora");
const webpack = require("webpack");
const chalk = require("chalk");
const rm = require("rimraf");
const merge = require("webpack-merge");
const { VueLoaderPlugin } = require("vue-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ProgressBarWebpackPlugin = require("progress-bar-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {
  RenderBuildInfoPlugin,
  RenderServerInfoPlugin,
} = require("./build/tool");
const env = process.env.NODE_ENV;
const isProduction = env === "production";
const port = 3001;
let spinner;

// 开始构建
if (isProduction) {
  "\n", (spinner = ora(" Building for production...").start());
  rm.sync(path.resolve(__dirname, "dist")); // 构建前清除上一次构建产物
} else {
  console.log(chalk.bgBlue(" INFO ") + " Starting development server...");
}

// webpack配置文件
const config = {
  mode: env,
  entry: {
    index: "./src/main.js",
  },
  output: {
    filename: "static/js/[name].[contenthash:8].js",
    chunkFilename: "static/js/chunk-[chunkhash:8].[contenthash:8].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
  },
  resolveLoader: {
    modules: ["node_modules"],
    extensions: [".js", ".json"],
    mainFields: ["main", "module", "loader"],
  },
  resolve: {
    //   // 优先从node_modules中查找绝对路径模块
    modules: [
      path.join(process.cwd(), "node_modules"),
      path.join(process.cwd(), "src"),
    ],
    extensions: [".jsx", ".vue", ".js"],
    mainFields: ["main", "module", "browser"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "element-plus": path.resolve(__dirname, "node_modules/element-plus"),
    },
  },
  devtool: "source-map",
  context: __dirname,
  stats: {
    entrypoints: !isProduction,
    modules: false,
    children: false,
    colors: true,
    cached: false,
    cachedAssets: false,
    assets: false,
    chunkModules: false,
    timings: !isProduction,
    builtAt: !isProduction,
    hash: !isProduction,
    version: !isProduction,
    logging: "none",
    warnings: true,
    errors: true,
  },

  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: [
          path.resolve(__dirname, "node_modules"), // 排除 node_module 目录下的文件
        ],
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            // options: {
            //   modules: false,
            //   sourceMap:true
            // }
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              // modules: {
              //   localIdentName: '[local][data-v-[hash:8]',
              //   exportLocalsConvention:'asIs'
              // },
            },
          },
          "less-loader",
        ],
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },

      {
        test: /\.png|jpeg|gif|svg|img|mp4|MP4|ttf|woff/,
        loader: "url-loader",
        options: {
          limit: 8 * 1024, // 图片文件大小限制（单位字节）
          outputPath: "static/img/", // 输出目录
          name: "[name].[hash:8].[ext]", // 输出文件名格式
        },
      },
      // {
      //   test:/(assets\/common\.css)$/,
      //   type:'',
      //   loader:'file-loader',
      //   options: {
      //     name: 'chunk-vendors/[name].[css]',
      //   },
      // }
      {
        test: /\.(jsx|vue|js)$/,
        include: [
          path.resolve(__dirname, "src"), // 处理 src 目录下的文件
        ],
        loader: "eslint-loader",
        enforce: "pre",
      },
    ],
  },
  cache: false,

  plugins: [
    new webpack.DefinePlugin({
      // 被浏览器环境所识别
      processArgv: JSON.stringify(process.argv),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false)

    }),
    // 解析vue单文件组件插件
    new VueLoaderPlugin(),

    // 提取css样为单独文件
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[chunkhash:8].css",
      chunkFilename: "static/css/chunk-[chunkhash:8].[contenthash:8].css",
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html"), // 模板 HTML 文件的路径
      filename: "index.html", // 输出的 HTML 文件名称
      // chunks: ["index", "vendor"],
    }),
    // 构建进度条
    new ProgressBarWebpackPlugin({
      format:
        " build [:bar]" + chalk.green.bold(":percent") + " (:elapsed seconds)",
      clear: true,
    }),
    new RenderServerInfoPlugin({
      spinner,
      port,
    }),
  ],
};
module.exports = function () {
  if (env && !isProduction) {
    config.devServer = {
      client: {
        overlay: false,
      },
      // static: {
      //   directory: path.resolve(__dirname, "dist/index.html/"), // 指定要提供静态文件的目录
      // }, // 配置DevServer HTTP服务器的文件根目录
      port, // 端口号
      open: true, // 是否自动打开浏览器
      compress: true, //是否开启Gzip压缩
      historyApiFallback: true, // 是否开发 HTML5 history Api 网页
      hot: true, // 是否开启模块热替换模式
      https: false, // 是否开启HTTPS模式
      watchFiles: "src/",
      proxy: {},
    };
  } else {
    config.optimization = {
      usedExports: true,
      // sideEffects: true,
      // runtimeChunk: true,
      // runtimeChunk: {
      //     name: 'runtime'
      // },
      concatenateModules: true,
      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 6,
        maxInitialRequests: 4,
        automaticNameDelimiter: '-',
        enforceSizeThreshold: 50000,
        cacheGroups: {
          commons: {
            name: "chunk-vendors",
            test:/[\\/]src[\\/]/,
            chunks:"initial",
            minChunks: 1,
            reuseExistingChunk: true,
            // enforce:true
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: "chunk-vendors",
            chunks: "all",
            priority: 10,
          },
          styles: {
            test: /\.less$/,
            chunks: 'async',
            minSize: 1000,
            enforce: true,
          },
        },
      },
    };
    config.plugins.push(
      new RenderBuildInfoPlugin({
        // 间距
        maxLength: 34,
        //分别对应maxLength 30，60，90，会影响插件中的maxLength，同时设置maxLength,该属性会覆盖maxLength
        // size: 'small',
        // 必须根据当前编辑器设置的制表符占用字符位置设置，默认8
        // tabWidth: 8
      })
    );
  }
  return config;
};
