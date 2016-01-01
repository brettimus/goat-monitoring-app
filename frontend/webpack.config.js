var webpack = require("webpack");

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false'))
});

module.exports = {
  entry: __dirname + '/src/index.js',
  output: {
    path: __dirname + '/dist/',
    filename: 'tada.js',
    publicPath: "/dist/",
  },
  module: {
    loaders: [
      {
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: 'babel-loader'
      },
      {
        test: /\.css$/, 
        loader: "style-loader!css-loader",
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"],
      }
    ],
  },
  devtool: "source-map",
  plugins: [definePlugin],
};