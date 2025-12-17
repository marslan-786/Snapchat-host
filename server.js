const WebSocket = require('ws');
const net = require('net');
const http = require('http');

// Railway Port (Environment Variable se lega)
const port = process.env.PORT || 8080;

// HTTP Server banayen taake Railway khush rahe (Health check)
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('SSH over WebSocket is Running! @Gemini\n');
});

// WebSocket Server ko HTTP server ke sath attach karen
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('New WebSocket Connection established');

    // Internal SSH port (Standard 22)
    const sshClient = net.createConnection({ port: 22, host: '127.0.0.1' });

    ws.on('message', (msg) => {
        sshClient.write(msg);
    });

    sshClient.on('data', (data) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(data);
        }
    });

    ws.on('close', () => {
        sshClient.end();
        console.log('Connection Closed');
    });

    sshClient.on('end', () => {
        ws.close();
    });

    sshClient.on('error', (err) => {
        console.log('SSH Client Error: ', err.message);
        ws.close();
    });
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
