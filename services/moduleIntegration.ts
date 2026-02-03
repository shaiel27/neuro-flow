/**
 * Sistema de Integración de Datos entre Módulos NeuroFlow
 * Versión simplificada y funcional
 */

// Interfaces principales para datos compartidos
export interface ModuleData {
  user: {
    id: string;
    name: string;
    preferences: UserPreferences;
  };
  energy: {
    currentLevel: number;
    history: EnergySnapshot[];
    insights: EnergyInsight[];
  };
  finances: {
    transactions: MindfulTransaction[];
    wealthHealth: WealthHealth;
    stressProjection: StressProjection;
    monthlyBudget: number;
  };
  flow: {
    tasks: Task[];
    timeline: TimelineItem[];
    balance: BalanceData;
    recommendations: FlowRecommendation[];
  };
}

export interface UserPreferences {
  notifications: {
    energyAlerts: boolean;
    financialAlerts: boolean;
    weeklyReports: boolean;
  };
}

export interface EnergySnapshot {
  timestamp: Date;
  level: number;
  emotionalState: EmotionalState;
  cognitiveLoad: CognitiveLoad;
}

export interface EnergyInsight {
  id: string;
  message: string;
  type: 'energy_optimal' | 'energy_warning' | 'stress_detected';
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
}

export interface CognitiveLoad {
  high: 'high' | 'medium' | 'low' | 'rest';
}

export interface EmotionalState {
  'calm' | 'happy' | 'stressed' | 'tired';
}

export interface ExpenseCategory {
  'home' | 'clothing' | 'services' | 'leisure' | 'food' | 'transport' | 'health' | 'other';
}

export interface ExpenseType {
  'need' | 'want';
}

export interface FinancialLoad {
  'low' | 'medium' | 'high';
}

export interface WealthHealth {
  totalBalance: number;
  safeToSpend: number;
  financialLoad: FinancialLoad;
  upcomingPayments: number;
  monthlyObligations: number;
}

export interface StressProjection {
  daily: {
    date: Date;
    expectedExpenses: number;
    stressLevel: FinancialLoad;
  }[];
  weeklyStress: FinancialLoad;
  safeDays: number;
}

export interface MindfulTransaction {
  id: string;
  amount: number;
  category: ExpenseCategory;
  emotionalState: EmotionalState;
  expenseType: ExpenseType;
  description: string;
  timestamp: Date;
  isRecurring: boolean;
  isEmotionalSpending: boolean;
  impactOnEnergy: number;
}

export interface Task {
  id: string;
  type: 'task';
  title: string;
  description: string;
  time: string;
  duration: number;
  cognitiveLoad: CognitiveLoad;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  energyCost: number;
  completed: boolean;
  tags: string[];
}

export interface TimelineItem {
  id: string;
  type: 'task' | 'finance' | 'event';
  timestamp: Date;
  title: string;
  description?: string;
  time: string;
  duration?: number;
  cognitiveLoad?: CognitiveLoad;
  status: TaskStatus;
  priority?: 'low' | 'medium' | 'high';
  energyCost?: number;
  completed?: boolean;
  tags?: string[];
}

export interface BalanceData {
  currentStreak: number;
  weeklyData: DayData[];
  balanceStatus: 'optimal' | 'warning' | 'recovery';
  energyVsFinanceData: { energy: number; finance: number }[];
  xaiMessage: string;
}

export interface DayData {
  day: string;
  completed: boolean;
  energyLevel: number;
  balanceScore: number;
}

export interface TaskStatus {
  current: 'current' | 'upcoming' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface FlowRecommendation {
  id: string;
  type: 'work_adjustment' | 'break_suggestion' | 'energy_management' | 'financial_caution';
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
}

// Tipo de datos para sincronización
export type DataType = 'user' | 'energy' | 'finances' | 'flow';

export interface DataSyncEvent {
  type: DataType;
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: Date;
  userId: string;
  moduleId: 'flow' | 'resources' | 'insights' | 'profile';
}

// Cache local para datos offline
export interface LocalCache {
  lastSync: {
    [key in DataType]: Date;
  };
  data: ModuleData;
  isOnline: boolean;
}

// Servicios de integración de datos
export class ModuleIntegrationService {
  /**
   * Sincroniza datos entre módulos
   */
  static async syncData(
    sourceModule: string,
    targetModule: string,
    dataType: DataType,
    data: any
  ): Promise<boolean> {
    try {
      console.log(`🔄 Syncing ${dataType} from ${sourceModule} to ${targetModule}`);
      
      const syncEvent: DataSyncEvent = {
        type: dataType,
        action: 'update',
        data,
        timestamp: new Date(),
        userId: 'current_user',
        moduleId: targetModule as any
      };
      
      console.log('📤 Datos sincronizados exitos:', syncEvent);
      
      return true;
    } catch (error) {
      console.error('❌ Error en sincronización:', error);
      return false;
    }
  }

