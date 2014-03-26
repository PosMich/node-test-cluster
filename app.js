var http = require('http');
var seed = require('seed-random');

seed("foo", {global: true});

function rnd() {
    var rnd = Math.floor( 15 + Math.random()*15 );
    console.log(rnd);
    return rnd;
}

function fib(n) {
    if (n < 2) {
        return 1;
    } else {
        return fib(n - 2) + fib(n - 1);
    }
}

module.exports = function() {
    http.createServer(function(req, res) {
        fib(rnd());
        res.writeHead(200);
        res.end("hello world\n");
    }).listen(8000);
}
