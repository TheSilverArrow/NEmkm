/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Header from './components/Header';
import FormulationButtons from './components/FormulationButtons';
import ValueAdjuster from './components/ValueAdjuster';
import { PRESETS, calculateMkm } from './utils/calculator';

export default function App() {
  // State
  const [selectedFormulationId, setSelectedFormulationId] = useState<string>('8-250');
  const [rateMlHr, setRateMlHr] = useState<number>(20);
  const [weightKg, setWeightKg] = useState<number>(60);
  const [customMg, setCustomMg] = useState<number>(8);
  const [customMl, setCustomMl] = useState<number>(100);

  // Active formulation determination
  const isCustom = selectedFormulationId === 'custom';
  const activePreset = PRESETS.find(p => p.id === selectedFormulationId);
  
  const factor = isCustom 
    ? (customMl > 0 ? (customMg * 1000) / customMl : 0)
    : (activePreset ? activePreset.factor : 0);

  const formulationLabel = isCustom
    ? `${customMg}mg / ${customMl}mL (Custom)`
    : (selectedFormulationId === '8-250' ? '8mg/250mL (or 16mg/500mL)' : (activePreset ? activePreset.name : ''));

  // Calculated MKM
  const mkm = calculateMkm(factor, rateMlHr, weightKg);
  
  // Calculate max infusion rate required to achieve exactly 1.0 mkm
  // 1.0 = (factor * rate) / 60 / weightKg => rate = (60 * weightKg) / factor
  const maxRateFor1Mkm = factor > 0 ? (60 * weightKg) / factor : 0;

  // Presets for controllers
  const ratePresets = [2, 5, 10, 15, 20, 30, 40, 50];
  const weightPresets = [40, 50, 60, 70, 80, 90, 100, 110];

  return (
    <div className="h-screen max-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased overflow-hidden select-none">
      {/* Header */}
      <Header />

      {/* Main Container - Divided into exactly 4 equal vertical sections with gap-2 */}
      <main className="flex-grow h-[calc(100vh-44px)] flex flex-col gap-2 p-2.5 sm:p-3 overflow-hidden max-w-xl mx-auto w-full">
        
        {/* PART 1: Formulation Buttons (1/4 of available height) */}
        <div className="h-1/4 min-h-0 flex flex-col">
          <FormulationButtons
            selectedId={selectedFormulationId}
            onSelectFormulation={setSelectedFormulationId}
            customMg={customMg}
            customMl={customMl}
            onCustomChange={(mg, ml) => {
              setCustomMg(mg);
              setCustomMl(ml);
            }}
            activeFactor={factor}
          />
        </div>

        {/* PART 2: Infusion Rate (1/4 of available height) */}
        <div className="h-1/4 min-h-0 flex flex-col">
          <ValueAdjuster
            id="rate"
            title="2. Infusion Rate"
            value={rateMlHr}
            onChange={setRateMlHr}
            min={0.1}
            max={150}
            step={0.1}
            unit="mL/hr"
            presets={ratePresets}
            className="h-full flex-grow"
          />
        </div>

        {/* PART 3: Patient Weight (1/4 of available height) */}
        <div className="h-1/4 min-h-0 flex flex-col">
          <ValueAdjuster
            id="weight"
            title="3. Patient Weight"
            value={weightKg}
            onChange={setWeightKg}
            min={10}
            max={200}
            step={1}
            unit="kg"
            presets={weightPresets}
            className="h-full flex-grow"
          />
        </div>

        {/* PART 4: Split Outcome Panel (1/4 of available height) */}
        <div className="h-1/4 min-h-0 grid grid-cols-2 gap-2">
          
          {/* Left Split: Calculated Dose (MKM) */}
          <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">
                Dose (mkm)
              </span>
            </div>
            
            <div className="text-center my-auto py-1">
              <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-blue-800">
                {mkm.toFixed(3)}
              </span>
              <span className="text-[10px] font-bold text-slate-400 font-sans tracking-wide ml-1 uppercase">
                mkm
              </span>
            </div>

            <div className="text-[8px] text-center text-slate-400 font-mono tracking-wider truncate border-t border-slate-50 pt-1">
              {formulationLabel}
            </div>
          </div>

          {/* Right Split: Rate for 1.0 mkm */}
          <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">
                  1.0 mkm Rate
                </span>
              </div>
            </div>

            <div className="text-center my-auto py-1 flex flex-col items-center justify-center">
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-800">
                {maxRateFor1Mkm.toFixed(1)}
                <span className="text-[9px] font-normal text-slate-400 uppercase font-sans ml-1">
                  mL/h
                </span>
              </div>
            </div>

            <button
              id="btn-apply-max-rate"
              onClick={() => setRateMlHr(parseFloat(maxRateFor1Mkm.toFixed(1)))}
              disabled={maxRateFor1Mkm <= 0}
              className="w-full bg-blue-800 hover:bg-blue-900 active:scale-95 text-white border border-blue-800 rounded-lg py-1 text-[10px] font-bold transition-all cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed text-center whitespace-nowrap"
            >
              Set Pump to {maxRateFor1Mkm.toFixed(1)}
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}
