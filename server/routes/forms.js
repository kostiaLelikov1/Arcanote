const express = require("express");
const Form = require("../models/form.js");
const Component = require("../models/component.js");
const passport = require("passport");
const HttpError = require("../modules/http-error.js");

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (!req.body.title) {
      const error = {
        error: "No title"
      };
      res.status(400).json(error);
    } else {
      try {
        const form = await Form.insert(
          new Form(null, req.body.title, null, undefined)
        );
        if (!form) {
          throw new HttpError(500, "Internal error");
        }
        return res.json(form);
      } catch (e) {
        HttpError.processError(e, res);
      }
    }
  }
);

router.put(
  "/:id(\\w{24})/component",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (!req.body.title) {
      const error = {
        error: "No title"
      };
      res.status(400).json(error);
    } else {
      try {
        if (!Component.TYPES.some(x => req.body.type === x)) {
          throw new HttpError(400, "Type not found");
        } else if (!req.body.cords.x || !req.body.cords.y) {
          throw new HttpError(400, "Cords not found");
        } else if (!req.size.width || !req.size.height) {
          throw new HttpError(400, "Size not found");
        } else if (!req.content) {
          throw new HttpError(400, "Content not found");
        } else if (!req.reference) {
          throw new HttpError(400, "Reference not found");
        } else if (!req.settings.color) {
          throw new HttpError(400, "Color not found");
        }
        const component = await Component.Component.insert(
          new Component.Component(
            null,
            req.body.type,
            req.body.cords,
            req.body.size,
            req.body.content,
            req.body.reference,
            req.body.settings
          )
        );
        if (!component) {
          throw new HttpError(500, "Internal error");
        }
        const form = await Form.getById(req.params.id);
        if (!form) {
          throw new HttpError(404, "Form not found");
        }
        if (Array.isArray(form.components)) {
          form.components.push(component);
        } else {
          form.components = [component];
        }
        await Form.update(form);
        return res.json(component);
      } catch (e) {
        HttpError.processError(e, res);
      }
    }
  }
);

router.delete(
  "/:id(\\w{24})/component/:id_com(\\w{24})",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const form = await Form.getById(req.params.id);
      const component = await Component.Component.getById(req.params.id_com);
      if (!form || !component) {
        throw new HttpError(404, `not found`);
      }
      form.components = form.components.filter(x => x.id !== component.id);
      await Component.Component.delete(component.id);
      await Form.update(form);
    } catch (e) {
      HttpError.processError(e, res);
    }
  }
);

router.get("/:id(\\w{24})", function(req, res) {
  Form.getById(req.params.id)
    .then(form => {
      if (form === undefined) {
        const error = new HttpError(404, `Form not found`);
        return Promise.reject(error);
      }
      res.status(200).json(form);
    })
    .catch(err => {
      HttpError.processError(err, res);
    });
});

router.delete("/:id(\\w{24})", function(req, res) {
  Form.getById(req.params.id)
    .then(form => {
      if (form === undefined) {
        const error = new HttpError(404, `Form not found`);
        return Promise.reject(error);
      }
      const arrPromices = [];
      for (const component of form.components) {
        arrPromices.push(Component.Component.delete(component).exec());
      }
      return Promise.all([form, Promise.all(arrPromices)]);
    })
    .then(([form]) => {
      return Form.delete(form.id);
    })
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      HttpError.processError(err, res);
    });
});

module.exports = router;
