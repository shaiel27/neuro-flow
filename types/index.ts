export type CognitiveLoad = 'high' | 'medium' | 'low' | 'rest';

export type TaskStatus = 'current' | 'upcoming' | 'completed';

export type ItemType = 'task' | 'finance' | 'income';

// Estados emocionales para gastos conscientes
export type EmotionalState = 'calm' | 'happy' | 'stressed' | 'tired';

// Categorías de gastos
export type ExpenseCategory = 'home' | 'clothing' | 'services' | 'leisure' | 'food' | 'transport' | 'health' | 'other';

// Tipo de gasto: necesidad vs deseo
export type ExpenseType = 'need' | 'want';

// Tipos para ingresos
export type IncomeCategory = 'salary' | 'freelance' | 'investment' | 'business' | 'gift' | 'other';
export type IncomeType = 'regular' | 'bonus' | 'passive';

// Nivel de carga mental financiera
export type FinancialLoad = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  type: 'task';
  title: string;
  time: string;
  duration: number; // in minutes
  cognitiveLoad: CognitiveLoad;
  status: TaskStatus;
  description?: string;
}

export interface FinanceEvent {
  id: string;
  type: 'finance';
  title: string;
  amount: number;
  time: string;
  cognitiveLoad: CognitiveLoad;
  status: TaskStatus;
  category?: 'payment' | 'income' | 'expense';
  description?: string;
}

export type TimelineItem = Task | FinanceEvent;

export interface EnergyLevel {
  current: number; // 0-100
  timestamp: Date;
}

export interface XAIInsight {
  id: string;
  message: string;
  type: 'reschedule' | 'energy' | 'priority' | 'finance';
  timestamp: Date;
}

export interface FinanceMetrics {
  todayExpenses: number;
  remainingBudget: number;
  dailyBudget: number;
  safeToSpend: number;
}

// Nuevos tipos para el módulo Resources
export interface WealthHealth {
  totalBalance: number;
  safeToSpend: number; // Dinero seguro para gastar hoy
  financialLoad: FinancialLoad; // Carga mental financiera
  upcomingPayments: number; // Próximos pagos en 7 días
  monthlyObligations: number; // Obligaciones mensuales fijas
}

export interface MindfulExpense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  emotionalState: EmotionalState;
  expenseType: ExpenseType; // need vs want
  description: string;
  timestamp: Date;
  isRecurring: boolean;
  isEmotionalSpending: boolean; // Flag para gastos emocionales
  impactOnEnergy: number; // Cómo afecta la batería del usuario (-100 a 100)
}

export interface MindfulIncome {
  id: string;
  amount: number;
  category: IncomeCategory;
  type: IncomeType;
  description: string;
  timestamp: Date;
  isRecurring: boolean;
  impactOnEnergy: number; // Cómo afecta positivamente la batería del usuario (0 a 100)
}

export interface StressProjection {
  daily: {
    date: Date;
    expectedExpenses: number;
    stressLevel: FinancialLoad;
  }[];
  weeklyStress: FinancialLoad;
  safeDays: number; // Días seguros sin estrés financiero
}

export interface ResourcesModule {
  wealthHealth: WealthHealth;
  recentExpenses: MindfulExpense[];
  stressProjection: StressProjection;
}

// Nuevos tipos para el módulo Insights
export interface EnergySnapshot {
  id: string;
  currentEnergy: number; // 0-100
  timestamp: Date;
  cognitiveLoad: CognitiveLoad;
  activities: string[];
  mood: EmotionalState;
}

export interface Insight {
  id: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  actionRequired: boolean;
  suggestedAction?: string;
  confidence?: number; // 0-1 para XAI
}

export interface CorrelationData {
  labels: string[];
  datasets: Array<{
    data: number[];
    color: (opacity?: number) => string;
    strokeWidth: number;
  }>;
}

// Tipos para el módulo Profile
export interface UserProfile {
  id: string;
  name: string;
  baseSalary: number;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  antiProductivityMode: boolean;
  notificationsEnabled: boolean;
  darkMode: boolean;
  autoBreaks: boolean;
  breakDuration: number; // minutos
  workingHours: {
    start: string;
    end: string;
  };
}

export interface IAuditLog {
  id: string;
  timestamp: Date;
  decision: string;
  reasoning: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  userAction?: 'accepted' | 'rejected' | 'pending';
}
