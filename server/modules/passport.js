const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user.js");
const sha512 = require("js-sha512");
const UserModel = require("../models/user");

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      session: false
    },
    (username, password, done) => {
      User.getByLogin(username)
        .then(user => {
          if (!user) {
            return Promise.reject(new Error("No such user"));
          }
          const userPassword = user.password;
          if (userPassword.toUpperCase() === sha512(password).toUpperCase()) {
            done(null, user);
          } else {
            return Promise.reject(new Error("Passwords are not equal"));
          }
        })
        .catch(error => {
          console.log(error);
          done(false, null);
        });
    }
  )
);

const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "Super-secret"
    },
    function(jwtPayload, cb) {
      return UserModel.getById(jwtPayload.id)
        .then(user => cb(null, user))
        .catch(() => cb(false));
    }
  )
);
