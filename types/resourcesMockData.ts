import { 
  Transaction, 
  WealthHealth, 
  StressProjection, 
  MindfulEntry,
  EmotionalState, 
  TransactionCategory, 
  TransactionType,
  FinancialStressLevel 
} from './resources';

/**
 * Datos mock para el módulo Resources
 * Incluye 10 gastos con 3 de impulso realizados en estados de baja energía
 */

// Datos de salud financiera mock
export const mockWealthHealth: WealthHealth = {
  safeToSpend: 245.67,
  totalBalance: 3420.50,
  monthlyObligations: 1850.00,
  financialStressLevel: 'low',
  stressFactors: [
    'Pago de alquiler en 5 días',
    'Suscripción streaming próxima'
  ]
};

// Transacciones mock con 3 gastos de impulso en baja energía
export const mockTransactions: Transaction[] = [
  // Gasto de impulso #1 - Baja energía (cansado)
  {
    id: '1',
    amount: -45.99,
    category: 'food',
    description: 'Pizza delivery medianoche',
    emotionalState: 'tired',
    type: 'want',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // Hace 2 horas
    isRecurring: false,
    isEmotionalSpending: true,
    scheduledInFlow: false
  },
  
  // Gasto normal - Necesidad
  {
    id: '2',
    amount: -120.00,
    category: 'services',
    description: 'Factura electricidad mensual',
    emotionalState: 'neutral',
    type: 'need',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // Hace 6 horas
    isRecurring: true,
    isEmotionalSpending: false,
    scheduledInFlow: true
  },
  
  // Gasto de impulso #2 - Baja energía (estresado)
  {
    id: '3',
    amount: -89.99,
    category: 'leisure',
    description: 'Juego nuevo en Steam',
    emotionalState: 'stressed',
    type: 'want',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Ayer
    isRecurring: false,
    isEmotionalSpending: true,
    scheduledInFlow: false
  },
  
  // Gasto normal - Necesidad recurrente
  {
    id: '4',
    amount: -29.99,
    category: 'services',
    description: 'Netflix mensual',
    emotionalState: 'happy',
    type: 'need',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // Hace 2 días
    isRecurring: true,
    isEmotionalSpending: false,
    scheduledInFlow: true
  },
  
  // Gasto de impulso #3 - Baja energía (cansado)
  {
    id: '5',
    amount: -25.50,
    category: 'food',
    description: 'Café extra y postre',
    emotionalState: 'tired',
    type: 'want',
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000), // Hace 3 días
    isRecurring: false,
    isEmotionalSpending: true,
    scheduledInFlow: false
  },
  
  // Gasto normal - Necesidad
  {
    id: '6',
    amount: -85.00,
    category: 'transport',
    description: 'Gasolina semanal',
    emotionalState: 'neutral',
    type: 'need',
    timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000), // Hace 4 días
    isRecurring: true,
    isEmotionalSpending: false,
    scheduledInFlow: true
  },
  
  // Gasto normal - Deseo consciente
  {
    id: '7',
    amount: -35.00,
    category: 'clothing',
    description: 'Camiseta necesaria',
    emotionalState: 'happy',
    type: 'want',
    timestamp: new Date(Date.now() - 120 * 60 * 60 * 1000), // Hace 5 días
    isRecurring: false,
    isEmotionalSpending: false,
    scheduledInFlow: false
  },
  
  // Gasto normal - Necesidad salud
  {
    id: '8',
    amount: -15.00,
    category: 'health',
    description: 'Medicamentos',
    emotionalState: 'neutral',
    type: 'need',
    timestamp: new Date(Date.now() - 144 * 60 * 60 * 1000), // Hace 6 días
    isRecurring: false,
    isEmotionalSpending: false,
    scheduledInFlow: false
  },
  
  // Gasto normal - Necesidad vivienda
  {
    id: '9',
    amount: -850.00,
    category: 'housing',
    description: 'Alquiler mensual',
    emotionalState: 'neutral',
    type: 'need',
    timestamp: new Date(Date.now() - 168 * 60 * 60 * 1000), // Hace 7 días
    isRecurring: true,
    isEmotionalSpending: false,
    scheduledInFlow: true
  },
  
  // Gasto normal - Comida necesaria
  {
    id: '10',
    amount: -67.89,
    category: 'food',
    description: 'Supermercado semanal',
    emotionalState: 'happy',
    type: 'need',
    timestamp: new Date(Date.now() - 192 * 60 * 60 * 1000), // Hace 8 días
    isRecurring: true,
    isEmotionalSpending: false,
    scheduledInFlow: true
  }
];

