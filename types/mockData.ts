import { Task, FinanceEvent, XAIInsight, EnergyLevel, TimelineItem, FinanceMetrics, WealthHealth, MindfulExpense, StressProjection, FinancialLoad, ExpenseCategory, EmotionalState, ExpenseType } from './index';

export const mockTasks: Task[] = [
  {
    id: '1',
    type: 'task',
    title: 'Revisión de emails prioritarios',
    time: '10:00 AM',
    duration: 30,
    cognitiveLoad: 'medium',
    status: 'current',
    description: 'Revisar y responder emails urgentes'
  },
  {
    id: '2',
    type: 'task',
    title: 'Informe Mensual de Progreso',
    time: '10:45 AM',
    duration: 90,
    cognitiveLoad: 'high',
    status: 'upcoming',
    description: 'Elaborar informe completo del mes'
  },
  {
    id: '3',
    type: 'task',
    title: 'Reset Cognitivo - Pausa Activa',
    time: '12:15 PM',
    duration: 15,
    cognitiveLoad: 'rest',
    status: 'upcoming',
    description: 'Pausa para recargar energía mental'
  },
  {
    id: '4',
    type: 'task',
    title: 'Llamada con equipo de diseño',
    time: '12:45 PM',
    duration: 45,
    cognitiveLoad: 'low',
    status: 'upcoming',
    description: 'Revisión de prototipos y feedback'
  },
  {
    id: '5',
    type: 'task',
    title: 'Desarrollo de nueva funcionalidad',
    time: '2:00 PM',
    duration: 120,
    cognitiveLoad: 'high',
    status: 'upcoming',
    description: 'Implementar componente de finanzas'
  },
  {
    id: '6',
    type: 'task',
    title: 'Meditación guiada',
    time: '4:30 PM',
    duration: 20,
    cognitiveLoad: 'rest',
    status: 'upcoming',
    description: 'Sesión de relajación y mindfulness'
  },
  {
    id: '7',
    type: 'task',
    title: 'Planificación del día siguiente',
    time: '5:00 PM',
    duration: 15,
    cognitiveLoad: 'low',
    status: 'upcoming',
    description: 'Organizar tareas para mañana'
  }
];

export const mockFinanceEvents: FinanceEvent[] = [
  {
    id: 'f1',
    type: 'finance',
    title: 'Pago Netflix',
    amount: -15.99,
    time: '9:00 AM',
    cognitiveLoad: 'low',
    status: 'completed',
    category: 'payment',
    description: 'Suscripción mensual'
  },
  {
    id: 'f2',
    type: 'finance',
    title: 'Supermercado',
    amount: -85.50,
    time: '11:30 AM',
    cognitiveLoad: 'medium',
    status: 'upcoming',
    category: 'expense',
    description: 'Compras semanal'
  },
  {
    id: 'f3',
    type: 'finance',
    title: 'Salario Semanal',
    amount: 350.00,
    time: '9:00 AM',
    cognitiveLoad: 'low',
    status: 'completed',
    category: 'income',
    description: 'Depósito semanal de trabajo freelance'
  }
];

// Timeline combinado de tareas y eventos financieros
export const mockTimeline: TimelineItem[] = [
  ...mockTasks,
  ...mockFinanceEvents
].sort((a, b) => {
  // Ordenar por tiempo
  const timeA = new Date(`2024-01-01 ${a.time}`);
  const timeB = new Date(`2024-01-01 ${b.time}`);
  return timeA.getTime() - timeB.getTime();
});

export const mockEnergyLevel: EnergyLevel = {
  current: 75,
  timestamp: new Date()
};

export const mockXAIInsight: XAIInsight = {
  id: '1',
  message: 'He movido "Informe Mensual" a mañana porque tu energía bajó al 40%. Tu productividad es mayor en las mañanas.',
  type: 'reschedule',
  timestamp: new Date()
};

export const mockFinanceMetrics: FinanceMetrics = {
  todayExpenses: 85.50,
  remainingBudget: 164.50,
  dailyBudget: 250.00,
  safeToSpend: 120.00
};

// Datos para BalanceWidget
export interface DayData {
  day: string;
  completed: boolean;
  energyLevel: number;
  balanceScore: number;
}

export const mockWeeklyData: DayData[] = [
  { day: 'Lun', completed: true, energyLevel: 65, balanceScore: 85 },
  { day: 'Mar', completed: true, energyLevel: 70, balanceScore: 90 },
  { day: 'Mié', completed: false, energyLevel: 30, balanceScore: 40 }, // Día de recuperación
  { day: 'Jue', completed: true, energyLevel: 80, balanceScore: 95 },
  { day: 'Vie', completed: true, energyLevel: 75, balanceScore: 88 },
  { day: 'Sáb', completed: true, energyLevel: 85, balanceScore: 92 },
  { day: 'Dom', completed: false, energyLevel: 0, balanceScore: 0 }, // Día en curso
];

