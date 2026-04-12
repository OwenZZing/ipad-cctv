const express = require('express');
const { ExpressPeerServer } = require('peer');
const path = require('path');

const PORT = process.env.PORT || 9000;
const app = express();

app.use(express.static(__dirname));

const server = app.listen(PORT, () => {
  console.log(`HTTP  http://localhost:${PORT}`);
  console.log(`Broadcast: http://localhost:${PORT}/broadcast.html`);
  console.log(`View:      http://localhost:${PORT}/view.html`);
});

const peerServer = ExpressPeerServer(server, { path: '/', allow_discovery: true });
app.use('/peerjs', peerServer);

peerServer.on('connection', (c) => console.log('peer connect', c.getId()));
peerServer.on('disconnect', (c) => console.log('peer disconnect', c.getId()));