// Proyecciones de estrés para 7 días
export const mockStressProjections: StressProjection[] = [
  {
    date: 'Lun 03',
    dayName: 'Lunes',
    fixedExpenses: 45.00,
    projectedBalance: 2875.50,
    stressLevel: 'low',
    factors: ['Gastos bajos', 'Sin pagos grandes']
  },
  {
    date: 'Mar 04',
    dayName: 'Martes',
    fixedExpenses: 120.00,
    projectedBalance: 2755.50,
    stressLevel: 'low',
    factors: ['Factura servicios pagada', 'Balance estable']
  },
  {
    date: 'Mie 05',
    dayName: 'Miércoles',
    fixedExpenses: 85.00,
    projectedBalance: 2670.50,
    stressLevel: 'low',
    factors: ['Transporte normal', 'Sin imprevistos']
  },
  {
    date: 'Jue 06',
    dayName: 'Jueves',
    fixedExpenses: 35.00,
    projectedBalance: 2635.50,
    stressLevel: 'low',
    factors: ['Gastos mínimos', 'Día seguro']
  },
  {
    date: 'Vie 07',
    dayName: 'Viernes',
    fixedExpenses: 29.99,
    projectedBalance: 2605.51,
    stressLevel: 'medium',
    factors: ['Suscripciones acumuladas', 'Fin de semana']
  },
  {
    date: 'Sab 08',
    dayName: 'Sábado',
    fixedExpenses: 25.00,
    projectedBalance: 2580.51,
    stressLevel: 'medium',
    factors: ['Mayor tentación de gastos', 'Fin de semana']
  },
  {
    date: 'Dom 09',
    dayName: 'Domingo',
    fixedExpenses: 15.00,
    projectedBalance: 2565.51,
    stressLevel: 'low',
    factors: ['Día tranquilo', 'Preparación semana']
  }
];

// Entrada consciente mock para pruebas
export const createMockMindfulEntry = (): MindfulEntry => ({
  amount: -25.50,
  category: 'food',
  description: 'Café extra y postre',
  emotionalState: 'tired',
  type: 'want',
  isRecurring: false
});

// Datos de entrada consciente para pruebas
export const mockMindfulEntries: MindfulEntry[] = [
  {
    amount: -45.99,
    category: 'food',
    description: 'Pizza delivery medianoche',
    emotionalState: 'tired',
    type: 'want',
    isRecurring: false
  },
  {
    amount: -89.99,
    category: 'leisure',
    description: 'Juego nuevo en Steam',
    emotionalState: 'stressed',
    type: 'want',
    isRecurring: false
  },
  {
    amount: -25.50,
    category: 'food',
    description: 'Café extra y postre',
    emotionalState: 'tired',
    type: 'want',
    isRecurring: false
  }
];

// Función para generar transacciones aleatorias (para testing)
export const generateRandomTransaction = (): Transaction => {
  const categories: TransactionCategory[] = ['food', 'leisure', 'transport', 'clothing', 'health', 'other'];
  const emotionalStates: EmotionalState[] = ['stressed', 'happy', 'tired', 'neutral'];
  const types: TransactionType[] = ['need', 'want'];
  
  const isImpulse = Math.random() > 0.7; // 30% de probabilidad de impulso
  const emotionalState = isImpulse ? 
    (['stressed', 'tired'][Math.floor(Math.random() * 2)] as EmotionalState) :
    emotionalStates[Math.floor(Math.random() * emotionalStates.length)];
  
  const type = isImpulse ? 'want' : types[Math.floor(Math.random() * types.length)];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    amount: -(Math.random() * 100 + 10),
    category: categories[Math.floor(Math.random() * categories.length)],
    description: `Transacción ${Math.floor(Math.random() * 1000)}`,
    emotionalState,
    type,
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    isRecurring: Math.random() > 0.8,
    isEmotionalSpending: isImpulse,
    scheduledInFlow: Math.random() > 0.6
  };
};

// Función para generar proyecciones personalizadas
export const generateStressProjections = (
  baseBalance: number,
  dailyExpenses: number[]
): StressProjection[] => {
  const days = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
  const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  return days.map((day, index) => {
    const expense = dailyExpenses[index] || 50;
    const balance = baseBalance - dailyExpenses.slice(0, index + 1).reduce((sum, e) => sum + e, 0);
    
    let stressLevel: FinancialStressLevel = 'low';
    if (expense > 100 || balance < 500) stressLevel = 'high';
    else if (expense > 50 || balance < 1000) stressLevel = 'medium';
    
    return {
      date: `${day} ${3 + index}`,
      dayName: dayNames[index],
      fixedExpenses: expense,
      projectedBalance: balance,
      stressLevel,
      factors: stressLevel === 'high' ? ['Gastos elevados', 'Balance bajo'] : 
               stressLevel === 'medium' ? ['Gastos moderados'] : 
               ['Finanzas estables']
    };
  });
};
