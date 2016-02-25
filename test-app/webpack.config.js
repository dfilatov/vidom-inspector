module.exports = {
    entry : `${__dirname}/index.js`,
    output : {
        path : __dirname + '/build',
        filename : 'app.bundle.js',
        publicPath : '/build/'
    },
    module : {
        loaders : [
            { test : /\.js$/, loaders : ['babel'] },
            { test: /\.css$/, loaders : ['style', 'css'] }
        ]
    }
};
