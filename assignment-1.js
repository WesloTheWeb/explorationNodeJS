const http = require('http');

const routes = require('./routes');

const server = http.createServer(routes);
server.listen(3000); 


const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    // root route
    if (url === '/') {
        res.write('<html>');
        res.write('<ul><li>User 1</ul>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">SEND</button></form></body>');
        res.write('</html>');
        return res.end();
    }

    // users route
    if (url === '/users') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">SEND</button></form></body>');
        res.write('</html>');
        return res.end();
    }

}