const http = require("http");
const router = require("./routes/router");

const server = http.createServer((req, res) => {
  router(req, res);
});

if (require.main === module) {
  server.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

module.exports = server;