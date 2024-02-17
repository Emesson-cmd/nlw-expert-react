export default function SearchNotes() {
  return (
    <form className="w-full">
      <input
        className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
        type="text"
        placeholder="Busce em suas notas..."
      />
    </form>
  );
}
