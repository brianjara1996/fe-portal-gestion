const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const deps = require("./package.json").dependencies;
require('dotenv').config();
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const port = process.env.REACT_APP_PORT || 3001

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: './src/index',
  target: "web",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "/"
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    minimize: true,
    minimizer: [(compiler) => {
      const TerserPlugin = require('terser-webpack-plugin');
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        terserOptions: {
          compress: {},
        }
      }).apply(compiler);
    }, new CssMinimizerPlugin()],
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    fallback: {
      "fs": false,
      "os": false,
      "path": false
    },
  },
  devServer: {
    contentBase: "./dist",
    port: port,
    hot: true,
    disableHostCheck: true,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(scss|css)$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.(jpe?g|png|gif|svg)(\?[a-z0-9=.]+)?$/,
        use: {
          loader: 'url-loader?limit=100000'
        }
      }
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "PortalOperative",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {},
      shared: {
        ...deps,
        react: {
          singleton: true,
          //requiredVersion: deps.react,
          eager: true
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
          eager: true
        },
      },

    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    new CopyPlugin({
      patterns: [{
        from: "public",
        globOptions: {
          ignore: [
            '**/index.html'
          ]
        }
      }]
    }),
    new ForkTsCheckerWebpackPlugin(),
    new ReactRefreshWebpackPlugin(),
    new Dotenv(),
    new MiniCssExtractPlugin()
  ],

};
