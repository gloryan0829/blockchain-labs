var express = require('express');
var app = express();
var fs = require('fs');

app.listen(8080, function() {
    console.log('Server Start');
})

app.get('/MyTokenWallet', function(req, res){
    fs.readFile('MyTokenWallet.html', function (error, data) {
        if (error) {
            console.log(error);
        } else {
            res.writeHead(200, { 'Content-Type' : 'text/html'});
            res.end(data);
        }
    });
});


app.get('/sendRawTransaction', function(req, res){
    fs.readFile('sendRawTransaction.html', function (error, data) {
        if (error) {
            console.log(error);
        } else {
            res.writeHead(200, { 'Content-Type' : 'text/html'});
            res.end(data);
        }
    });
});

app.get('/MyTokenWallet_OLD', function(req, res){
    fs.readFile('MyTokenWallet_older.html', function (error, data) {
        if (error) {
            console.log(error);
        } else {
            res.writeHead(200, { 'Content-Type' : 'text/html'});
            res.end(data);
        }
    });
});

app.get('/My721TokenWallet_OLD', function(req, res){
    fs.readFile('My721TokenWallet_older.html', function (error, data) {
        if (error) {
            console.log(error);
        } else {
            res.writeHead(200, { 'Content-Type' : 'text/html'});
            res.end(data);
        }
    });
});


app.get('/campaign', function(req, res){
    fs.readFile('campaign.html', function (error, data) {
        if (error) {
            console.log(error);
        } else {
            res.writeHead(200, { 'Content-Type' : 'text/html'});
            res.end(data);
        }
    });
});
