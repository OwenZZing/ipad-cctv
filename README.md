# Stage 1 — Local PoC

## Run
```
cd poc
npm install
npm start
```

Server starts on port 9000. Open:
- Broadcaster (iPad / laptop webcam): `http://<host>:9000/broadcast.html`
- Viewer (phone / PC): `http://<host>:9000/view.html`

Both pages default to room id `cctv-room-1`. Override with `?room=myroom`.

## Same-Wi-Fi test
1. Find the broadcaster machine's LAN IP (e.g. `192.168.1.20`).
2. On the broadcasting device open `http://192.168.1.20:9000/broadcast.html` → tap **Start broadcasting** → allow camera.
3. On the viewer device open `http://192.168.1.20:9000/view.html` → tap **Connect**.

## iOS Safari note
`getUserMedia` requires HTTPS **except** on `localhost`. For LAN testing on an iPad you need one of:
- Run the broadcaster on the same machine the iPad is on (not useful here), or
- Put the server behind HTTPS (ngrok / Caddy / Stage 2 deploy), or
- Trust a self-signed cert on the iPad.

Easiest for quick testing: `ngrok http 9000` → use the https URL on the iPad.

## Next (Stage 2)
Deploy `server.js` to Render / Fly.io → permanent HTTPS URL → works from cellular.
