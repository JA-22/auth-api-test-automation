let users = [];
let id = 1;

function parseBody(req) {
  return new Promise(resolve => {

    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      resolve(JSON.parse(body || "{}"));
    });

  });
}

exports.register = async (req, res) => {

  const { email, password } = await parseBody(req);

  if (!email || !password) {
    res.writeHead(400);
    return res.end(JSON.stringify({ error: "Email and password required" }));
  }

  const exists = users.find(u => u.email === email);

  if (exists) {
    res.writeHead(400);
    return res.end(JSON.stringify({ error: "User already exists" }));
  }

  const user = { id: id++, email, password };
  users.push(user);

  res.writeHead(201, { "Content-Type": "application/json" });
  res.end(JSON.stringify(user));
};

exports.login = async (req, res) => {

  const { email, password } = await parseBody(req);

  const user = users.find(u => u.email === email);

  if (!user || user.password !== password) {
    res.writeHead(401);
    return res.end(JSON.stringify({ error: "Invalid credentials" }));
  }

  res.writeHead(200);
  res.end(JSON.stringify({
    message: "Login successful",
    userId: user.id
  }));
};