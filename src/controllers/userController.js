const userQueries = require("../db/queries.users.js")
const passport = require("passport");
const User = require("../db/models").User;
const publicKey = "pk_test_qpRslJfT2QYfpT6it4gHu1ox";
const secretKey = "sk_test_C2J9qnd7WoAEhCyYA3Zlne37";
var stripe = require("stripe")(secretKey);

module.exports = {
    signUp(req, res, next){
        res.render("users/sign_up");
    },
    create(req, res, next) {
        let newUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation,
            role: req.body.role
        };

        userQueries.createUser(newUser, (err, user) => {
            if(err) {
                res.redirect("/users/sign_up");
            } else {
                passport.authenticate("local")(req, res, () => {
                    req.flash("notice", "You've successfully signed in!");
                    res.redirect("/");
                })
            }
        });
    },

    signInForm(req, res, next) {
        res.render("users/sign_in");
    },

    signIn(req, res, next) {
;        passport.authenticate("local")(req, res, function() {
            if(!req.user){
                console.log("error")
                req.flash("notice", "Sign in failed. Please try again.")
                res.redirect("/users/sign_in");
            } else {
                console.log("success");
                req.flash("notice", "You've successfully signed in!");
                res.redirect("/");
            }
        })
    },

    signOut(req, res, next) {
        req.logout();
        req.flash("notice", "You've successfully signed out!");
        res.redirect("/");
    },
    
    show(req, res, next){

        userQueries.getUser(req.params.id, (err, result) => {
            console.log("getUser fired");
            if(err || result.user === undefined){
                req.flash("notice", "No user found with that ID.");
                res.redirect("/");
            } else {
             res.render("users/show", {...result});
            }
        });
    },

    upgradeForm(req, res, next) {
		res.render("users/upgrade", { publicKey });
    },
    
    upgrade(req, res, next) {
        const email = req.body.stripeEmail;
        const token = req.body.stripeToken;
        console.log("token: " + token);
        console.log(publicKey);
        console.log(secretKey);
        stripe.customers.create({
			email: email,
            source: token,
        })
        .then((customer) => {
            console.log(customer);
            stripe.charges.create({
                amount: 1500,
                description:  "Premium Membership Fee",
                currency: "usd",
                customer: customer.id,
            });
        })
        .then((charge) => {
            console.log("charge");
            console.log(charge);
            if (charge) {
                let action = "upgrade";
                userQueries.updateUserRole(user, action);
                req.flash("notice", "Upgrade successful!");
                res.render("static/index");
              } else {
                req.flash("notice", "Error upgrading, please try again");
                res.redirect("/users/upgrade");
              }
        });
    }
}