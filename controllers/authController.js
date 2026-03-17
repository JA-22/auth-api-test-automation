let users = [];
let id = 1;

// helper para responder JSON
const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

// helper para parsear body sin romper
const parseBody = (req, callback) => {
  let body = "";

  req.on("data", chunk => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const parsed = body ? JSON.parse(body) : {};
      callback(parsed);
    } catch (e) {
      callback(null);
    }
  });
};

// REGISTER
exports.register = (req, res) => {

  parseBody(req, ({ email, password } = {}) => {

    if (!email || !password) {
      return sendJSON(res, 400, { error: "Email and password required" });
    }

    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      return sendJSON(res, 400, { error: "User already exists" });
    }

    const user = { id: id++, email, password, token: null };
    users.push(user);

    return sendJSON(res, 201, user);
  });
};

// LOGIN
exports.login = (req, res) => {

  parseBody(req, ({ email, password } = {}) => {

    const user = users.find(u => u.email === email);

    if (!user || user.password !== password) {
      return sendJSON(res, 401, { error: "Invalid credentials" });
    }

    const token = "token-" + user.id;
    user.token = token;

    return sendJSON(res, 200, {
      message: "Login successful",
      token
    });
  });
};

// PROFILE
exports.profile = (req, res) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return sendJSON(res, 401, { error: "Token required" });
  }

  const token = auth.split(" ")[1];

  const user = users.find(u => u.token === token);

  if (!user) {
    return sendJSON(res, 401, { error: "Invalid token" });
  }

  return sendJSON(res, 200, {
    message: "Profile data",
    userId: user.id,
    email: user.email
  });
};