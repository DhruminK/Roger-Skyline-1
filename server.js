const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const mimeType = e => {
    switch(e)
    {
        case ".html" : return "text/html";
        case ".css" : return "text/css";
        case ".js" : return "text/javascript";
        case ".jpg" :
        case ".jpeg" : return "image/jpeg";
        case ".png" : return "image/png";
        case ".svg" : return "image/svg+xml";
        case ".tif" :
        case ".tiff" : return "image/tiff";
        case ".webp" : return "image/webp";
        case ".bmp" : return "image/bmp";
        case ".gif" : return "image/gif";
        case ".ico" : return "image/vnd.microsoft.icon";
        default : return "text/plain";
        
    }
}

const indexFile = ({req, res}) =>
{
    const filePath = path.join(__dirname, 'public', 'html', 'index.html');
    const stat = fs.statSync(filePath);
    res.writeHead(200, {
        "Content-Type" : mimeType(".html"),
        "Content-Length" : stat.size
    });
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
    const filePath = path.join(__dirname, (url.parse(req.url)).pathname);
    const stat = fs.statSync(filePath);
    res.writeHead(200, {
        "Content-Type" : mimeType(path.extname(url.parse(req.url).pathname)),
        "Content-Length" : stat.size
    });
    let file = fs.createReadStream(filePath);
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