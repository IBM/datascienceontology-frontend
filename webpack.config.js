module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/build"
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
      }
    ]
  },
  externals: {
    "cls-bluebird": "cls-bluebird",
    "react": "React",
    "react-dom": "ReactDOM"
  },
  node: {
    // Needed because `openwhisk` (indirectly) imports these Node-only modules
    fs: "empty",
    net: "empty",
    tls: "empty",
  },
  devServer: {
    // Route 404's back to index.html to be handled by React Router.
    historyApiFallback: true
  }
};
