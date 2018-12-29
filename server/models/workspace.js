// @ts-check а похуй ну если вдруг гвно не заметил дескрипшн воркспейса забыл ebatt ui last ochka tut??? следуй за мно й
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Form = require("./form");

const WorkspaceSchema = new mongoose.Schema({
  admins: [{ type: Schema.Types.ObjectId, ref: "User" }],
  title: { type: String, required: true },
  description: { type: String },
  avaUrl: {
    type: String,
    required: true
  },
  forms: [{ type: Schema.Types.ObjectId, ref: "Form" }],
  mainForm: { type: Schema.Types.ObjectId, ref: "Form" }
});

const WorkspaceModel = mongoose.model("Workspace", WorkspaceSchema);

class Workspace {
  constructor(id, title, description, admins, forms, mainForm, avaUrl) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.admins = admins;
    this.forms = forms;
    this.mainForm = mainForm;
    this.avaUrl = avaUrl;
  }

  static getAll() {
    return WorkspaceModel.find()
      .populate(["forms", "mainForm", "admins"])
      .then(result => {
        let workspaces = new Array();
        if (!Array.isArray(result)) {
          return new Error("No workspaces in DB");
        }
        for (const value of result) {
          workspaces.push(
            new Workspace(
              value.id,
              value.title,
              value.description,
              value.admins,
              value.forms,
              value.mainForm,
              value.avaUrl
            )
          );
        }
        return workspaces;
      });
  }

  static getById(id) {
    return WorkspaceModel.findById(id)
      .populate(["forms", "mainForm", "admins"])
      .then(result => {
        if (result) {
          return new Workspace(
            result.id,
            result.title,
            result.description,
            result.admins,
            result.forms,
            result.mainForm,
            result.avaUrl
          );
        }
        return undefined;
      });
  }

  static update(x) {
    if (!(x instanceof Workspace)) {
      return Promise.reject(new Error("Element should be a workspace"));
    }
    return WorkspaceModel.findByIdAndUpdate(x.id, x, { new: true }).populate(
      "workspaces"
    );
  }

  static insert(x) {
    if (!(x instanceof Workspace)) {
      return Promise.reject(new Error("Element should be a workspace"));
    }
    return WorkspaceModel.create(x);
  }

  static delete(id) {
    return WorkspaceModel.findById(id)
      .then(workspace => {
        const forms = workspace.forms;
        for (const form of forms) {
          Form.delete(form.id);
        }
        return Promise.resolve({});
      })
      .then(() => {
        return WorkspaceModel.findByIdAndDelete(id);
      });
  }
}

module.exports = Workspace;
