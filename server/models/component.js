const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TYPES = ["BUTTON", "LABEL", "IMAGE", "LIST", "TITLE"];

const ComponentSchema = new mongoose.Schema({
  type: { type: String, enum: TYPES, required: true },
  cords: {
    x: {
      type: Number
    },
    y: {
      type: Number
    }
  },
  size: {
    width: {
      type: Number
    },
    height: {
      type: Number
    }
  },
  content: { type: String },
  reference: { type: Schema.Types.ObjectId, ref: "Form" },
  settings: {
    color: {
      type: String,
      default: "white"
    }
  }
});

const ComponentModel = mongoose.model("Component", ComponentSchema);

class Component {
  constructor(id, type, cords, size, content, reference, settings) {
    this.id = id;
    this.type = type;
    this.cords = cords;
    this.size = size;
    this.content = content;
    this.reference = reference;
    this.settings = settings;
  }

  static getById(id) {
    return ComponentModel.findById(id).then(result => {
      if (result) {
        return new Component(
          result.id,
          result.type,
          result.cords,
          result.size,
          result.content,
          result.reference,
          result.settings
        );
      }
      return undefined;
    });
  }

  static insert(x) {
    if (!(x instanceof Component)) {
      return Promise.reject(new Error("Element should be a component"));
    }
    return ComponentModel.create(x);
  }

  static update(x) {
    if (!(x instanceof Component)) {
      return Promise.reject(new Error("Element should be a component"));
    }
    return ComponentModel.findByIdAndUpdate(x.id, x, { new: true });
  }

  static delete(id) {
    // @todo delete cloudinary if image
    return ComponentModel.findByIdAndDelete(id);
  }
}

module.exports = { Component, TYPES };
