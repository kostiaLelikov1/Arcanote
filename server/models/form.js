const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const Component = require("./component");

const Schema = mongoose.Schema;

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  components: [{ type: Schema.Types.ObjectId, ref: "Component" }],
  color: { type: String, default: "white" }
});

const FormModel = mongoose.model("Form", FormSchema);

class Form {
  constructor(id, title, components, color) {
    this.id = id;
    this.title = title;
    this.components = components;
    this.color = color;
  }

  static getById(id) {
    return FormModel.findById(id)
      .populate("components")
      .then(result => {
        if (result) {
          return new Form(
            result.id,
            result.title,
            result.components,
            result.color
          );
        }
        return undefined;
      });
  }

  static insert(x) {
    if (!(x instanceof Form)) {
      return Promise.reject(new Error("Element should be a form"));
    }
    return FormModel.create(x);
  }

  static update(x) {
    if (!(x instanceof Form)) {
      return Promise.reject(new Error("Element should be a form"));
    }
    return FormModel.findByIdAndUpdate(x.id, x, { new: true }).populate(
      "components"
    );
  }

  static delete(id) {
    return FormModel.getById(id)
      .then(form => {
        const components = form.components;
        for (const component of components) {
          Component.delete(component.id);
        }
        return Promise.resolve({});
      })
      .then(() => {
        return FormModel.findByIdAndDelete(id);
      });
  }

  static savePicture(data) {
    if (data === undefined) {
      return Promise.resolve();
    } else {
      return new Promise(function(resolve, reject) {
        cloudinary.v2.uploader
          .upload_stream({ resource_type: "raw" }, function(error, result) {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          })
          .end(data);
      });
    }
  }

  static deleteImage(url) {
    const publicId = url.slice(url.lastIndexOf("/"), url.length);
    return new Promise(function(resolve, reject) {
      cloudinary.v2.uploader.destroy(
        publicId,
        { resource_type: "raw" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
  }
}

module.exports = Form;
