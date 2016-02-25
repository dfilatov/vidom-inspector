var jsLoaders = ['babel'];

if(process.env.NODE_ENV === 'production') {
    jsLoaders.push('transform?envify');
}

module.exports = {
    entry : ['main', 'background', 'content', 'panel', 'agent'].reduce((res, entry) => {
        res[entry] = `${__dirname}/src/${entry}.js`;
        return res;
    }, {}),
    output : {
        path : __dirname + '/build',
        filename : '[name].js'
    },
    module : {
        loaders : [
            { test : /\.js$/, loaders : jsLoaders },
            { test: /\.css$/, loaders : ['style', 'css'] }
        ]
    }
};
