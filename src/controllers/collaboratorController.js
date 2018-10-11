const User = require("../db/models").User;
const Wiki = require("../db/models").Wiki;
const Collaborator = require("../db/models").Collaborator;
const collaboratorQueries = require("../db/queries.collaborators.js");
const Authorizer = require("../policies/collaborator");

module.exports = {
  new(req, res, next) {
      console.log("collabcont new: " + req.params);
    User.findAll()
    .then((users) => {
      Wiki.findOne({
        where: { id: req.params.id }
      })
      .then((wiki) => {
        Collaborator.findAll({
          where: { wikiId: wiki.id }
        })
        .then((collaborators) => {
          const authorized = new Authorizer(req.user).new();

          if (authorized) {
          res.render("collaborators/edit", {users, wiki, collaborators});
          } else {
            req.flash("notice", "You are not authorized to do that");
            res.redirect("/wikis");
          };
        })
      })
    })
  },

  create(req, res, next) {
      console.log("create called from controller");
      console.log(req.body.username);
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then((user) => {
        console.log("userFindBy: " + user);
      let newCollaborator = {
        username: user.username,
        email: user.email,
        wikiId: req.params.id,
        userId: user.id
      };

      collaboratorQueries.addCollaborator(newCollaborator, (err, collaborator) => {
            console.log("addCollab called from controller");
        if (err) {
            console.log("add collab if");
            console.log(err);
            req.flash("notice", "That user is already an authorized collaborator for this wiki");
            res.redirect(`/wikis/${req.params.id}/collaborators`);
        } else {
            console.log("add collab else");
            req.flash("notice", "Collaborator successfully added.");
            res.redirect(`/wikis/${req.params.id}/collaborators`);
        }
      });
    });
  },

  destroy(req, res, next) {
      console.log("destroyCollab called");
    Collaborator.findById(req.body.collabToDelete)
    .then((collaborator) => {
      collaboratorQueries.deleteCollaborator(collaborator, (err, collaborator) => {
        if (err) {
          res.redirect(500, `/wikis/${req.params.id}/new`);
        } else {
          req.flash("notice", "Collaborator deleted!");
          res.redirect(`/wikis/${req.params.id}/collaborators`);
        }
      });
    });
  },
}