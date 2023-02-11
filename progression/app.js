const http = require('http');
const fs = require('fs');

// Req is what we get, Res is what we send backm
const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    // we check if the req url is the root
    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message because we are on the root</title>');
        res.write('<body><form action="/message" method="POST"><input type="text"><button type="submit">Submit</button></form></body>');
        res.write('</html>');
        return res.end(); // need to return to exit out anonymous function.
    };

    if (url === '/message' && method === 'POST') {
        fs.writeFileSync('log.txt', 'Dummy');
        res.writeHead(302, { Location: '/' });

        // res.writeHead(302['Location']['/']);
        return res.end();
        // response.writeHead(statusCode[, statusMessage][, headers]);
    };

    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello from my Node.js Server! uwu</h1></body>');
    res.write('</html>');
    res.end();
});

// need to listen to our port
server.listen(3000);