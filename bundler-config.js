const postcssNested = require('postcss-nested')
const cssnano = require('cssnano')
const postcssCustomProperties = require('postcss-custom-properties')

const addMissingExport = require('./bundler-bee/babel-plugins/transform-add-missing-exports-to-amd').default


module.exports = {
  // loaded before bable.config.js
  babel: {
    // run before dependencies are resolved
    // ensures that babel is able to parse the files, but doesn't
    // need to perform any transformations
    clientSyntaxPlugins: [
      '@babel/plugin-syntax-jsx',
      '@babel/plugin-proposal-class-properties',
    ],
    client: {
      // runs after all dependecies are resolved
      // these should perform all necessary transformations
      // for the browser
      plugins: [
        '@babel/plugin-transform-classes',
        ['@babel/plugin-transform-modules-amd'],
        addMissingExport,
      ],
      sourceMaps: true
    },
    server: {
      // 
      plugins: [
        '@babel/plugin-syntax-jsx',
        '@babel/plugin-transform-modules-commonjs',
      ],
    },
  },
  postcss: {
    plugins: [
      postcssNested,
      postcssCustomProperties({
        importFrom: [
          './postcssCustomProperties/colors.css',
        ],
        preserve: false,
      }),
      process.env.NODE_ENV === 'prod' ? cssnano({
        preset: 'default',
      }) : undefined,
    ].filter(plugin => plugin),
  },
}
