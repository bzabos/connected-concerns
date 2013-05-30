var express = require('express'),
    fs = require('fs'),
    app = module.exports = express(),
    publicDirPath = __dirname + '/public';

app.configure(function () {
    app.use(express.static(publicDirPath));
    app.use(express.bodyParser({ uploadDir: publicDirPath + '/img/user/', keepExtensions: true }));
    app.set('views', __dirname + '/views');
    app.set("view engine", "jade");
    app.locals.pretty = true;
});

app.get('/', function (req, res) {
    res.redirect('/start');
});

app.get('/start', function (req, res) {
    res.render('start.jade', function(err, html){
        res.end(html);
    });
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

app.listen(8080, '0.0.0.0');