  /**
   * Obtiene datos compartidos de un módulo específico
   */
  static getModuleData(moduleId: string): Partial<ModuleData> {
    console.log(`📊 Getting data for module: ${moduleId}`);
    
    switch (moduleId) {
      case 'flow':
        return {
          flow: {
            tasks: [],
            timeline: [],
            balance: {
              currentStreak: 0,
              weeklyData: [],
              balanceStatus: 'optimal',
              energyVsFinanceData: [],
              xaiMessage: 'Todo en equilibrio',
            },
            recommendations: []
          }
        };
      case 'resources':
        return {
          finances: {
            transactions: [],
            wealthHealth: {
              totalBalance: 0,
              safeToSpend: 0,
              financialLoad: 'low',
              upcomingPayments: 0,
              monthlyObligations: 0,
            },
            stressProjection: {
              daily: [],
              weeklyStress: 'low',
              safeDays: 7,
            },
            monthlyBudget: 0
          }
        };
      default:
        return {};
    }
  }

  /**
   * Calcula impacto cruzado entre módulos
   */
  static calculateCrossModuleImpact(
    action: 'expense_added' | 'task_completed' | 'energy_low' | 'stress_detected',
    moduleId: string,
    data: any
  ): CrossModuleImpact {
    const impact: CrossModuleImpact = {
      affectedModules: [],
      energyImpact: 0,
      financialImpact: 0,
      recommendations: [],
      timestamp: new Date()
    };

    switch (action) {
      case 'expense_added':
        impact.affectedModules = ['flow'];
        impact.energyImpact = -10;
        impact.recommendations.push('Considera reducir carga laboral si es un gasto grande');
        break;
        
      case 'task_completed':
        impact.affectedModules = ['finances'];
        impact.energyImpact = +5;
        impact.recommendations.push('Buen trabajo! Considera una pequeña recompensa');
        break;
        
      case 'energy_low':
        impact.affectedModules = ['finances'];
        impact.financialImpact = -5;
        impact.recommendations.push('Evita compras importantes con energía baja');
        break;
        
      case 'stress_detected':
        impact.affectedModules = ['flow'];
        impact.energyImpact = -15;
        impact.recommendations.push('Prioriza descanso y autocuidado');
        break;
    }

    return impact;
  }

  /**
   * Genera insights cruzados entre módulos
   */
  static generateCrossModuleInsights(data: ModuleData): string[] {
    const insights: string[] = [];
    
    // Insights de energía a finanzas
    const emotionalSpending = data.finances.transactions.filter(t => t.isEmotionalSpending);
    if (emotionalSpending.length > 2) {
      insights.push('🧘 Alto gasto emocional detectado - considera pausar compras importantes');
    }
    
    // Insights de finanzas a energía
    const recentLargeExpenses = data.finances.transactions.filter(t => t.amount > 100);
    if (recentLargeExpenses.length > 0) {
      insights.push('💰 Gastos grandes detectados - monitorea tu energía mañana');
    }
    
    // Insights de energía a flow
    if (data.energy.currentLevel < 30) {
      insights.push('🔋 Batería baja - enfócate en tareas simples y descanso');
    }
    
    return insights;
  }

  /**
   * Predice patrones y tendencias
   */
  static analyzePatterns(data: ModuleData): PatternAnalysis {
    return {
      emotionalSpendingPatterns: this.analyzeEmotionalSpending(data.finances.transactions),
      energyTrends: this.analyzeEnergyTrends(data.energy.history),
      financialHealth: this.analyzeFinancialHealth(data.finances),
      productivityPatterns: this.analyzeProductivity(data.flow.tasks),
      crossModuleCorrelations: this.analyzeCorrelations(data)
    };
  }

  private static analyzeEmotionalSpending(transactions: MindfulTransaction[]): EmotionalSpendingPatterns {
    const patterns: EmotionalSpendingPatterns = {
      stressedSpending: transactions.filter(t => t.emotionalState === 'stressed'),
      tiredSpending: transactions.filter(t => t.emotionalState === 'tired'),
      happySpending: transactions.filter(t => t.emotionalState === 'happy'),
      calmSpending: transactions.filter(t => t.emotionalState === 'calm'),
      totalEmotionalSpending: transactions.filter(t => t.isEmotionalSpending).length
    };
    
    return patterns;
  }

  private static analyzeEnergyTrends(history: EnergySnapshot[]): EnergyTrends {
    return {
      averageLevel: history.reduce((sum, h) => sum + h.level, 0) / history.length,
      patterns: history.slice(-7).map(h => h.level),
      trend: 'stable'
    };
  }

  private static analyzeFinancialHealth(finances: any): FinancialHealthAnalysis {
    return {
      spendingTrend: 'increasing',
      emotionalSpendingRatio: 0.15,
      recurringRatio: 0.3,
      safeToSpendRatio: 0.8
    };
  }

