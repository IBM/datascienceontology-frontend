const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  mode: "production",
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "build")
  },
  performance: {
    // Don't warn about bundle size (https://github.com/webpack/webpack/issues/3486)
    hints: false
  },
  devtool: "source-map",
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      },
      // Bundle all imported '.css' files.
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [require('autoprefixer')]
            }
          }
        ]
      },
      // Bundle fonts referenced in CSS files.
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: "assets", to: "assets" },
      { from: "index.html" }
    ])
  ],
  externals: {
    "lodash": {
      commonjs: "lodash",
      amd: "lodash",
      root: "_",
      var: "_"
    },
    "react": "React",
    "react-dom": "ReactDOM",
    "katex": "katex"
  },
  devServer: {
    // Route 404's back to index.html to be handled by React Router.
    historyApiFallback: true
  }
};
