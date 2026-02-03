import { MindfulExpense, EmotionalState, ExpenseType } from '../types';

/**
 * Servicios de integración entre energía y finanzas
 * Actúa como Desarrollador Senior con expertise en Psicología del Consumo
 */

export interface CrossModuleImpact {
  energyImpact: number; // -100 a 100
  flowRecommendations: string[];
  batteryWarning: boolean;
  suggestedWorkloadAdjustment: number; // -100 a 100
  stressLevel: 'low' | 'medium' | 'high';
}

export class EnergyFinanceIntegration {
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
    let stressLevel: 'low' | 'medium' | 'high' = 'low';

    // Factor 1: Impacto del monto en la energía
    const amountRatio = Math.abs(expense.amount) / Math.max(currentBalance, 1000);
    if (amountRatio > 0.3) {
      energyImpact -= 30; // Gasto grande reduce energía
      batteryWarning = true;
      suggestedWorkloadAdjustment = -25;
      stressLevel = 'high';
      flowRecommendations.push('Considera reducir carga laboral mañana');
      flowRecommendations.push('Prioriza tareas simples y descanso');
    } else if (amountRatio > 0.1) {
      energyImpact -= 15;
      suggestedWorkloadAdjustment = -10;
      stressLevel = 'medium';
      flowRecommendations.push('Monitorea tu energía hoy');
    }

    // Factor 2: Gasto emocional (psicología del consumo)
    if (expense.isEmotionalSpending) {
      energyImpact -= 25; // Gasto emocional agota más energía
      batteryWarning = true;
      suggestedWorkloadAdjustment -= 20;
      stressLevel = 'high';
      flowRecommendations.push('⚠️ Gasto emocional detectado - prioriza autocuidado');
      flowRecommendations.push('Evita decisiones importantes hoy');
      flowRecommendations.push('Practica respiración profunda y meditación');
    }

    // Factor 3: Estado emocional general
    switch (expense.emotionalState) {
      case 'stressed':
        energyImpact -= 10;
        flowRecommendations.push('Practica técnicas de relajación');
        if (stressLevel === 'low') stressLevel = 'medium';
        break;
      case 'happy':
        energyImpact += 5;
        flowRecommendations.push('Aprovecha el buen ánimo para tareas creativas');
        break;
      case 'tired':
        energyImpact -= 15;
        suggestedWorkloadAdjustment -= 15;
        if (stressLevel === 'low') stressLevel = 'medium';
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
      if (stressLevel === 'high') stressLevel = 'medium';
    }

    // Ajuste final basado en energía actual
    if (currentEnergyLevel < 40 && energyImpact < 0) {
      batteryWarning = true;
      suggestedWorkloadAdjustment -= 10;
      if (stressLevel !== 'high') stressLevel = 'high';
      flowRecommendations.push('Batería baja - reduce actividades no esenciales');
    }

    return {
      energyImpact: Math.max(-100, Math.min(100, energyImpact)),
      flowRecommendations,
      batteryWarning,
      suggestedWorkloadAdjustment: Math.max(-100, Math.min(100, suggestedWorkloadAdjustment)),
      stressLevel
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
   * Genera insights para el módulo Flow basados en actividad financiera reciente
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

    // Análisis de patrones por estado emocional
    const stressedExpenses = recentExpenses.filter(e => e.emotionalState === 'stressed');
    if (stressedExpenses.length >= 2) {
      insights.push('Patrón de estrés financiero detectado - considera pausar compras');
    }

    return insights;
  }

