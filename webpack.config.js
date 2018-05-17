/**
 * External dependencies
 */
const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// Main CSS loader for everything but blocks..
const cssExtractTextPlugin = new ExtractTextPlugin({
  filename: "client/dist/style.css"
});

// Configuration for the ExtractTextPlugin.
const extractConfig = {
  use: [
    { loader: "raw-loader" },
    {
      loader: "postcss-loader",
      options: {
        plugins: [require("autoprefixer")]
      }
    },
    {
      loader: "sass-loader",
      query: {
        includePaths: [
          path.resolve(
            __dirname,
            "node_modules/gutenberg/edit-post/assets/stylesheets"
          )
        ],
        data:
          '@import "colors"; @import "admin-schemes"; @import "breakpoints"; @import "variables"; @import "mixins"; @import "animations";@import "z-index";',
        outputStyle:
          "production" === process.env.NODE_ENV ? "compressed" : "nested"
      }
    }
  ]
};

const externals = {
    moment: 'moment',
    Injector: 'Injector',
    schemaFieldValues: 'schemaFieldValues',
    jQuery: 'jQuery'
};

const wpDependencies = [
  "i18n",
  "components",
  "element",
  "blocks",
  "utils",
  "date",
  "data",
  "editor",
  "viewport"
];

const alias = {
  "original-moment": path.resolve(__dirname, "node_modules/moment"),
  "moment": path.resolve(__dirname, "client/src/moment.js"),
  "InsertMediaModal": path.resolve(__dirname, "../../silverstripe/asset-admin/client/src/containers/InsertMediaModal/InsertMediaModal")
};

wpDependencies.forEach(wpDependency => {
  alias["@wordpress/" + wpDependency] = path.resolve(
    __dirname,
    "node_modules/gutenberg/" + wpDependency
  );
});

const config = {
  entry: {
    bundle: "./client/src/bundle.js",
    globals: "./client/src/globals.js"
  },
  externals,
  resolve: { alias },
  output: {
    filename: "client/dist/[name].js"
  },
  module: {
    rules: [
      {
        test: /\.pegjs/,
        use: "pegjs-loader"
      },
      {
        test: /\.js$/,
        include: wpDependencies
          .map(dependency =>
            path.resolve(__dirname, "node_modules/gutenberg", dependency)
          )
          .concat([path.resolve(__dirname, "client/src")]),
        use: "babel-loader"
      },
      {
        test: /\.s?css$/,
        use: cssExtractTextPlugin.extract(extractConfig)
      },
      {
        test: /\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: 'wp-admin/load-scripts.php',
          replace: 'resources/mademedia/silverstripe-gutenberg-editor/client/dist/code-mirror.js',
        }
      },
      {
        test: /\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: 'wp-admin/load-styles.php',
          replace: 'resources/mademedia/silverstripe-gutenberg-editor/client/dist/code-mirror.css',
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      )
    }),
    cssExtractTextPlugin,
    new webpack.LoaderOptionsPlugin({
      minimize: process.env.NODE_ENV === "production",
      debug: process.env.NODE_ENV !== "production"
    })
  ],
  stats: {
    children: false
  },
  devServer: {
    contentBase: "./public"
  }
};

switch (process.env.NODE_ENV) {
  case "production":
    config.plugins.push(new webpack.optimize.UglifyJsPlugin());
    break;

  default:
    config.devtool = "source-map";
}

module.exports = config;
