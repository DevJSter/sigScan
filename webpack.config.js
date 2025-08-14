const path = require('path');

module.exports = {
  target: 'node',
  mode: 'development',
  entry: {
    'extension/extension': './src/extension/extension.ts',
    'cli/index': './src/cli/index.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    vscode: 'commonjs vscode',
    sqlite3: 'commonjs sqlite3',
    fsevents: 'commonjs fsevents'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      }
    ]
  },
  devtool: 'source-map'
};
