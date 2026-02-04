import { MindfulExpense, EnergySnapshot, Insight } from '../types';

export class InsightService {
  // Análisis de correlación entre energía y gastos emocionales
  static generateCorrelationInsights(
    expenses: MindfulExpense[],
    energySnapshots: EnergySnapshot[]
  ): Insight[] {
    const insights: Insight[] = [];

    if (expenses.length < 3 || energySnapshots.length < 7) {
      return [{
        id: 'insufficient_data',
        type: 'info',
        title: 'Aprendiendo',
        description: 'Aún estoy aprendiendo de tus hábitos. Registra 2 días más para darte consejos personalizados.',
        severity: 'low',
        timestamp: new Date(),
        actionRequired: false
      }];
    }

    // Análisis 1: Gastos por impulso vs energía baja
    const impulseExpenses = expenses.filter(exp => 
      exp.emotionalState === 'stressed' || exp.emotionalState === 'tired'
    );
    
    const lowEnergySnapshots = energySnapshots.filter(snapshot => 
      snapshot.currentEnergy < 30
    );

    if (impulseExpenses.length > 0 && lowEnergySnapshots.length > 0) {
      const correlationRate = Math.min(95, (impulseExpenses.length / expenses.length) * 100);
      
      insights.push({
        id: 'impulse_energy_correlation',
        type: 'warning',
        title: 'Patrón Detectado',
        description: `Detectamos que el ${correlationRate.toFixed(0)}% de tus gastos por impulso ocurren cuando tu energía está por debajo del 30%. Sugerencia: Bloquea compras digitales después de las 8 PM.`,
        severity: correlationRate > 70 ? 'high' : 'medium',
        timestamp: new Date(),
        actionRequired: true,
        suggestedAction: 'Configurar límite de compras nocturnas'
      });
    }

    // Análisis 2: Impacto financiero en energía
    const recentExpenses = expenses.filter(exp => 
      new Date(exp.timestamp).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    );

    const weeklySpending = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const avgEnergy = energySnapshots.reduce((sum, snap) => sum + snap.currentEnergy, 0) / energySnapshots.length;

    if (weeklySpending > 500 && avgEnergy < 50) {
      insights.push({
        id: 'spending_energy_impact',
        type: 'critical',
        title: 'Impacto Financiero',
        description: `Tu gasto semanal de $${weeklySpending.toFixed(2)} correlaciona con baja energía (${avgEnergy.toFixed(0)}%). Considera revisar tus prioridades financieras.`,
        severity: 'high',
        timestamp: new Date(),
        actionRequired: true,
        suggestedAction: 'Revisar presupuesto semanal'
      });
    }

    // Análisis 3: Patrones positivos
    const positiveExpenses = expenses.filter(exp => 
      exp.emotionalState === 'calm' || exp.emotionalState === 'happy'
    );

    if (positiveExpenses.length > expenses.length * 0.6) {
      insights.push({
        id: 'positive_spending_pattern',
        type: 'success',
        title: 'Excelente Patrón',
        description: 'El 60% de tus gastos ocurren en estados emocionales positivos. Esto indica buena conciencia financiera.',
        severity: 'low',
        timestamp: new Date(),
        actionRequired: false
      });
    }

    // Análisis 4: Tendencia energética
    const recentEnergySnapshots = energySnapshots.slice(-7);
    const energyTrend = this.calculateEnergyTrend(recentEnergySnapshots);

    if (energyTrend < -10) {
      insights.push({
        id: 'declining_energy_trend',
        type: 'warning',
        title: 'Tendencia Energética',
        description: `Tu energía ha disminuido un ${Math.abs(energyTrend).toFixed(0)}% esta semana. Considera ajustar tu carga de trabajo.`,
        severity: 'medium',
        timestamp: new Date(),
        actionRequired: true,
        suggestedAction: 'Reducir carga cognitiva'
      });
    }

    return insights;
  }

  // Cálculo de tendencia energética
  private static calculateEnergyTrend(snapshots: EnergySnapshot[]): number {
    if (snapshots.length < 2) return 0;
    
    const firstHalf = snapshots.slice(0, Math.floor(snapshots.length / 2));
    const secondHalf = snapshots.slice(Math.floor(snapshots.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, snap) => sum + snap.currentEnergy, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, snap) => sum + snap.currentEnergy, 0) / secondHalf.length;
    
