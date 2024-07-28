// craco.config.js

module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        // Remove the existing source-map-loader
        webpackConfig.module.rules = webpackConfig.module.rules.filter(
          (rule) => !(rule.use && rule.use.some((use) => use.loader === 'source-map-loader'))
        );
  
        // Add a new source-map-loader rule that excludes the problematic module
        webpackConfig.module.rules.push({
          test: /\.mjs$/,
          enforce: 'pre',
          use: ['source-map-loader'],
          exclude: [/node_modules\/@mediapipe\/tasks-vision/],
        });
  
        return webpackConfig;
      },
    },
  };
  