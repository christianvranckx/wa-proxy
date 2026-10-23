const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({
  target: 'https://web.whatsapp.com',
  changeOrigin: true,
  ws: true,
  secure: true
});

const server = http.createServer((req, res) => {
  proxy.web(req, res);
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Proxy läuft auf Port ${PORT}`);
});
