const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error("No token");

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "K/Kx9XdZnZE%m/mlbM<s]tmvAsV|e2C;iR]hGbwg_u$");

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ code: 401, message: "No tienes permiso" });
  }
};
