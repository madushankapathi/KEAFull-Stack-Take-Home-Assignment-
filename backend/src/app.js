const express = require("express");
const cors = require("cors");

const projectRoutes = require("./routes/projectRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/projects", projectRoutes);
app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => {
  res.send("Projects & Expenses API Running");
});

module.exports = app;
