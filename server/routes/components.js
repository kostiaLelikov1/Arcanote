const express = require("express");
const Form = require("../models/form.js");
const Component = require("../models/component.js");
const User = require("../models/user.js");
const passport = require("passport");
const HttpError = require("../modules/http-error.js");

const router = express.Router();

router.put(
  "/:id(\\w{24})",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (
      !req.body ||
      !req.body.cords ||
      !req.body.size ||
      !req.body.content ||
      !req.body.type ||
      !req.body.settings
    ) {
      const error = {
        error: "Smth is missing"
      };
      res.status(400).json(error);
    } else {
      try {
        const component = await Component.Component.getById(req.params.id);
        if (!component) {
          throw new HttpError(404, "No component found");
        }
        if (req.body.type === "BUTTON") {
          component.reference = req.body.reference;
        }
        component.cords = req.body.cords;
        component.size = req.body.size;
        component.content = req.body.content;
        component.settings = req.body.settings;
        return Component.Component.update(component);
      } catch (e) {
        HttpError.processError(e, res);
      }
    }
  }
);

router.get("/:id(\\w{24})", function(req, res) {
  Component.getById(req.params.id)
    .then(component => {
      if (component === undefined) {
        const error = new HttpError(404, `Form not found`);
        return Promise.reject(error);
      }
      res.status(200).json(component);
    })
    .catch(err => {
      HttpError.processError(err, res);
    });
});

// function arrayRemove(arr, value) {
//   return arr.filter(function(ele) {
//     return ele.toString() !== value.toString();
//   });
// }

module.exports = router;
