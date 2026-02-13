// import { useState } from "react";
// import axios from "axios";

// interface Props {
//   projectId: number;
//   reload: () => void;
//   refresh: () => void;
// }

// export default function AddExpenseForm({
//   projectId,
//   reload,
//   refresh,
// }: Props) {
//   const [description, setDescription] = useState<string>("");
//   const [amount, setAmount] = useState<string>("");
//   const [category, setCategory] =
//     useState<"material" | "labor" | "other">("material");

//   const handleSubmit = async () => {
//     await axios.post(
//       `http://localhost:5000/api/projects/${projectId}/expenses`,
//       {
//         description,
//         amount: Number(amount),
//         category,
//       }
//     );

//     setDescription("");
//     setAmount("");
//     reload();
//     refresh();
//   };

//   return (
//     <div className="mt-4 bg-gray-50 p-4 rounded-lg">
//       <h3 className="font-semibold mb-2">Add Expense</h3>

//       <div className="grid grid-cols-3 gap-3">
//         <input
//           className="border p-2 rounded"
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />

//         <input
//           type="number"
//           className="border p-2 rounded"
//           placeholder="Amount"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//         />

//         <select
//           className="border p-2 rounded"
//           value={category}
//           onChange={(e) =>
//             setCategory(e.target.value as "material" | "labor" | "other")
//           }
//         >
//           <option value="material">Material</option>
//           <option value="labor">Labor</option>
//           <option value="other">Other</option>
//         </select>
//       </div>

//       <button
//         onClick={handleSubmit}
//         className="mt-3 bg-black text-white px-4 py-2 rounded"
//       >
//         Add Expense
//       </button>
//     </div>
//   );
// }



import { useState } from "react";
import axios from "axios";

interface Props {
  projectId: number;
  reload: () => void;
  refresh: () => void;
}

export default function AddExpenseForm({ projectId, reload, refresh }: Props) {
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<"material" | "labor" | "other">("material");

  // State for error handling
  const [errors, setErrors] = useState<{ description?: string; amount?: string }>({});
  const [apiError, setApiError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Frontend validation function
  const validate = () => {
    const newErrors: { description?: string; amount?: string } = {};

    if (!description.trim()) newErrors.description = "Description is required.";
    if (!amount.trim()) newErrors.amount = "Amount is required.";
    else if (isNaN(Number(amount)) || Number(amount) <= 0)
      newErrors.amount = "Amount must be a positive number.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setApiError("");

    if (!validate()) return; // Stop if validation fails

    setLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/projects/${projectId}/expenses`, {
        description,
        amount: Number(amount),
        category,
      });

      // Reset form
      setDescription("");
      setAmount("");
      setCategory("material");

      // Refresh parent
      reload();
      refresh();
    } catch (err: any) {
      console.error(err);

      // Handle axios errors
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // Server responded with an error
          setApiError(err.response.data.message || "Server Error");
        } else if (err.request) {
          // Request made but no response
          setApiError("No response from server. Please try again later.");
        } else {
          setApiError(err.message);
        }
      } else {
        setApiError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
      <h3 className="font-semibold mb-2 text-black">Add Expense</h3>

      {apiError && <p className="text-red-600 mb-2">{apiError}</p>}

      <div className="grid grid-cols-3 gap-3">
        <div>
          <input
            className={`text-black border p-2 rounded w-full ${errors.description ? "border-red-500" : ""}`}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        <div>
          <input
            type="number"
            className={`text-black border p-2 rounded w-full ${errors.amount ? "border-red-500" : ""}`}
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
        </div>

        <div>
          <select
            className="text-black border p-2 rounded w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value as "material" | "labor" | "other")}
          >
            <option value="material">Material</option>
            <option value="labor">Labor</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className={`mt-3 bg-black text-white px-4 py-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Expense"}
      </button>
    </div>
  );
}

