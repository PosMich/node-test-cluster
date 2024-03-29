var cluster = require('cluster');
var http    = require('http');
var numCPUs = require('os').cpus().length;

numCPUs = 1;

var app = require('../app');

http.globalAgent.maxSockets = Number.MAX_VALUE;

if (cluster.isMaster) {
// Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('setup', function() {
        console.log('cluster.setupMaster() called');
    });

    cluster.on('fork', function(worker) {
        console.log('worker ' + worker.process.pid + ' forked');
        console.log('\tid: ' + worker.id);
    });

    cluster.on('online', function(worker) {
        console.log('worker ' + worker.process.pid + ' is online!');
        console.log('\tid: ' + worker.id);
    });

    cluster.on('listening', function(worker, host) {
        console.log('worker ' + worker.process.pid + ' is listening on ' + host.address + ':' + host.port);
        console.log('\tid: ' + worker.id);
    });

    cluster.on('disconnect', function(worker) {
        console.log('worker ' + worker.process.pid + ' has disconnected');
        console.log('\tid: ' + worker.id);
    });

    cluster.on('exit', function(worker, code, signal) {
        if (worker.suicide === true) {
            console.log('life is hard, worker ' + worker.id + ' killed himself' );
        } else {
            console.log('worker ' + worker.process.pid + ' died');
        }
        cluster.fork();
    });

    Object.keys(cluster.workers).forEach(function(id) {
        cluster.workers[id].on('message', function(message) {
            console.log(message);
        });
    });
} else {
    // Workers can share any TCP connection
    // In this case its a HTTP server

    process.on('message', function(message) {
        console.log('Master says: ' + message);
        process.send('got it');
    });

    app();

}

