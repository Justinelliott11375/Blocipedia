const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Authorizer = require("../policies/wiki");

module.exports = {

    getAllWikis(callback){
        console.log("getAllWikis called");
        return Wiki.all()
        .then((wikis) => {
            callback(null, wikis);
        })
        .catch((err) => {
            callback(err);
        })
    },

    getWiki(id, callback){

        return Wiki.findById(id)
        .then((wiki) => {
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        })
    },

    addWiki(newWiki, callback){
        
        return Wiki.create({
            title: newWiki.title,
            body: newWiki.body,
            private: newWiki.private,
            userId: newWiki.userId
        })
        .then((wiki) => {
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        })
    },

    updateWiki(req, updatedWiki, callback){
        return Wiki.findById(req.params.id)
        .then((wiki) => {
            if(!wiki){
                return callback("Wiki not found");
            }

            const authorized = new Authorizer(req.user, wiki).update();

            if(authorized) {
   
                wiki.update(updatedWiki, {
                    fields: Object.keys(updatedWiki)
                })
                .then(() => {
                    callback(null, wiki);
                })
                .catch((err) => {
                    callback(err);
                });
            } else {
                req.flash("notice", "You are not authorized to do that.");
                callback(401);
            }
        });
    },

    deleteWiki(req, callback){
        return Wiki.findById(req.params.id)
        .then((wiki) => {

            const authorized = new Authorizer(req.user, wiki).destroy();

            if(authorized) {
                wiki.destroy()
                .then((res) => {
                    callback(null, wiki);
                });
            }
            else {
                req.flash("notice", "You are not authorized to do that.")
                callback(null, wiki);
            }
        })
        .catch((err) => {
            callback(err);
        });
    },

    publicizeAllWikis(id) {
        Wiki.findAll({
            where: { userId: id }
        })
        .then((wikis) => {
            wikis.forEach((wiki) => {
                wiki.update({
                    private: false
                })
            })
        })
    }
}
