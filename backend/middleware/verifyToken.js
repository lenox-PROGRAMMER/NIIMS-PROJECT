const jwt = require("jsonwebtoken");

const verifyToken = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "🔒 Token missing or malformed." });
      }

      const token = authHeader.split(" ")[1];

      //  Decode and verify the JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //  Optional role enforcement
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "⛔ Access denied: insufficient role." });
      }

      // Attach decoded user to request
      req.user = decoded;

      // Optional: log access attempts (only in dev)
      if (process.env.NODE_ENV !== "production") {
        console.log(` [${decoded.role}] ${decoded.email} passed token check`);
      }

      next();
    } catch (err) {
      const isExpired = err.name === "TokenExpiredError";
      const code = 401;
      const msg = isExpired
        ? "Session expired. Please log in again."
        : " Invalid token.";

      console.error("Auth Error:", err.message);
      return res.status(code).json({ message: msg });
    }
  };
};

module.exports = verifyToken;
