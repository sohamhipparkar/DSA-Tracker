import { useState, useRef, useEffect } from "react";
import { useSheetStore } from "../store/useSheetStore";


export default function AddTopic() {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRef = useRef(null);
  const isAdmin = useSheetStore((s) => s.isAdmin);


  const addTopic = useSheetStore((s) => s.addTopic);

  // autofocus when component loads
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAdd = () => {
    const clean = title.trim();

    // validation
    if (!clean) {
      setError("Topic name can't be empty");
      return;
    }

    if (clean.length < 2) {
      setError("Topic name is too short");
      return;
    }

    // add topic
    addTopic(clean);

    // reset UI
    setTitle("");
    setError("");
    setSuccess(true);

    // remove success message after 1.5s
    setTimeout(() => setSuccess(false), 1500);

    // focus back
    inputRef.current?.focus();
  };

  // handle enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  if (!isAdmin) return null;

return (
  <div className="mb-8">

      {/* Label */}
      <label className="block mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
        Create a new study topic
      </label>

      <div className="flex gap-3">
        {/* Input */}
        <input
          ref={inputRef}
          className={`flex-1 p-3 rounded-xl border transition
          bg-white dark:bg-slate-800
          text-slate-800 dark:text-slate-100
          placeholder:text-slate-400 dark:placeholder:text-slate-500
          ${
            error
              ? "border-red-400 focus:ring-red-400 dark:border-red-500"
              : "border-slate-300 dark:border-slate-600 focus:ring-blue-400"
          }
          focus:outline-none focus:ring-2`}
          placeholder="Example: Arrays, Linked List, Recursion..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          aria-label="Topic name"
        />

        {/* Button */}
        <button
          onClick={handleAdd}
          disabled={!title.trim()}
          className={`px-5 py-3 rounded-xl text-white font-medium transition
          ${
            title.trim()
              ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 active:scale-95"
              : "bg-blue-300 dark:bg-slate-700 cursor-not-allowed"
          }`}
        >
          Add
        </button>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm mt-2 animate-pulse">
          {error}
        </p>
      )}

      {/* Success message */}
      {success && (
        <p className="text-green-600 dark:text-green-400 text-sm mt-2">
          ✓ Topic added successfully!
        </p>
      )}
    </div>
  );
}
