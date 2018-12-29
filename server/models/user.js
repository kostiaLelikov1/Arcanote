const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  role: { type: Number, required: true },
  name: { type: String, required: true },
  surname: { type: String },
  registeredAt: { type: Date, default: Date.now() },
  avaUrl: {
    type: String,
    default:
      "https://res.cloudinary.com/streamline-scrum/image/upload/v1543008477/default_user.png"
  },
  isDisabled: { type: Boolean, required: true },
  workspaces: [{ type: Schema.Types.ObjectId, ref: "Workspace" }],
  favorites: [{ type: Schema.Types.ObjectId, ref: "Workspace" }],
  password: { type: String, required: true }
});

const UserModel = mongoose.model("User", UserSchema);

class User {
  constructor(
    id,
    login,
    role,
    name,
    surname,
    registeredAt,
    avaUrl,
    isDisabled,
    workspaces,
    favorites,
    password
  ) {
    this.id = id;
    (this.login = login), (this.role = role);
    this.name = name;
    this.surname = surname;
    this.registeredAt = registeredAt;
    this.avaUrl = avaUrl;
    this.isDisabled = isDisabled;
    this.workspaces = workspaces;
    this.favorites = favorites;
    this.password = password;
  }

  static getAll() {
    return UserModel.find()
      .populate("workspaces")
      .populate("favorites")
      .then(result => {
        let users = new Array();
        if (!Array.isArray(result)) {
          return new Error("No users in DB");
        }
        for (const value of result) {
          users.push(
            new User(
              value.id,
              value.login,
              value.role,
              value.name,
              value.surname,
              value.registeredAt,
              value.avaUrl,
              value.isDisabled,
              value.workspaces,
              value.favorites,
              value.password
            )
          );
        }
        return users;
      });
  }

  static getById(id) {
    return UserModel.findById(id)
      .populate(["workspaces", "favorites"]) // tak krashche
      .then(result => {
        if (result) {
          return new User(
            result.id,
            result.login,
            result.role,
            result.name,
            result.surname,
            result.registeredAt,
            result.avaUrl,
            result.bio,
            result.isDisabled,
            result.workspaces,
            result.favorites,
            result.password
          );
        }
        return undefined;
      });
  }

  static update(x) {
    if (!(x instanceof User)) {
      return Promise.reject(new Error("Element should be a User"));
    }
    return UserModel.findByIdAndUpdate(x.id, x, { new: true }).populate(
      "workspaces"
    );
  }

  static getByWorkspace(id) {
    return UserModel.find({ workspaces: id })
      .populate("workspaces")
      .populate("favorites")
      .then(result => {
        let users = new Array();
        for (const value of result) {
          users.push(
            new User(
              value.id,
              value.login,
              value.role,
              value.name,
              value.surname,
              value.registeredAt,
              value.avaUrl,
              value.isDisabled,
              value.workspaces,
              value.favorites,
              value.password
            )
          );
        }
        return users;
      });
  }

  static getByLogin(login) {
    return UserModel.findOne({ login: login })
      .populate("workspaces")
      .populate("favorites")
      .then(result => {
        if (result) {
          return new User(
            result.id,
            result.login,
            result.role,
            result.name,
            result.surname,
            result.registeredAt,
            result.avaUrl,
            result.isDisabled,
            result.workspaces,
            result.favorites,
            result.password
          );
        }
        return undefined;
      });
  }

  static insert(x) {
    if (!(x instanceof User)) {
      return Promise.reject(new Error("Element should be a user"));
    }
    return UserModel.create(x);
  }
}

module.exports = User;
