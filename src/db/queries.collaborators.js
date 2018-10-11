const Collaborator = require("./models").Collaborator;

module.exports = {
  addCollaborator(newCollaborator, callback) {
      console.log("addCollab called");
    Collaborator.findOne({
      where: {
        userId: newCollaborator.userId,
        wikiId: newCollaborator.wikiId
      }
    })
    .then((collaborator) => {
      if (!collaborator) {
        return Collaborator.create({
            username: newCollaborator.username,
            wikiId: newCollaborator.wikiId,
            userId: newCollaborator.userId
        })
        .then((collaborator) => {
          callback(null, collaborator);
        })
        .catch((err) => {
          callback(err);
        });
      } else {
        return callback("User is already a collaborator for this wiki.");
      }
    });
  },

  deleteCollaborator(collabToDelete, callback) {
    return Collaborator.findById(collabToDelete.id)
    .then((collaborator) => {
      collaborator.destroy()
      .then((res) => {
        callback(null, collaborator);
      })
      .catch((err) => {
        callback(err);
      });
    });
  },
}