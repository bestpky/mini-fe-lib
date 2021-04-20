const path = require('path')

module.exports = {
    mode: 'production',
    entry: {
        index: path.resolve(__dirname, './index.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    optimization: {
        minimize: false // <---- 禁用 uglify.
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: '/node_modules/'
            }
        ]
    }
}
