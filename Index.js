const morgan = require("morgan");
const express = require("express");
const app = express();

// Routes
const Employee = require("./Routes/Employee");
const User = require("./Routes/User");

// MiddleWares
const Authorization = require("./MiddleWare/Authorization");
const NotFound = require("./MiddleWare/NotFound");
const Index = require("./MiddleWare/Index");
const CORS = require("./MiddleWare/CORS");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(CORS);

app.get("/", Index);

app.use("/user", User);

app.use(Authorization);
app.use("/employee", Employee);

app.use(NotFound);

app.listen(3000, () => {
  console.log("Server is running...");
});
