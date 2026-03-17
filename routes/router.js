const { register, login } = require("../controllers/authController");

function router(req, res) {

  if (req.method === "POST" && req.url === "/register") {
    return register(req, res);
  }

  if (req.method === "POST" && req.url === "/login") {
    return login(req, res);
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Route not found" }));
}

module.exports = router;