import { 
  MindfulExpense, 
  EmotionalState, 
  ExpenseType,
  FinancialLoad,
  ExpenseCategory
} from '../types';

/**
 * Servicios de integración entre módulos Resources y Flow
 * Actúa como Desarrollador Senior con expertise en Psicología del Consumo
 */

export interface CrossModuleImpact {
  energyImpact: number; // -100 a 100
  flowRecommendations: string[];
  batteryWarning: boolean;
  suggestedWorkloadAdjustment: number; // -100 a 100
}

export class ResourcesIntegration {
  /**
   * Calcula el impacto energético de una transacción en el módulo Flow
   * Basado en psicología del consumo y gasto emocional
   */
  static calculateEnergyImpact(
    expense: MindfulExpense,
    currentEnergyLevel: number,
    currentBalance: number
  ): CrossModuleImpact {
    let energyImpact = 0;
    const flowRecommendations: string[] = [];
    let batteryWarning = false;
    let suggestedWorkloadAdjustment = 0;

    // Factor 1: Impacto del monto en la energía
    const amountRatio = Math.abs(expense.amount) / Math.max(currentBalance, 1000);
    if (amountRatio > 0.3) {
      energyImpact -= 30; // Gasto grande reduce energía
      batteryWarning = true;
      suggestedWorkloadAdjustment = -25;
      flowRecommendations.push('Considera reducir carga laboral mañana');
    } else if (amountRatio > 0.1) {
      energyImpact -= 15;
      flowRecommendations.push('Monitorea tu energía hoy');
    }

    // Factor 2: Gasto emocional (psicología del consumo)
    if (expense.isEmotionalSpending) {
      energyImpact -= 25; // Gasto emocional agota más energía
      batteryWarning = true;
      suggestedWorkloadAdjustment = -20;
      flowRecommendations.push('Gasto emocional detectado - prioriza autocuidado');
      flowRecommendations.push('Evita decisiones importantes hoy');
    }

    // Factor 3: Estado emocional general
    switch (expense.emotionalState) {
      case 'stressed':
        energyImpact -= 10;
        flowRecommendations.push('Practica respiración profunda');
        break;
      case 'happy':
        energyImpact += 5;
        flowRecommendations.push('Aprovecha el buen ánimo para tareas creativas');
        break;
      case 'tired':
        energyImpact -= 15;
        suggestedWorkloadAdjustment = -15;
        flowRecommendations.push('Prioriza descanso y tareas simples');
        break;
      case 'calm':
        energyImpact += 3;
        flowRecommendations.push('Mantén la calma y continúa');
        break;
    }

    // Factor 4: Tipo de transacción
    if (expense.expenseType === 'need') {
      energyImpact += 5; // Necesidades básicas dan satisfacción
    } else {
      energyImpact -= 5; // Deseos pueden generar culpa
    }

    // Factor 5: Transacciones recurrentes
    if (expense.isRecurring) {
      energyImpact += 10; // Estabilidad financiera energiza
      flowRecommendations.push('Gasto programado - sin impacto inesperado');
    }

    // Ajuste final basado en energía actual
    if (currentEnergyLevel < 40 && energyImpact < 0) {
      batteryWarning = true;
      suggestedWorkloadAdjustment -= 10;
      flowRecommendations.push('Batería baja - reduce actividades no esenciales');
    }

    return {
      energyImpact: Math.max(-100, Math.min(100, energyImpact)),
      flowRecommendations,
      batteryWarning,
      suggestedWorkloadAdjustment: Math.max(-100, Math.min(100, suggestedWorkloadAdjustment))
    };
  }

  /**
   * Detecta si es un posible gasto emocional basado en patrones psicológicos
   */
  static isEmotionalSpending(
    emotionalState: EmotionalState,
    expenseType: ExpenseType
  ): boolean {
    return emotionalState === 'stressed' && expenseType === 'want';
  }

  /**
   * Calcula la carga mental financiera basada en gastos próximos
   */
  static calculateFinancialLoad(
    upcomingExpenses: number,
    monthlyIncome: number,
    currentBalance: number
  ): FinancialLoad {
    const upcomingRatio = upcomingExpenses / Math.max(monthlyIncome, 1);
    const balanceRatio = currentBalance / Math.max(monthlyIncome, 1);

    if (upcomingRatio > 0.4 || balanceRatio < 0.1) {
      return 'high';
    } else if (upcomingRatio > 0.2 || balanceRatio < 0.3) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Calcula el "Safe-to-Spend" diario
   */
  static calculateSafeToSpend(
    currentBalance: number,
    monthlyObligations: number,
    daysInMonth: number = 30
  ): number {
    const dailyObligations = monthlyObligations / daysInMonth;
    const safeBuffer = currentBalance * 0.1; // 10% de buffer
    const availableForSpending = currentBalance - safeBuffer - (dailyObligations * 7);
    
    return Math.max(0, availableForSpending / 7); // Safe-to-Spend para los próximos 7 días
  }

  /**
   * Genera insights para el módulo Flow basados en actividad financiera
   */
  static generateFlowInsights(
    recentExpenses: MindfulExpense[],
    currentEnergyLevel: number
  ): string[] {
    const insights: string[] = [];
    
    const emotionalSpendingCount = recentExpenses.filter(e => e.isEmotionalSpending).length;
    const totalEmotionalSpending = recentExpenses
      .filter(e => e.isEmotionalSpending)
      .reduce((sum, e) => sum + e.amount, 0);
    
    if (emotionalSpendingCount > 0) {
      insights.push(`Detectados ${emotionalSpendingCount} gastos emocionales recientes`);
      insights.push('Considera pausar decisiones importantes hoy');
    }
    
    if (totalEmotionalSpending > 100) {
      insights.push('Alto gasto emocional detectado - prioriza autocuidado');
    }
    
    const averageExpense = recentExpenses.reduce((sum, e) => sum + e.amount, 0) / Math.max(recentExpenses.length, 1);
    if (averageExpense > 50 && currentEnergyLevel < 50) {
      insights.push('Gastos altos con energía baja - reduce complejidad laboral');
    }
    
    return insights;
  }

  /**
   * Predice riesgo de gasto emocional basado en contexto
   */
  static predictEmotionalSpendingRisk(
    currentEmotionalState: EmotionalState,
    currentEnergyLevel: number,
    recentExpenses: MindfulExpense[]
  ): { risk: 'low' | 'medium' | 'high'; factors: string[] } {
    const factors: string[] = [];
    let riskScore = 0;
    
    // Factor estado emocional
    if (currentEmotionalState === 'stressed') {
      riskScore += 40;
      factors.push('Estado de estrés actual');
    }
    
    // Factor energía baja
    if (currentEnergyLevel < 30) {
      riskScore += 30;
      factors.push('Bajo nivel de energía');
    }
    
    // Factor patrón reciente
    const recentEmotionalSpending = recentExpenses
      .slice(-5)
      .filter(e => e.isEmotionalSpending).length;
    
    if (recentEmotionalSpending >= 2) {
      riskScore += 30;
      factors.push('Patrón reciente de gasto emocional');
    }
    
    // Factor hora del día
    const currentHour = new Date().getHours();
    if (currentHour >= 20 || currentHour <= 6) {
      riskScore += 20;
      factors.push('Horario de riesgo (noche/madrugada)');
    }
    
    const risk = riskScore >= 70 ? 'high' : 
                 riskScore >= 40 ? 'medium' : 'low';
    
    return { risk, factors };
  }
}
