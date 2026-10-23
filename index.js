const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({
  target: 'https://web.whatsapp.com',
  changeOrigin: true,
  ws: true,
  secure: true,
  autoRewrite: true,
  protocolRewrite: 'https'
});

// Wichtige Header für WhatsApp-Anfragen anpassen
proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('Referer', 'https://web.whatsapp.com/');
  proxyReq.setHeader('Origin', 'https://web.whatsapp.com');
});

const server = http.createServer((req, res) => {
  proxy.web(req, res, {}, (e) => {
    console.error(e);
    res.writeHead(502);
    res.end('Proxy-Fehler beim Weiterleiten');
  });
});

// WebSocket-Verbindungen für interaktive Skripte unterstützen
server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Proxy läuft auf Port ${PORT}`);
});
