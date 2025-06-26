const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: " No token provided or token is malformed." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Now available in route handlers: req.user.role, etc.
    next();
  } catch (err) {
    const isExpired = err.name === "TokenExpiredError";
    const status = 401;
    const msg = isExpired
      ? " Token expired. Please log in again."
      : " Invalid or tampered token.";

    console.error("Authentication error:", err.message);
    return res.status(status).json({ message: msg });
  }
};

module.exports = authenticateToken;
