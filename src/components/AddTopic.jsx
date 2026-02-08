import { useState, useRef, useEffect } from "react";
import { useSheetStore } from "../store/useSheetStore";

export default function AddTopic() {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRef = useRef(null);

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

  return (
    <div className="mb-8">
      <label className="block mb-2 text-sm font-medium text-slate-700">
        Create a new study topic
      </label>

      <div className="flex gap-3">
        <input
          ref={inputRef}
          className={`flex-1 p-3 rounded-xl border transition
          ${
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-slate-300 focus:ring-blue-400"
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

        <button
          onClick={handleAdd}
          disabled={!title.trim()}
          className={`px-5 py-3 rounded-xl text-white font-medium transition
          ${
            title.trim()
              ? "bg-blue-600 hover:bg-blue-700 active:scale-95"
              : "bg-blue-300 cursor-not-allowed"
          }`}
        >
          Add
        </button>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-sm mt-2 animate-pulse">
          {error}
        </p>
      )}

      {/* Success message */}
      {success && (
        <p className="text-green-600 text-sm mt-2">
          ✓ Topic added successfully!
        </p>
      )}
    </div>
  );
}
