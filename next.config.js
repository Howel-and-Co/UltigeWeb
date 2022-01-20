const withSass = require("@zeit/next-sass");
const withCSS = require('@zeit/next-css')

module.exports = phase => {
    return withSass(
        withCSS({
            cssModules: true,
            webpack: (config) => {
                config.module.rules.push(
                    {
                        test: /\.md$/,
                        use: 'raw-loader'
                    }
                )
          
                return config
            },
        })
    );
}