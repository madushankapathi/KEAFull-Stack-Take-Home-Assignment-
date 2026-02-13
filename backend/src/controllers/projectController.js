const pool = require("../db");

/**
 * Create Project
 */
exports.createProject = async (req, res) => {
  try {
    const { name, client_name, estimated_budget } = req.body;

    if (!name || !client_name || estimated_budget == null) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (estimated_budget < 0) {
      return res.status(400).json({ error: "Budget must be positive" });
    }

    const result = await pool.query(
      `INSERT INTO projects (name, client_name, estimated_budget)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, client_name, estimated_budget]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get All Projects with Budget Summary
 */
exports.getAllProjects = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.client_name,
        p.estimated_budget,
        COALESCE(SUM(e.amount), 0) AS total_expenses,
        p.estimated_budget - COALESCE(SUM(e.amount), 0) AS remaining_budget
      FROM projects p
      LEFT JOIN expenses e ON p.id = e.project_id
      GROUP BY p.id
      ORDER BY p.id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get Single Project with Expenses
 */
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await pool.query(
      "SELECT * FROM projects WHERE id = $1",
      [id]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const expenses = await pool.query(
      "SELECT * FROM expenses WHERE project_id = $1 ORDER BY id DESC",
      [id]
    );

    res.json({
      project: project.rows[0],
      expenses: expenses.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
