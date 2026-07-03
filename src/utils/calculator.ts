import { Formulation, DoseInfo } from '../types';

export const PRESETS: Formulation[] = [
  {
    id: '8-250',
    name: '8 mg in 250 mL',
    doseMg: 8,
    volumeMl: 250,
    factor: 32, // (8 * 1000) / 250 = 32
  },
  {
    id: '16-250',
    name: '16 mg in 250 mL',
    doseMg: 16,
    volumeMl: 250,
    factor: 64, // (16 * 1000) / 250 = 64
  },
  {
    id: '4-250',
    name: '4 mg in 250 mL',
    doseMg: 4,
    volumeMl: 250,
    factor: 16, // (4 * 1000) / 250 = 16
  },
  {
    id: '8-100',
    name: '8 mg in 100 mL',
    doseMg: 8,
    volumeMl: 100,
    factor: 80, // (8 * 1000) / 100 = 80
  },
  {
    id: '16-100',
    name: '16 mg in 100 mL',
    doseMg: 16,
    volumeMl: 100,
    factor: 160, // (16 * 1000) / 100 = 160
  },
];

/**
 * Calculates concentration factor (mcg/mL)
 */
export function calculateFactor(doseMg: number, volumeMl: number): number {
  if (volumeMl <= 0) return 0;
  return (doseMg * 1000) / volumeMl;
}

/**
 * Calculates mkm (mcg/kg/min)
 */
export function calculateMkm(factor: number, rateMlHr: number, weightKg: number): number {
  if (weightKg <= 0 || factor <= 0) return 0;
  return (factor * rateMlHr) / 60 / weightKg;
}

/**
 * Calculates rate (mL/hr) from target mkm (mcg/kg/min)
 */
export function calculateRateFromMkm(factor: number, targetMkm: number, weightKg: number): number {
  if (factor <= 0 || weightKg <= 0) return 0;
  return (targetMkm * 60 * weightKg) / factor;
}

/**
 * Categorizes the Norepinephrine dosage (mcg/kg/min) for safety guide
 */
export function getDoseInfo(mkm: number): DoseInfo {
  if (mkm <= 0) {
    return {
      mkmPrecise: 0,
      mkmRounded: '0.00',
      mkmTruncated: '0.00',
      category: 'none',
      categoryLabel: 'No Infusion',
      categoryColor: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
      textColor: 'text-zinc-400',
      bgColor: 'bg-zinc-950/40',
    };
  }

  // To display rounded vs truncated, we calculate both
  // Rounded: e.g. 0.0888 -> 0.09
  // Truncated / Floored to 2 decimal places: e.g. 0.0888 -> 0.08 (as in user example "32 x 10 / 60 / 60 = 0.08 mkm")
  const roundedStr = mkm.toFixed(2);
  
  // Floor or truncate to 2 decimal places:
  const truncatedVal = Math.floor(mkm * 100) / 100;
  const truncatedStr = truncatedVal.toFixed(2);

  let category: DoseInfo['category'] = 'low';
  let categoryLabel = 'Low Dose';
  let categoryColor = 'bg-teal-500/10 text-teal-400 border-teal-500/30';
  let textColor = 'text-teal-400';
  let bgColor = 'bg-teal-950/30';

  if (mkm < 0.05) {
    category = 'low';
    categoryLabel = 'Low Dose (Weaning / Early Support)';
    categoryColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    textColor = 'text-emerald-400';
    bgColor = 'bg-emerald-950/30';
  } else if (mkm < 0.20) {
    category = 'medium';
    categoryLabel = 'Medium Dose (Standard Active Support)';
    categoryColor = 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    textColor = 'text-sky-400';
    bgColor = 'bg-sky-950/30';
  } else if (mkm < 0.50) {
    category = 'high';
    categoryLabel = 'High Dose (Significant Shock / High Support)';
    categoryColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    textColor = 'text-amber-400';
    bgColor = 'bg-amber-950/30';
  } else {
    category = 'critical';
    categoryLabel = 'Critical High Dose (Requires Urgent Re-evaluation)';
    categoryColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    textColor = 'text-rose-400';
    bgColor = 'bg-rose-950/30';
  }

  return {
    mkmPrecise: mkm,
    mkmRounded: roundedStr,
    mkmTruncated: truncatedStr,
    category,
    categoryLabel,
    categoryColor,
    textColor,
    bgColor,
  };
}
