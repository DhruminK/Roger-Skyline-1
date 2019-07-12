const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const indexFile = ({req, res}) =>
{
    let index = fs.createReadStream(path.join(__dirname, 'public', 'html', 'index.html'));
    index.on('error', () => {
        res.writeHead(404, {"Content-Type" : "text/plain"});
        res.write("File not found");
        res.end();
    })
    index.pipe(res);
};

const publicFile = ({req, res}) =>
{
    let file = fs.createReadStream(path.join(__dirname, (url.parse(req.url)).pathname));
    file.on('error', () => {
        res.writeHead(404, {"Content-Type" : "text/plain"});
        res.write("File not found");
        res.end();
    });
    file.pipe(res);
};

const sendFile = (e) =>
{
    let u = url.parse(e.req.url, true).pathname;
    u = u.slice(1, u.length);
    if (!u)
        return indexFile(e);
    u = u.split('/');
    if (u[0] === 'public')
        return publicFile(e);
    e.res.writeHead(404, {"Content-Type" : "text/plain"});
    e.res.write("File not found");
    e.res.end();
};

const port = process.env.PORT | 8080;
http
    .createServer((req, res) => sendFile({req, res}))
    .listen(port, () => {
        console.log(`Server started at ${port}`);
    });