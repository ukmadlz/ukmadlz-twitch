const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');
const {
  getGlobalCssLoader,
} = require('next/dist/build/webpack/config/blocks/css/loaders');
/**
 * @param {ConstructorParameters<typeof VanillaExtractPlugin>[0]} pluginOptions Custom config for vanilla-extract
 */
function withVanillaExtract(pluginOptions = {}) {
  /**
   * @param {any} nextConfig Custom config for Next.js
   */
  return (nextConfig = {}) => {
    return {
      // For Webpack 4, you'll need to install it seperately
      future: {
        webpack5: true,
      },
      webpack(config, options) {
        const { dev, isServer } = options;

        config.module.rules.push({
          test: /\.css$/i,
          sideEffects: true,
          use: dev
            ? getGlobalCssLoader(
                {
                  assetPrefix: options.config.assetPrefix,
                  future: {
                    webpack5: true,
                  },
                  isClient: !isServer,
                  isServer,
                  isDevelopment: dev,
                },
                [],
                []
              )
            : [MiniCssExtractPlugin.loader, 'css-loader'],
        });

        const plugins = [];

        plugins.push(new VanillaExtractPlugin(pluginOptions));

        config.plugins.push(...plugins);

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options);
        }

        return config;
      },
    };
  };
}

module.exports = withVanillaExtract()();