const express = require("express");
const User = require("../models/user.js");
const Workspace = require("../models/workspace.js");
const Form = require("../models/form.js");
const passport = require("passport");
const HttpError = require("../modules/http-error.js");
const sha512 = require("js-sha512");

const router = express.Router();

router.get("/", passport.authenticate("jwt", { session: false }), function(
  req,
  res
) {
  if (!req.user.role) {
    const error = {
      error: "Accessible only for admins"
    };
    res.status(403).json(error);
  } else {
    User.getAll()
      .then(users => {
        let result = {};
        if (req.query.search) {
          let searched = new Array();
          for (let index in users) {
            if (users[index].login.includes(req.query.search)) {
              searched.push(users[index]);
            }
          }
          users = searched;
        }
        result["totalQuantity"] = users.length;
        if (req.query.page) {
          let page = parseInt(req.query.page);
          const onPage = 5;
          let allPages = Math.ceil(users.length / onPage);
          if (allPages === 0) {
            allPages = 1;
          }
          if (isNaN(page)) {
            page = 1;
          }
          if (page <= 0 || page > allPages) {
            const error = new HttpError(
              404,
              `No such page, there are only 5 users on each page and there are ${
                users.length
              } users that match your query`
            );
            return Promise.reject(error);
          } else {
            users = users.slice(onPage * (page - 1), onPage * page);
          }
        }
        result["users"] = users;
        res.json(result);
      })
      .catch(err => {
        HttpError.processError(err, res);
      });
  }
});

router.get("/:id", passport.authenticate("jwt", { session: false }), function(
  req,
  res
) {
  if (!req.user.role) {
    const error = {
      error: "Acessible only for admins"
    };
    res.status(403).json(error);
  } else {
    User.getById(req.params.id)
      .then(user => {
        if (user === undefined) {
          const error = new HttpError(404, `User not found`);
          return Promise.reject(error);
        }
        res.status(200).json(user);
      })
      .catch(err => {
        HttpError.processError(err, res);
      });
  }
});

router.put(
  "/:id(\\w{24})",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.user !== req.params.id) {
      const error = {
        error: "Accessible only for user"
      };
      res.status(403).json(error);
    } else {
      User.getById(req.params.id)
        .then(user => {
          if (user === undefined) {
            const error = new HttpError(404, `User not found`);
            return Promise.reject(error);
          }
          const file = req.files.photoFile;
          if (!req.body.name) {
            user.name = req.body.name;
          }
          if (req.body.surname !== undefined) {
            user.surname = req.body.surname;
          }
          if (file === undefined) {
            return Promise.all([User.update(user)]);
          } else {
            return Promise.all([Form.savePicture(file.data), user]);
          }
        })
        .then(([result, user]) => {
          if (result.url !== undefined) {
            user.avaUrl = result.url;
            return User.update(user);
          } else {
            return result;
          }
        })
        .then(() => {
          res.sendStatus(200);
        })
        .catch(err => {
          HttpError.processError(err, res);
        });
    }
  }
);

router.post("/", function(req, res) {
  if (!req.body) {
    const json = {
      error: "No body"
    };
    res.status(400).json(json);
    return;
  }
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;
  let file = req.files.photoFile;
  try {
    if (
      username === undefined ||
      password === undefined ||
      password2 === undefined
    ) {
      throw new Error("Missing username or passwords");
    }
    if (password !== password2) {
      throw new Error("Passwords are different");
    }
    if (
      !(typeof username === "string") ||
      !(typeof password === "string") ||
      !(typeof password2 === "string") ||
      (username.length > 24 || username.length < 4) ||
      (password.length > 24 || password.length < 4)
    ) {
      throw new Error(
        "Username or password are invalid (length must be longer than 4 and shorter than 24"
      );
    }
    if (!req.body.name) {
      throw new Error(`Missing name`);
    }
  } catch (e) {
    const json = {
      error: e.message
    };
    res.status(400).json(json);
    return;
  }
  if (file === undefined || file.data === null) {
    file = {};
  }
  Form.savePicture(file.data)
    .then(result => {
      let imageUrl;
      if (result === undefined) {
        imageUrl = undefined;
      } else {
        imageUrl = result.url;
      }
      return User.insert(
        new User(
          null,
          username,
          1,
          req.body.name,
          req.body.surname,
          undefined,
          imageUrl,
          false,
          null,
          null,
          sha512(password)
        )
      );
    })
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      HttpError.processError(err, res);
    });
});

router.put(
  "/:id(\\w{24})/role",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.user.role) {
      const error = {
        error: "Acessible only for admins"
      };
      res.status(403).json(error);
    } else {
      User.getById(req.params.id)
        .then(user => {
          if (user === undefined) {
            const error = new HttpError(404, `User not found`);
            return Promise.reject(error);
          }
          if (!req.body.role) {
            const error = new HttpError(400, `Bad request`);
            return Promise.reject(error);
          }
          user.role = req.body.role;
          return User.update(user);
        })
        .then(() => {
          res.sendStatus(200);
        })
        .catch(err => {
          HttpError.processError(err, res);
        });
    }
  }
);

router.put(
  "/:id(\\w{24})/enable",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.user.role) {
      const error = {
        error: "Accessible only for admins"
      };
      res.status(403).json(error);
    } else {
      User.getById(req.params.id)
        .then(user => {
          if (user === undefined) {
            const error = new HttpError(404, `User not found`);
            return Promise.reject(error);
          }
          if (!req.body.isDisabled) {
            const error = new HttpError(400, `Bad request`);
            return Promise.reject(error);
          }
          user.isDisabled = req.body.isDisabled;
          return User.update(user);
        })
        .then(() => {
          res.sendStatus(200);
        })
        .catch(err => {
          HttpError.processError(err, res);
        });
    }
  }
);

router.put(
  "/:id(\\w{24})/workspace",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.body || !req.body.workspaceId) {
      const json = {
        error: "No body"
      };
      res.status(400).json(json);
      return;
    }
    Workspace.getById(req.body.workspaceId)
      .then(result => {
        for (const admin of result.admins) {
          if (admin.id === req.user.id) {
            return Promise.resolve({});
          }
        }
        const error = new HttpError(404, `User not found`);
        return Promise.reject(error);
      })
      .then(() => {
        return User.getById(req.params.id);
      })
      .then(user => {
        if (user === undefined) {
          const error = new HttpError(404, `User not found`);
          return Promise.reject(error);
        }
        if (user.workspaces === null) {
          user.workspaces = new Array();
        }
        user.workspaces.push(req.body.workspaceId);
        return User.update(user);
      })
      .then(() => {
        res.sendStatus(200);
      })
      .catch(err => {
        HttpError.processError(err, res);
      });
  }
);

router.put(
  "/favorites",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.body || !req.body.workspaceId) {
      const json = {
        error: "No body"
      };
      res.status(400).json(json);
      return;
    }
    for (const workspace of req.user.workspaces) {
      if (workspace.id === req.body.workspaceId) {
        if (req.user.favorites === null) {
          req.user.workspaces = new Array();
        }
        req.user.favorites.push(req.body.workspaceId);
      }
    }
    User.update(req.user)
      .then(() => {
        res.sendStatus(200);
      })
      .catch(err => {
        HttpError.processError(err, res);
      });
  }
);

module.exports = router;
