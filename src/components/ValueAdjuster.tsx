interface ValueAdjusterProps {
  id: string;
  title: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  presets: number[];
  className?: string;
}

export default function ValueAdjuster({
  id,
  title,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  presets,
  className = '',
}: ValueAdjusterProps) {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between gap-3">
        {/* Title */}
        <div className="flex items-center gap-1.5">
          <h3 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-widest">
            {title}
          </h3>
        </div>

        {/* Input box */}
        <div className="flex items-center gap-1">
          <input
            id={`input-${id}`}
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) {
                onChange(val);
              } else {
                onChange(0);
              }
            }}
            className="w-14 sm:w-16 text-right bg-white border border-slate-200 focus:border-blue-800 outline-none rounded-lg py-1 px-1.5 text-slate-800 font-mono text-xs font-bold focus:ring-1 focus:ring-blue-800/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 select-none font-bold whitespace-nowrap">
            {unit}
          </span>
        </div>
      </div>

      {/* Slider */}
      <div className="py-0.5">
        <input
          id={`slider-${id}`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1 bg-slate-200 rounded-lg cursor-pointer accent-blue-800 appearance-none border-none outline-none"
        />
        <div className="flex justify-between text-[8px] font-mono text-slate-400 mt-0.5 font-medium">
          <span>{min} {unit}</span>
          <span>{max} {unit}</span>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mt-1 pt-1 border-t border-slate-100 flex flex-wrap items-center gap-1">
        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mr-1">
          Presets:
        </span>
        <div className="flex flex-wrap gap-1">
          {presets.map((preset) => (
            <button
              key={preset}
              id={`preset-${id}-${preset}`}
              onClick={() => onChange(preset)}
              className={`font-mono text-[9px] px-1.5 py-0.5 rounded transition-all duration-150 cursor-pointer border ${
                value === preset
                  ? 'bg-blue-50 text-blue-900 border-blue-800 font-bold shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
