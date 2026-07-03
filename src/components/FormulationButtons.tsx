interface FormulationButtonsProps {
  selectedId: string;
  onSelectFormulation: (id: string) => void;
  customMg: number;
  customMl: number;
  onCustomChange: (mg: number, ml: number) => void;
  activeFactor: number;
}

export default function FormulationButtons({
  selectedId,
  onSelectFormulation,
  customMg,
  customMl,
  onCustomChange,
  activeFactor,
}: FormulationButtonsProps) {
  // Hardcoded 3 standard presets we support + the 4th custom option
  const items = [
    { id: '8-250', label: '8mg / 250mL', isOr: true, subLabel: '16mg / 500mL', factor: 32 },
    { id: '16-250', label: '16mg / 250mL', isOr: false, factor: 64 },
    { id: '4-250', label: '4mg / 250mL', isOr: false, factor: 16 },
    { id: 'custom', label: 'Custom Mix', isOr: false, isCustom: true },
  ];

  return (
    <div className="flex-grow min-h-0 bg-white border border-slate-200 rounded-xl p-2 md:p-2.5 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center gap-1.5 mb-1">
        <h2 className="font-sans font-bold text-[9px] text-slate-400 uppercase tracking-widest">
          1. Select Formulation
        </h2>
      </div>

      {/* Grid of easy-to-press buttons: 2x2 */}
      <div className="grid grid-cols-2 gap-1.5 flex-grow">
        {items.map((item) => {
          const isActive = selectedId === item.id;
          return (
            <button
              key={item.id}
              id={`preset-btn-${item.id}`}
              onClick={() => onSelectFormulation(item.id)}
              className={`relative overflow-hidden text-left px-2 py-1 rounded-lg border transition-all duration-150 cursor-pointer flex items-center justify-between gap-1 h-full ${
                isActive
                  ? 'bg-blue-50/80 border-2 border-blue-800 shadow-sm text-slate-800'
                  : 'bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-500 hover:text-slate-700'
              }`}
            >
              {item.isOr ? (
                <div className="flex flex-col justify-center leading-none py-0.5">
                  <span className={`font-bold text-[10px] sm:text-[11px] leading-tight ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>
                    8mg / 250mL
                  </span>
                  <span className="text-[7px] font-bold text-slate-400 my-[1px] leading-none text-center">
                    OR
                  </span>
                  <span className={`font-bold text-[10px] sm:text-[11px] leading-tight ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>
                    16mg / 500mL
                  </span>
                </div>
              ) : (
                <div className={`font-bold text-[11px] sm:text-xs block font-sans tracking-tight ${
                  isActive ? 'text-blue-900' : 'text-slate-700'
                }`}>
                  {item.label}
                </div>
              )}
              
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[7px] font-mono uppercase tracking-wider text-slate-400 hidden xs:inline">
                  F
                </span>
                <span className={`font-mono text-[9px] font-bold px-1 rounded ${
                  isActive ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.isCustom ? (isActive ? activeFactor.toFixed(1) : 'Var') : item.factor}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom bar: either standard Active Factor or Custom Mix input */}
      {selectedId === 'custom' ? (
        <div className="mt-1.5 bg-blue-50/50 rounded-lg p-1 border border-blue-200 flex items-center justify-between gap-1">
          <span className="text-[8px] font-bold text-blue-900 uppercase tracking-wider shrink-0 ml-1">
            Custom:
          </span>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              <input
                id="custom-mg-input"
                type="number"
                value={customMg || ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onCustomChange(val || 0, customMl);
                }}
                className="w-8 text-center bg-white border border-slate-200 rounded py-0.5 text-slate-800 font-mono text-[9px] font-bold focus:border-blue-800 outline-none"
              />
              <span className="text-[7px] font-mono text-slate-500">mg</span>
            </div>
            <span className="text-[8px] font-bold text-slate-400">/</span>
            <div className="flex items-center gap-0.5">
              <input
                id="custom-ml-input"
                type="number"
                value={customMl || ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onCustomChange(customMg, val || 0);
                }}
                className="w-10 text-center bg-white border border-slate-200 rounded py-0.5 text-slate-800 font-mono text-[9px] font-bold focus:border-blue-800 outline-none"
              />
              <span className="text-[7px] font-mono text-slate-500">mL</span>
            </div>
          </div>
          <div className="flex items-baseline gap-0.5 shrink-0 bg-blue-100/50 px-1 py-0.5 rounded border border-blue-200 mr-1">
            <span className="text-[9px] font-mono font-black text-blue-900">
              {activeFactor.toFixed(1)}
            </span>
            <span className="text-[6px] font-mono text-blue-700 uppercase font-bold">F</span>
          </div>
        </div>
      ) : (
        <div className="mt-1.5 bg-slate-50 rounded-lg p-1 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1 ml-1">
            <div className="w-1 h-1 rounded-full bg-blue-800 animate-pulse" />
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">
              Factor:
            </span>
          </div>
          <div className="flex items-baseline gap-0.5 mr-1">
            <span className="text-xs font-black font-mono text-blue-800 tracking-tight">
              {activeFactor % 1 === 0 ? activeFactor : activeFactor.toFixed(1)}
            </span>
            <span className="text-[7px] font-mono text-slate-400 uppercase font-bold">
              mcg/mL
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