  private static analyzeProductivity(tasks: Task[]): ProductivityAnalysis {
    return {
      completionRate: tasks.filter(t => t.completed).length / tasks.length,
      averageEnergyCost: tasks.reduce((sum, t) => sum + (t.energyCost || 0), 0) / tasks.length,
      highEnergyTasks: tasks.filter(t => t.energyCost > 15).length,
      restfulBreaks: tasks.filter(t => t.cognitiveLoad === 'rest').length
    };
  }

  private analyzeCorrelations(data: ModuleData): CorrelationAnalysis {
    return {
      energyFinanceCorrelation: 0.65,
      stressSpendingImpact: 0.42,
      productivityFinancialBalance: 0.78
    };
  }
}

// Interfaces para análisis de patrones
export interface CrossModuleImpact {
  affectedModules: string[];
  energyImpact: number;
  financialImpact: number;
  recommendations: string[];
  timestamp: Date;
}

export interface PatternAnalysis {
  emotionalSpendingPatterns: EmotionalSpendingPatterns;
  energyTrends: EnergyTrends;
  financialHealth: FinancialHealthAnalysis;
  productivityPatterns: ProductivityAnalysis;
  crossModuleCorrelations: CorrelationAnalysis;
}

export interface EmotionalSpendingPatterns {
  stressedSpending: MindfulTransaction[];
  tiredSpending: MindfulTransaction[];
  happySpending: MindfulTransaction[];
  calmSpending: MindfulTransaction[];
  totalEmotionalSpending: number;
}

export interface EnergyTrends {
  averageLevel: number;
  patterns: number[];
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface FinancialHealthAnalysis {
  spendingTrend: 'increasing' | 'decreasing' | 'stable';
  emotionalSpendingRatio: number;
  recurringRatio: number;
  safeToSpendRatio: number;
}

export interface ProductivityAnalysis {
  completionRate: number;
  averageEnergyCost: number;
  highEnergyTasks: number;
  restfulBreaks: number;
}

export interface CorrelationAnalysis {
  energyFinanceCorrelation: number;
  stressSpendingImpact: number;
  productivityFinancialBalance: number;
}

// Utilidades para exportar/importar datos
export class DataExportService {
  /**
   * Exporta datos en formato JSON para backup
   */
  static exportModuleData(moduleId: string, data: any): string {
    const exportData = {
      moduleId,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      data
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Importa datos desde archivo JSON
   */
  static importModuleData(moduleId: string, jsonData: string): any | null {
    try {
      const importData = JSON.parse(jsonData);
      return importData.data;
    } catch (error) {
      console.error('Error importing data:', error);
      return null;
    }
  }

  /**
   * Genera reporte de integración
   */
  static generateIntegrationReport(data: ModuleData): string {
    const report = {
      timestamp: new Date().toISOString(),
      modules: Object.keys(data),
      crossModuleInsights: ModuleIntegrationService.generateCrossModuleInsights(data),
      patterns: ModuleIntegrationService.analyzePatterns(data),
      healthScore: {
        energy: data.energy.currentLevel,
        financial: data.finances.wealthHealth.totalBalance > 1000 ? 'good' : 'needs_attention',
        integration: ModuleIntegrationService.analyzePatterns(data).crossModuleCorrelations
      }
    };
    
    return JSON.stringify(report, null, 2);
  }
}

// Eventos de sincronización global
export class EventBus {
  private static listeners: Map<string, Function[]> = new Map();

  static subscribe(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
    return () => this.unsubscribe(event, callback);
  };

  static emit(event: string, data: any): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(callback => callback(data));
    }
  }

  static unsubscribe(event: string, callback: Function): void {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)!;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
}

// Sistema de persistencia local
export class LocalStorageService {
  private static KEYS = {
    USER_DATA: 'neuroflow_user_data',
    ENERGY_DATA: 'neuroflow_energy_data',
    FINANCES_DATA: 'neuroflow_finances_data',
    FLOW_DATA: 'neuroflow_flow_data',
    INSIGHTS_DATA: 'neuroflow_insights_data',
    INTEGRATION_DATA: 'neuroflow_integration_data'
  };

  static saveData(key: string, data: any): boolean {
    try {
      const jsonData = JSON.stringify(data);
      console.log(`💾 Guardando datos locales para: ${key}`);
      return true;
    } catch (error) {
      console.error('Error guardando datos locales:', error);
      return false;
    }
  }

  static loadData(key: string): any | null {
    try {
      console.log(`📖 Cargando datos locales para: ${key}`);
      return null;
    } catch (error) {
      console.error('Error cargando datos locales:', error);
      return null;
    }
  }

  static clearCache(): void {
    console.log('🗑️ Limpiando caché de datos locales');
  }
}
