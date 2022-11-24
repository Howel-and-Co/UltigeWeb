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
                    },
                    { 
                        test: /pdf\.worker\.min\.js$/, 
                        loader: 'url-loader', 
                        options: { name: 'pdfWorker.[ext]', limit: 1000, }, 
                        type: 'javascript/auto'
                    }
                )
          
                return config
            },
        })
    );
}