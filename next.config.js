const path = require('path')

module.exports = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                port: '',
                pathname: '**',
            },
        ],
    },
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
}