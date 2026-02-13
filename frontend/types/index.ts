export interface Project {
  id: number;
  name: string;
  client_name: string;
  estimated_budget: number;
  total_expenses: number;
  remaining_budget: number;
}

export interface Expense {
  id: number;
  project_id: number;
  description: string;
  amount: number;
  category: "material" | "labor" | "other";
}
