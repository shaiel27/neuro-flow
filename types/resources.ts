// Estados emocionales para el registro consciente
export type EmotionalState = 'stressed' | 'happy' | 'tired' | 'neutral';

// Tipos de transacciones
export type TransactionType = 'need' | 'want';

// Categorías de transacciones
export type TransactionCategory = 'housing' | 'clothing' | 'services' | 'leisure' | 'food' | 'transport' | 'health' | 'other';

// Niveles de estrés financiero
export type FinancialStressLevel = 'low' | 'medium' | 'high';

// Estructura de una transacción
export interface Transaction {
  id: string;
  amount: number; // positivo para ingresos, negativo para gastos
  category: TransactionCategory;
  description: string;
  emotionalState: EmotionalState;
  type: TransactionType;
  timestamp: Date;
  isRecurring: boolean;
  isEmotionalSpending?: boolean;
  scheduledInFlow?: boolean;
}

// Estructura de salud financiera
export interface WealthHealth {
  safeToSpend: number;
  totalBalance: number;
  monthlyObligations: number;
  financialStressLevel: FinancialStressLevel;
  stressFactors: string[];
}

// Estructura de entrada consciente
export interface MindfulEntry {
  amount: number;
  category: TransactionCategory;
  description: string;
  emotionalState: EmotionalState;
  type: TransactionType;
  isRecurring: boolean;
}

// Estructura de proyección de estrés
export interface StressProjection {
  date: string;
  dayName: string;
  fixedExpenses: number;
  projectedBalance: number;
  stressLevel: FinancialStressLevel;
  factors: string[];
}

// Estructura de impacto cruzado entre módulos
export interface CrossModuleImpact {
  energyImpact: number; // -100 a 100
  flowRecommendations: string[];
  batteryWarning: boolean;
  suggestedWorkloadAdjustment: number; // -100% a 100%
}

// Estructura de análisis de patrones emocionales
export interface EmotionalSpendingPattern {
  emotionalState: EmotionalState;
  totalSpent: number;
  transactionCount: number;
  averageAmount: number;
  isImpulseBuying: boolean;
  timeOfDay: string;
}

// Estructura de métricas de bienestar financiero
export interface FinancialWellnessMetrics {
  overallScore: number; // 0-100
  emotionalSpendingRatio: number; // 0-1
  recurringExpenseRatio: number; // 0-1
  savingsRate: number; // 0-1
  stressTrend: 'improving' | 'stable' | 'declining';
  monthlyChange: number;
}
