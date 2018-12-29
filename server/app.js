const express = require("express");
const busboyBodyParser = require("busboy-body-parser");
const mongoose = require("mongoose");
const config = require("./config.js");
const cloudinary = require("cloudinary");
const cors = require("cors");
const passport = require("passport");
const path = require("path");
const consolidate = require("consolidate");

const newConnectOptions = { useNewUrlParser: true };

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret
});

const app = express();

const viewsDir = path.join(__dirname, "views");
app.engine("html", consolidate.swig);
app.set("views", viewsDir);
app.set("view engine", "html");

app.use(passport.initialize());

app.use(cors());

app.use(
  busboyBodyParser({
    limit: "5mb"
  })
);

require("./modules/passport");

const usersRouter = require("./routes/users");
const workspacesRouter = require("./routes/workspaces");
const formsRouter = require("./routes/forms");
const authRouter = require("./routes/auth");

app.use("/api/v1/users", usersRouter);
app.use("/api/v1/workspaces", workspacesRouter);
app.use("/api/v1/forms", formsRouter);
app.use("/api/v1/auth", authRouter);

app.get("/api/v1", (req, res) => {
  res.json({});
});

app.get("/developer/v1", (req, res) => {
  res.render("developer");
});

app.get(
  "/api/v1/me",
  passport.authenticate("basic", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

app.use((req, res) => {
  res.sendStatus(404);
});

mongoose
  .connect(
    config.DatabaseUrl,
    newConnectOptions
  )
  .then(() => {
    console.log("Connected to db");
  })
  .then(() =>
    app.listen(config.ServelPort, function() {
      console.log("Server is ready");
    })
  )
  .catch(() => {
    console.log("Connection error");
  });
