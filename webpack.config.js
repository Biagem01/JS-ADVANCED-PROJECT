const path = require('path');

module.exports = {
  devtool: 'eval-source-map',
  entry: {
    main: './src/index.js', // Modifica il percorso se il tuo file è in JS/
  },

  mode: 'development',

  module: {
    rules: [
      {
        test: /\.jsx?$/, // Per i file JavaScript
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
        }],
      },
      {
        test: /\.css$/, // Per i file CSS
        use: ['style-loader', 'css-loader'], // Carica i CSS senza Sass
      },
    ],
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
};
