const express = require("express");
const jwt = require("jsonwebtoken");
const user = express.Router();
const db = require("../Config/Database");

user.post("/login", async (req, res, next) => {
  const { user_email, user_password } = req.body;

  const query = `SELECT * FROM user WHERE email = '${user_email}' AND password = '${user_password}'`;
  const rows = await db.query(query);
  
  if (!(user_email && user_password))
    return res.status(400).json({ code: 400, message: "Campos incompletos" });

  if (rows.length == 1) {
    const token = jwt.sign(
      {
        user_id: rows[0].id,
        user_mail: rows[0].email,
        user_name: rows[0].name,
      },
      process.env.JWT_SECRET || "K/Kx9XdZnZE%m/mlbM<s]tmvAsV|e2C;iR]hGbwg_u$"
    );

    return res.status(200).json({ code: 200, message: token });
  }

  return res.status(200).json({ code: 401, message: "Usuario y/o contraseña incorrectos" });
});

module.exports = user;
