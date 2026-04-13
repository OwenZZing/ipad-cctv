const express = require('express');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 9000;
const app = express();

app.use(express.static(__dirname));

const server = app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server, path: '/stream' });

let broadcaster = null;
const viewers = new Set();

wss.on('connection', (ws) => {
  ws.on('message', (data, isBinary) => {
    if (!isBinary) {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'broadcaster') {
        if (broadcaster && broadcaster.readyState === ws.OPEN) broadcaster.close();
        broadcaster = ws;
        ws.role = 'broadcaster';
        console.log('broadcaster connected');
      } else if (msg.type === 'viewer') {
        viewers.add(ws);
        ws.role = 'viewer';
        console.log('viewer connected, total:', viewers.size);
      }
    } else {
      // binary = JPEG frame — relay to all viewers
      if (ws.role === 'broadcaster') {
        for (const v of viewers) {
          if (v.readyState === v.OPEN) v.send(data, { binary: true });
        }
      }
    }
  });

  ws.on('close', () => {
    if (ws.role === 'broadcaster') {
      broadcaster = null;
      console.log('broadcaster disconnected');
    } else if (ws.role === 'viewer') {
      viewers.delete(ws);
      console.log('viewer disconnected, remaining:', viewers.size);
    }
  });
});
