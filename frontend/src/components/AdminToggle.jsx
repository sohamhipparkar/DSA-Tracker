import { useSheetStore } from "../store/useSheetStore";


export default function AdminToggle() {
  const isAdmin = useSheetStore((s) => s.isAdmin);
  const toggleAdminMode = useSheetStore((s) => s.toggleAdminMode);
  
  return (
    <button
      onClick={toggleAdminMode}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition
      ${
        isAdmin
          ? "bg-emerald-500 text-white hover:bg-emerald-600"
          : "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"
      }`}
    >
      {isAdmin ? "Admin Mode ON" : "Enter Admin Mode"}
    </button>
  );
}
