// import { useState } from "react";
// import axios from "axios";

// interface Props {
//   onClose: () => void;
//   refresh: () => void;
// }

// export default function AddProjectModal({ onClose, refresh }: Props) {
//   const [name, setName] = useState<string>("");
//   const [client, setClient] = useState<string>("");
//   const [budget, setBudget] = useState<string>("");

//   const handleSubmit = async () => {
//     await axios.post("http://localhost:5000/api/projects", {
//       name,
//       client_name: client,
//       estimated_budget: Number(budget),
//     });

//     refresh();
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
//       <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
//         <h2 className="text-lg font-semibold mb-4">Add Project</h2>

//         <input
//           className="w-full border p-2 mb-3 rounded"
//           placeholder="Project Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />

//         <input
//           className="w-full border p-2 mb-3 rounded"
//           placeholder="Client Name"
//           value={client}
//           onChange={(e) => setClient(e.target.value)}
//         />

//         <input
//           type="number"
//           className="w-full border p-2 mb-4 rounded"
//           placeholder="Estimated Budget"
//           value={budget}
//           onChange={(e) => setBudget(e.target.value)}
//         />

//         <div className="flex justify-end space-x-3">
//           <button onClick={onClose}>Cancel</button>
//           <button
//             onClick={handleSubmit}
//             className="bg-black text-white px-4 py-2 rounded"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import axios from "axios";

interface Props {
  onClose: () => void;
  refresh: () => void;
}

export default function AddProjectModal({ onClose, refresh }: Props) {
  const [name, setName] = useState<string>("");
  const [client, setClient] = useState<string>("");
  const [budget, setBudget] = useState<string>("");

  // Error and loading states
  const [errors, setErrors] = useState<{ name?: string; client?: string; budget?: string }>({});
  const [apiError, setApiError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Frontend validation
  const validate = () => {
    const newErrors: { name?: string; client?: string; budget?: string } = {};

    if (!name.trim()) newErrors.name = "Project name is required.";
    if (!client.trim()) newErrors.client = "Client name is required.";
    if (!budget.trim()) newErrors.budget = "Estimated budget is required.";
    else if (isNaN(Number(budget)) || Number(budget) <= 0)
      newErrors.budget = "Budget must be a positive number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setApiError("");

    if (!validate()) return; // Stop if validation fails

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/projects", {
        name,
        client_name: client,
        estimated_budget: Number(budget),
      });

      // Reset form
      setName("");
      setClient("");
      setBudget("");

      // Refresh parent & close modal
      refresh();
      onClose();
    } catch (err: any) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        if (err.response) setApiError(err.response.data.message || "Server error");
        else if (err.request) setApiError("No response from server. Try again later.");
        else setApiError(err.message);
      } else {
        setApiError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-black font-semibold mb-4">Add Project</h2>

        {apiError && <p className="text-red-600 mb-2">{apiError}</p>}

        <div className="mb-3">
          <input
            className={`text-black w-full border p-2 rounded ${errors.name ? "border-red-500" : ""}`}
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="mb-3">
          <input
            className={`text-black w-full border p-2 rounded ${errors.client ? "border-red-500" : ""}`}
            placeholder="Client Name"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
          {errors.client && <p className="text-red-500 text-sm">{errors.client}</p>}
        </div>

        <div className="mb-4">
          <input
            type="number"
            className={`text-black w-full border p-2 rounded ${errors.budget ? "border-red-500" : ""}`}
            placeholder="Estimated Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
          {errors.budget && <p className="text-red-500 text-sm">{errors.budget}</p>}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="text-red-500 px-4 py-2 border rounded hover:bg-gray-100"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`bg-black text-white px-4 py-2 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