export const mockBalanceData = {
  currentStreak: 4,
  weeklyData: mockWeeklyData,
  balanceStatus: 'optimal' as const,
  energyVsFinanceData: [
    { energy: 65, finance: 70 },
    { energy: 70, finance: 85 },
    { energy: 30, finance: 60 },
    { energy: 80, finance: 90 },
    { energy: 75, finance: 75 },
    { energy: 85, finance: 80 },
  ],
  xaiMessage: 'Tu racha de 4 días se mantiene porque hoy priorizaste el descanso tras tu gasto de energía matutino.'
};

// Nuevos datos mock para el módulo Resources

export const mockWealthHealth: WealthHealth = {
  totalBalance: 2850.75,
  safeToSpend: 125.50,
  financialLoad: 'medium',
  upcomingPayments: 245.80,
  monthlyObligations: 1200.00
};

export const mockMindfulExpenses: MindfulExpense[] = [
  // Gasto emocional de impulso #1
  {
    id: 'exp1',
    amount: 89.99,
    category: 'leisure',
    emotionalState: 'stressed',
    expenseType: 'want',
    description: 'Videojuego en oferta - compra impulsiva',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // Hace 2 horas
    isRecurring: false,
    isEmotionalSpending: true,
    impactOnEnergy: -35
  },
  // Gasto emocional de impulso #2
  {
    id: 'exp2',
    amount: 45.00,
    category: 'food',
    emotionalState: 'tired',
    expenseType: 'want',
    description: 'Delivery comida rápida por cansancio',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // Hace 5 horas
    isRecurring: false,
    isEmotionalSpending: true,
    impactOnEnergy: -20
  },
  // Gasto emocional de impulso #3
  {
    id: 'exp3',
    amount: 120.00,
    category: 'clothing',
    emotionalState: 'stressed',
    expenseType: 'want',
    description: 'Zapatillas nuevas - compra por estrés laboral',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Ayer
    isRecurring: false,
    isEmotionalSpending: true,
    impactOnEnergy: -40
  },
  // Gastos conscientes
  {
    id: 'exp4',
    amount: 15.99,
    category: 'services',
    emotionalState: 'calm',
    expenseType: 'need',
    description: 'Suscripción Netflix',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Hace 3 días
    isRecurring: true,
    isEmotionalSpending: false,
    impactOnEnergy: 5
  },
  {
    id: 'exp5',
    amount: 85.50,
    category: 'food',
    emotionalState: 'happy',
    expenseType: 'need',
    description: 'Compras semanal supermercado',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // Hace 4 días
    isRecurring: false,
    isEmotionalSpending: false,
    impactOnEnergy: 10
  },
  {
    id: 'exp6',
    amount: 25.00,
    category: 'transport',
    emotionalState: 'calm',
    expenseType: 'need',
    description: 'Recarga tarjeta transporte',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Hace 5 días
    isRecurring: true,
    isEmotionalSpending: false,
    impactOnEnergy: 8
  },
  {
    id: 'exp7',
    amount: 35.00,
    category: 'health',
    emotionalState: 'tired',
    expenseType: 'need',
    description: 'Medicamentos farmacia',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // Hace 6 días
    isRecurring: false,
    isEmotionalSpending: false,
    impactOnEnergy: -5
  },
  {
    id: 'exp8',
    amount: 12.50,
    category: 'other',
    emotionalState: 'happy',
    expenseType: 'want',
    description: 'Café con amigos',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Hace 7 días
    isRecurring: false,
    isEmotionalSpending: false,
    impactOnEnergy: 15
  },
  {
    id: 'exp9',
    amount: 150.00,
    category: 'home',
    emotionalState: 'calm',
    expenseType: 'need',
    description: 'Limpieza y mantenimiento',
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // Hace 8 días
    isRecurring: true,
    isEmotionalSpending: false,
    impactOnEnergy: 12
  },
  {
    id: 'exp10',
    amount: 28.00,
    category: 'leisure',
    emotionalState: 'tired',
    expenseType: 'want',
    description: 'Cine para relajarse',
    timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // Hace 9 días
    isRecurring: false,
    isEmotionalSpending: false,
    impactOnEnergy: 0
  }
];

export const mockStressProjection: StressProjection = {
  daily: [
    {
      date: new Date(),
      expectedExpenses: 25.00,
      stressLevel: 'low'
    },
    {
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      expectedExpenses: 45.50,
      stressLevel: 'low'
    },
    {
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      expectedExpenses: 120.00,
      stressLevel: 'medium'
    },
    {
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      expectedExpenses: 15.99,
      stressLevel: 'low'
    },
    {
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      expectedExpenses: 85.00,
      stressLevel: 'medium'
    },
    {
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      expectedExpenses: 0,
      stressLevel: 'low'
    },
    {
      date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      expectedExpenses: 200.00,
      stressLevel: 'high'
    }
  ],
  weeklyStress: 'medium',
  safeDays: 4
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
};