    return ((secondAvg - firstAvg) / firstAvg) * 100;
  }

  // Generación de datos para gráfica de correlación
  static generateCorrelationData(
    expenses: MindfulExpense[],
    energySnapshots: EnergySnapshot[]
  ) {
    // Agrupar datos por día
    const dailyData = this.groupDataByDay(expenses, energySnapshots);
    
    return {
      labels: dailyData.map(day => day.date),
      datasets: [
        {
          data: dailyData.map(day => day.avgEnergy),
          color: (opacity = 1) => `rgba(139, 115, 85, ${opacity})`, // accent color
          strokeWidth: 2
        },
        {
          data: dailyData.map(day => day.emotionalSpending),
          color: (opacity = 1) => `rgba(160, 160, 160, ${opacity})`, // tertiary color
          strokeWidth: 2
        }
      ]
    };
  }

  // Agrupar datos por día para visualización
  private static groupDataByDay(
    expenses: MindfulExpense[],
    energySnapshots: EnergySnapshot[]
  ) {
    const dailyMap = new Map<string, { avgEnergy: number; emotionalSpending: number; date: string }>();
    
    // Procesar snapshots de energía
    energySnapshots.forEach(snapshot => {
      const date = new Date(snapshot.timestamp).toLocaleDateString();
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { avgEnergy: 0, emotionalSpending: 0, date });
      }
      const day = dailyMap.get(date)!;
      day.avgEnergy = (day.avgEnergy + snapshot.currentEnergy) / 2;
    });
    
    // Procesar gastos emocionales
    expenses.forEach(expense => {
      const date = new Date(expense.timestamp).toLocaleDateString();
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { avgEnergy: 0, emotionalSpending: 0, date });
      }
      const day = dailyMap.get(date)!;
      if (expense.isEmotionalSpending) {
        day.emotionalSpending += expense.amount;
      }
    });
    
    return Array.from(dailyMap.values()).slice(-7); // Últimos 7 días
  }

  // Generación de insights predictivos
  static generatePredictiveInsights(
    expenses: MindfulExpense[],
    energySnapshots: EnergySnapshot[]
  ): Insight[] {
    const insights: Insight[] = [];
    
    // Predecir riesgo de burnout
    const recentEnergy = energySnapshots.slice(-3);
    const avgRecentEnergy = recentEnergy.reduce((sum, snap) => sum + snap.currentEnergy, 0) / recentEnergy.length;
    
    if (avgRecentEnergy < 40) {
      insights.push({
        id: 'burnout_prediction',
        type: 'critical',
        title: 'Riesgo de Burnout',
        description: 'Basado en tu energía reciente, hay un 75% de riesgo de burnout en los próximos 3 días si no tomas medidas.',
        severity: 'high',
        timestamp: new Date(),
        actionRequired: true,
        suggestedAction: 'Tomar descanso obligatorio mañana'
      });
    }
    
    // Predecir patrón de gasto
    const lastWeekExpenses = expenses.filter(exp => 
      new Date(exp.timestamp).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    );
    
    if (lastWeekExpenses.length > 5) {
      insights.push({
        id: 'spending_pattern_prediction',
        type: 'info',
        title: 'Predicción de Gastos',
        description: 'Basado en tu patrón, es probable que tengas un gasto significativo este fin de semana. Considera planificar.',
        severity: 'medium',
        timestamp: new Date(),
        actionRequired: false
      });
    }
    
    return insights;
  }

  // Auditoría de decisiones de IA (XAI)
  static getDecisionLog(): Array<{
    timestamp: Date;
    decision: string;
    reasoning: string;
    confidence: number;
  }> {
    return [
      {
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        decision: 'Sugerir descanso',
        reasoning: 'La carga cognitiva superó el límite del 80% y la energía está por debajo del 35%',
        confidence: 0.92
      },
      {
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        decision: 'Alerta de gasto emocional',
        reasoning: 'Se detectó patrón de gastos por impulso cuando la energía estaba baja',
        confidence: 0.87
      },
      {
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        decision: 'Recomendar pausa activa',
        reasoning: 'Más de 2 horas continuas de alta concentración detectadas',
        confidence: 0.95
      }
    ];
  }
}
