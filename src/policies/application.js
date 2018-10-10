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