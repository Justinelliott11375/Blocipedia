const express = require("express");
const router = express.Router();
const collaboratorController = require("../controllers/collaboratorController");

router.get("/wikis/:id/collaborators", collaboratorController.new);
router.post("/wikis/:id/collaborators/create", collaboratorController.create);
router.post("/wikis/:id/collaborators/destroy", collaboratorController.destroy);

module.exports = router;