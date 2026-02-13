import { useState } from "react";
import axios from "axios";
import { Project, Expense } from "../types";
import ExpenseTable from "./ExpenseTable";
import AddExpenseForm from "./AddExpenseForm";

interface Props {
  project: Project;
  refresh: () => void;
}

export default function ProjectCard({ project, refresh }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchDetails = async () => {
    const res = await axios.get<{
      project: Project;
      expenses: Expense[];
    }>(`http://localhost:5000/api/projects/${project.id}`);

    setExpenses(res.data.expenses);
  };

  const toggle = async () => {
    if (!open) await fetchDetails();
    setOpen(!open);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-blue-600  font-semibold">{project.name}</h2>
          <p className="text-black">
            Client: {project.client_name}
          </p>
        </div>

        <button onClick={toggle} className="text-blue-600">
          {open ? "Hide ▲" : "Expand ▼"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
        <div>
          <p className="text-gray-500">Budget</p>
          <p className="font-semibold text-black">${project.estimated_budget}</p>
        </div>
        <div>
          <p className="text-gray-500">Expenses</p>
          <p className="font-semibold text-red-500">
            ${project.total_expenses}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Remaining</p>
          <p className="font-semibold text-green-600">
            ${project.remaining_budget}
          </p>
        </div>
      </div>

      {open && (
        <div className="mt-6 border-t pt-4">
          <ExpenseTable
            expenses={expenses}
            refresh={refresh}
            reload={fetchDetails}
          />
          <AddExpenseForm
            projectId={project.id}
            reload={fetchDetails}
            refresh={refresh}
          />
        </div>
      )}
    </div>
  );
}
