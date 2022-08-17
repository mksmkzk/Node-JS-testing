// Basic HTTP Module
const http = require('http');

const server = http.createServer((req, res) => {
    console.log(req)
    if (req.url === '/') {
        res.write('Hello World');
        res.end();
    }
    if (req.url === '/about') {
        res.write(JSON.stringify([1, 2, 3]));
        res.end();
    }

    console.log('here');
    res.write('<h1>Oops!</h1><p>Cant Find Page youre looking for</p><a href="/">Back Home </a>');
    res.end();

});

server.listen(3000);