const User = require("../../src/db/models").User;

module.exports = {

    validateUsers(req, res, next) {
        if(req.method === "POST") {

            req.checkBody("username", "must consist of only letters and numbers").isAlphanumeric();
            req.checkBody("email", "must be valid").isEmail();
            /*req.checkBody("email", "email is already registered to a Blocipedia account").custom((value) => {
                return User.findOne({ where: {email: value} }).then((user) => {
                  if (user) {
                    req.validationErrors().duplicate = true;
                  }
                });
            });*/
            req.checkBody("password", "must be at least 6 characters in length").isLength({min: 6})
            req.checkBody("passwordConfirmation", "must match password provided").optional().matches(req.body.password);
        }

        const errors = req.validationErrors();
        
        if (errors) {
            req.flash("error", errors);
            return res.redirect(req.headers.referer);
        }   else {
            return next();
        }
    },

    validateUserSignIn(req, res, next) {
        if(req.method === "POST") {
            req.checkBody("email", "must be a valid email").isEmail();
            req.checkBody("password", "must be at least 6 characters in length").isLength({min: 6})
        }

        const errors = req.validationErrors();
        
        if (errors) {
            req.flash("error", errors);
            return res.redirect(req.headers.referer);
        }   else {
            return next();
        }
    }
}