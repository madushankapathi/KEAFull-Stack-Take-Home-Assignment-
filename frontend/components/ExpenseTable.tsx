import axios from "axios";
import { useState } from "react";
import { Expense } from "../types";

interface Props {
  expenses: Expense[];
  refresh: () => void;
  reload: () => void;
}

export default function ExpenseTable({
  expenses,
  refresh,
  reload,
}: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Expense>>({});

  const deleteExpense = async (id: number) => {
    await axios.delete(`http://localhost:5000/api/expenses/${id}`);
    refresh();
    reload();
  };

  const updateExpense = async (id: number) => {
    await axios.put(
      `http://localhost:5000/api/expenses/${id}`,
      editData
    );
    setEditingId(null);
    refresh();
    reload();
  };

  return (
    <table className="w-full text-sm mb-4">
      <thead>
        <tr className="border-b">
          <th className="text-black">Description</th>
          <th className="text-black">Amount</th>
          <th className="text-black">Category</th>
          <th className="text-black">Actions</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => (
          <tr key={expense.id} className="border-b">
            <td className="text-black">
              {editingId === expense.id ? (
                <input
                  defaultValue={expense.description}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      description: e.target.value,
                    })
                  }
                />
              ) : (
                expense.description
              )}
            </td>

            <td className="text-black">
              {editingId === expense.id ? (
                <input
                  type="number"
                  defaultValue={expense.amount}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      amount: Number(e.target.value),
                    })
                  }
                />
              ) : (
                `$${expense.amount}`
              )}
            </td>

            <td className="text-black">{expense.category}</td>

            <td className="space-x-2">
              {editingId === expense.id ? (
                <button
                  onClick={() => updateExpense(expense.id)}
                  className="text-green-600"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setEditingId(expense.id)}
                  className="text-blue-600"
                >
                  Edit
                </button>
              )}

              <button
                onClick={() => deleteExpense(expense.id)}
                className="text-red-600"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