  /**
   * Calcula el nivel de estrés financiero basado en gastos próximos
   */
  static calculateFinancialStress(
    upcomingExpenses: number,
    monthlyIncome: number,
    currentBalance: number
  ): 'low' | 'medium' | 'high' {
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
   * Predice riesgo de gasto emocional basado en contexto
   */
  static predictEmotionalSpendingRisk(
    currentEmotionalState: EmotionalState,
    currentEnergyLevel: number,
    recentExpenses: MindfulExpense[]
  ): { risk: 'low' | 'medium' | 'high'; factors: string[]; recommendations: string[] } {
    const factors: string[] = [];
    const recommendations: string[] = [];
    let riskScore = 0;
    
    // Factor estado emocional
    if (currentEmotionalState === 'stressed') {
      riskScore += 40;
      factors.push('Estado de estrés actual');
      recommendations.push('Espera 24h antes de decisiones importantes');
    }
    
    // Factor energía baja
    if (currentEnergyLevel < 30) {
      riskScore += 30;
      factors.push('Bajo nivel de energía');
      recommendations.push('Descansa antes de tomar decisiones financieras');
    }
    
    // Factor patrón reciente
    const recentEmotionalSpending = recentExpenses
      .slice(-5)
      .filter(e => e.isEmotionalSpending).length;
    
    if (recentEmotionalSpending >= 2) {
      riskScore += 30;
      factors.push('Patrón reciente de gasto emocional');
      recommendations.push('Considera establecer un límite de gastos diario');
    }
    
    // Factor hora del día
    const currentHour = new Date().getHours();
    if (currentHour >= 20 || currentHour <= 6) {
      riskScore += 20;
      factors.push('Horario de riesgo (noche/madrugada)');
      recommendations.push('Duerme sobre decisiones grandes');
    }
    
    const risk = riskScore >= 70 ? 'high' : 
                 riskScore >= 40 ? 'medium' : 'low';
    
    return { risk, factors, recommendations };
  }

  /**
   * Calcula el "Safe-to-Spend" diario (dinero seguro para gastar)
   */
  static calculateSafeToSpend(
    currentBalance: number,
    monthlyObligations: number,
    daysInMonth: number = 30
  ): number {
    const dailyObligations = monthlyObligations / daysInMonth;
    const safeBuffer = currentBalance * 0.1; // 10% de buffer de seguridad
    const availableForSpending = currentBalance - safeBuffer - (dailyObligations * 7);
    
    return Math.max(0, availableForSpending / 7); // Safe-to-Spend para los próximos 7 días
  }

  /**
   * Genera recomendaciones personalizadas basadas en patrón de gastos
   */
  static generatePersonalizedRecommendations(
    expenses: MindfulExpense[],
    currentEnergyLevel: number
  ): string[] {
    const recommendations: string[] = [];
    
    // Análisis de gastos por estado emocional
    const emotionalBreakdown = expenses.reduce((acc, expense) => {
      acc[expense.emotionalState] = (acc[expense.emotionalState] || 0) + 1;
      return acc;
    }, {} as Record<EmotionalState, number>);
    
    if (emotionalBreakdown.stressed >= 3) {
      recommendations.push('🧘 Considera practicar mindfulness antes de compras cuando estés estresado');
      recommendations.push('📅 Establece un "día sin compras" semanal');
    }
    
    if (emotionalBreakdown.tired >= 2) {
      recommendations.push('😴 El cansancio afecta tus decisiones - descansa antes de comprar');
      recommendations.push('⏰ Programa compras importantes para momentos de alta energía');
    }
    
    // Análisis de gastos por tipo
    const wantsVsNeeds = expenses.reduce((acc, expense) => {
      if (expense.expenseType === 'want') {
        acc.wants += expense.amount;
      } else {
        acc.needs += expense.amount;
      }
      return acc;
    }, { wants: 0, needs: 0 });
    
    if (wantsVsNeeds.wants > wantsVsNeeds.needs * 0.5) {
      recommendations.push('💰 Tu ratio deseos/necesidades es alta - considera un presupuesto');
      recommendations.push('🎯 Establece metas de ahorro para deseos específicos');
    }
    
    // Recomendaciones basadas en energía
    if (currentEnergyLevel < 40) {
      recommendations.push('🔋 Batería baja - enfócate en necesidades básicas solo');
      recommendations.push('🛡️ Protégete de decisiones impulsivas hasta recargar energía');
    }
    
    return recommendations;
  }
}
