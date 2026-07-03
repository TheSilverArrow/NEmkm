export default function Header() {
  return (
    <nav className="bg-white text-slate-800 px-4 py-2 sticky top-0 z-50 shadow-sm border-b border-slate-200">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <h1 className="text-sm font-extrabold tracking-tight text-blue-900 flex items-center gap-1.5">
          <span>Norepinephrine MKM Calculator</span>
        </h1>
        <span className="text-[9px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 font-bold">
          v1.2.0
        </span>
      </div>
    </nav>
  );
}
