const express = require("express");
const Form = require("../models/form.js");
const Workspace = require("../models/workspace.js");
const User = require("../models/user.js");
const passport = require("passport");
const HttpError = require("../modules/http-error.js");

const router = express.Router();

router.get("/", function(req, res) {
  Workspace.getAll()
    .then(workspaces => {
      let result = {};
      if (req.query.search) {
        let searched = new Array();
        for (let index in workspaces) {
          if (workspaces[index].title.includes(req.query.search)) {
            searched.push(workspaces[index]);
          }
        }
        workspaces = searched;
      }
      result["totalQuantity"] = workspaces.length;
      if (req.query.page) {
        let page = parseInt(req.query.page);
        const onPage = 5;
        let allPages = Math.ceil(workspaces.length / onPage);
        if (allPages === 0) {
          allPages = 1;
        }
        if (isNaN(page)) {
          page = 1;
        }
        if (page <= 0 || page > allPages) {
          const error = new HttpError(
            404,
            `No such page, there are only 5 workspaces on each page and there are ${
              workspaces.length
            } workspaces that match your query`
          );
          return Promise.reject(error);
        } else {
          workspaces = workspaces.slice(onPage * (page - 1), onPage * page);
        }
      }
      result["workspaces"] = workspaces;
      res.json(result);
    })
    .catch(err => {
      HttpError.processError(err, res);
    });
});

router.put(
  "/:id(\\w{24})",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Workspace.getById(req.params.id)
      .then(workspace => {
        if (workspace === undefined) {
          const error = new HttpError(404, `Workspace not found`);
          return Promise.reject(error);
        }
        let containsAdmin = false;
        for (const admin of workspace.admins) {
          if (admin.id === req.user.id) {
            containsAdmin = true;
          }
        }
        if (!containsAdmin) {
          const error = new HttpError(403, `Accessible only for admin`);
          return Promise.reject(error);
        }
        if (req.body.title) {
          workspace.title = req.body.title;
        }
        const file = req.files.photoFile;
        if (file === undefined) {
          return Promise.all([Workspace.update(workspace)]);
        } else {
          return Promise.all([Form.savePicture(file.data), workspace]);
        }
      })
      .then(([result, workspace]) => {
        if (result.url !== undefined) {
          workspace.avaUrl = result.url;
          return Workspace.update(workspace);
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
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const file = req.files.photoFile;
    if (file === undefined || file.data === null) {
      const error = {
        error: "Bad file"
      };
      res.status(400).json(error);
    }
    if (!req.body.title) {
      const error = {
        error: "No title"
      };
      res.status(400).json(error);
    } else {
      try {
        const result = await Form.savePicture(file.data);
        if (!result) {
          throw new HttpError(500, "Couldn't save picture");
        }
        if (!req.body.description) {
          req.body.description = null;
        }
        const admins = new Array();
        admins.push(req.user.id);
        const forms = new Array();
        const mainForm = await Form.insert(
          new Form(null, req.body.title, null, undefined)
        );
        forms.push(mainForm.id);
        const workspace = await Workspace.insert(
          new Workspace(
            null,
            req.body.title,
            req.body.description,
            admins,
            forms, //@todo forms
            mainForm,
            result.url
          )
        );
        if (!workspace) {
          throw new HttpError(500, "Internal error");
        }
        return res.json(workspace);
      } catch (e) {
        HttpError.processError(e, res);
      }
    }
  }
);

router.get("/:id(\\w{24})", function(req, res) {
  Workspace.getById(req.params.id)
    .then(workspace => {
      if (workspace === undefined) {
        const error = new HttpError(404, `Workspace not found`);
        return Promise.reject(error);
      }
      res.status(200).json(workspace);
    })
    .catch(err => {
      HttpError.processError(err, res);
    });
});

router.delete(
  "/:id(\\w{24})",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    Workspace.getById(req.params.id)
      .then(workspace => {
        if (workspace === undefined) {
          const error = new HttpError(404, `Workspace not found`);
          return Promise.reject(error);
        }
        let containsAdmin = false;
        for (const admin of workspace.admins) {
          if (admin.id === req.user.id) {
            containsAdmin = true;
          }
        }
        if (!containsAdmin) {
          const error = new HttpError(403, `Accessible only for admin`);
          return Promise.reject(error);
        }
        return Workspace.delete(req.params.id);
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
  "/:id(\\w{24})/form",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const workspace = await Workspace.getById(req.params.id);
      if (workspace === undefined) {
        const error = new HttpError(404, `Workspace not found`);
        return Promise.reject(error);
      }
      let containsAdmin = false;
      for (const admin of workspace.admins) {
        if (admin.id === req.user.id) {
          containsAdmin = true;
        }
      }
      if (!containsAdmin) {
        const error = new HttpError(403, `Accessible only for admin`);
        return Promise.reject(error);
      }
      if (!req.body.title) {
        const error = new HttpError(400, `Form should contain a title`);
        return Promise.reject(error);
      }
      const form = await Form.insert(
        new Form(null, req.body.title, null, undefined)
      );
      workspace.forms.push(form.id);
      const result = await Workspace.update(workspace);
      res.json(result);
    } catch (err) {
      HttpError.processError(err, res);
    }
  }
);

module.exports = router;
