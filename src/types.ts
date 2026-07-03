export interface Formulation {
  id: string;
  name: string;
  doseMg: number; // Norepinephrine dose in mg (e.g., 8)
  volumeMl: number; // Diluent volume in mL (e.g., 250)
  factor: number; // Concentration in mcg/mL (e.g., 32)
  isCustom?: boolean;
}

export interface CalculatorState {
  selectedFormulationId: string;
  rateMlHr: number;
  weightKg: number;
  customDoseMg: number;
  customVolumeMl: number;
}

export interface DoseInfo {
  mkmPrecise: number;
  mkmRounded: string;
  mkmTruncated: string;
  category: 'low' | 'medium' | 'high' | 'critical' | 'none';
  categoryLabel: string;
  categoryColor: string;
  textColor: string;
  bgColor: string;
}
