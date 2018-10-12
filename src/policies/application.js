const Collaborator = require("../db/models").Collaborator;

module.exports = class ApplicationPolicy {

    constructor(user, record) {
        this.user = user;
        this.record = record;
    }

    _isStandard() {
        return this.user && this.user.role == "standard";
    }

    _isPremium() {
        return this.user && this.user.role === "premium";
    }

    _isOwner() {
        const userId = parseInt(this.user.id);
        return this.record && (this.record.userId === userId);
    }

    _isPublic() {
        return this.record.private === false;
    }

    _isPrivate() {
        return this.record.private === true;
    }

    _isAdmin() {
        return this.user && this.user.role === "admin";
    }

    _isCollaborator() {
        console.log("isCollaborator fired");
        console.log("record: " + this.record.id);
        console.log("user: " + this.user.id);
        return Collaborator.findOne({
            where: {
              userId: this.user.id,
              wikiId: this.record.id
            }
          })
    }

    new() {
        return this.user != null;
    }

    create() {
        return this.new();
    }

    show() {
        return true;
    }

    edit() {
        return this.new();
    }

    update() {
        return this.edit();
    }

    destroy() {
        return this.update();
    }
}