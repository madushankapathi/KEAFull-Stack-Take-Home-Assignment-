const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const expenseController = require("../controllers/expenseController");

router.post("/", projectController.createProject);
router.get("/", projectController.getAllProjects);
router.get("/:id", projectController.getProjectById);

// Add expense to project
router.post("/:projectId/expenses", expenseController.addExpense);

module.exports = router;
