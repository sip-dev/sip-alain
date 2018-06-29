
const _proxyServer = '10.201.76.185';
const _localServer = 'localhost:4200';
// const PROXY_CONFIG = {
//     "/api/*": {
//         "target": "http://"+serverIp,
//         "secure": false,
//         "bypass": function (req, res, proxyOptions) {
//             if (req.headers.accept.indexOf("html") !== -1) {
//                 console.log("Skipping proxy for browser request.");
//                 return "/index.html";
//             }
//             req.headers["X-Custom-Header"] = "yes";
//         }
//     }
// }

const PROXY_CONFIG = [
  {
      context: [
          "/api",
          "/sipadmin/api",
          "/sso",
          "/themes",
          "/ssoclient"
      ],
      target: 'http://'+_proxyServer,
      secure: false,
      changeOrigin: true,
      hostRewrite: _localServer
  }
];

module.exports = PROXY_CONFIG;