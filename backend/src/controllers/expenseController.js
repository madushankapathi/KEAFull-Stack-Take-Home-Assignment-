const pool = require("../db");

/**
 * Add Expense
 */
exports.addExpense = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { description, amount, category } = req.body;

    if (!description || amount == null || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (amount < 0) {
      return res.status(400).json({ error: "Amount must be positive" });
    }

    const result = await pool.query(
      `INSERT INTO expenses (project_id, description, amount, category)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [projectId, description, amount, category]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update Expense
 */
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, category } = req.body;

    const existing = await pool.query(
      "SELECT * FROM expenses WHERE id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    const current = existing.rows[0];

    const updatedDescription =
      description !== undefined ? description : current.description;

    const updatedAmount =
      amount !== undefined ? amount : current.amount;

    const updatedCategory =
      category !== undefined ? category : current.category;

    const result = await pool.query(
      `UPDATE expenses
       SET description = $1,
           amount = $2,
           category = $3,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [updatedDescription, updatedAmount, updatedCategory, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error); // <-- important for debugging
    res.status(500).json({ error: "Server error" });
  }
};


/**
 * Delete Expense
 */
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query(
      "SELECT * FROM expenses WHERE id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    await pool.query("DELETE FROM expenses WHERE id = $1", [id]);

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
