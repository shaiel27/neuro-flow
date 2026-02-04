import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Activity,
  Zap,
  Target,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../types/colors';
import { Insight, EnergySnapshot, MindfulExpense, CorrelationData } from '../types';
import { InsightService } from '../services/InsightService';
import { mockMindfulExpenses } from '../types/mockData';

const { width: screenWidth } = Dimensions.get('window');

const CleanInsightsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [correlationData, setCorrelationData] = useState<CorrelationData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Datos de prueba para EnergySnapshots
  const mockEnergySnapshots: EnergySnapshot[] = [
    { id: '1', currentEnergy: 75, timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), cognitiveLoad: 'medium', activities: ['trabajo', 'ejercicio'], mood: 'calm' },
    { id: '2', currentEnergy: 60, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), cognitiveLoad: 'high', activities: ['trabajo', 'reuniones'], mood: 'stressed' },
    { id: '3', currentEnergy: 45, timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), cognitiveLoad: 'high', activities: ['trabajo', 'estudio'], mood: 'tired' },
    { id: '4', currentEnergy: 80, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), cognitiveLoad: 'low', activities: ['descanso', 'tiempo libre'], mood: 'happy' },
    { id: '5', currentEnergy: 55, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), cognitiveLoad: 'medium', activities: ['trabajo', 'compras'], mood: 'calm' },
    { id: '6', currentEnergy: 35, timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), cognitiveLoad: 'high', activities: ['trabajo', 'proyecto urgente'], mood: 'stressed' },
    { id: '7', currentEnergy: 70, timestamp: new Date(), cognitiveLoad: 'medium', activities: ['trabajo', 'planificación'], mood: 'calm' },
  ];

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = () => {
    const generatedInsights = InsightService.generateCorrelationInsights(
      mockMindfulExpenses,
      mockEnergySnapshots
    );
    
    const predictiveInsights = InsightService.generatePredictiveInsights(
      mockMindfulExpenses,
      mockEnergySnapshots
    );
    
    setInsights([...generatedInsights, ...predictiveInsights]);
    
    const data = InsightService.generateCorrelationData(
      mockMindfulExpenses,
      mockEnergySnapshots
    );
    setCorrelationData(data);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadInsights();
      setRefreshing(false);
    }, 1000);
  };

  // Componente de gráfica de correlación
  const CorrelationChart: React.FC = () => {
    if (!correlationData) return null;

    const maxValue = Math.max(
      ...correlationData.datasets[0].data,
      ...correlationData.datasets[1].data
    );

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Correlación Energía vs Gastos Emocionales</Text>
        </View>
        
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.accent }]} />
            <Text style={styles.legendText}>Nivel de Energía</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.tertiary }]} />
            <Text style={styles.legendText}>Gastos Emocionales</Text>
          </View>
        </View>

        <View style={styles.chartGrid}>
          {correlationData.labels.map((label, index) => (
            <View key={index} style={styles.chartColumn}>
              <View style={styles.chartBars}>
                <View
                  style={[
                    styles.chartBar,
                    {
                      height: `${(correlationData.datasets[0].data[index] / maxValue) * 100}%`,
                      backgroundColor: Colors.accent,
                    }
                  ]}
                />
                <View
                  style={[
                    styles.chartBar,
                    {
                      height: `${(correlationData.datasets[1].data[index] / maxValue) * 100}%`,
                      backgroundColor: Colors.tertiary,
                    }
                  ]}
                />
              </View>
              <Text style={styles.chartLabel}>{label.slice(0, 3)}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // Componente de Insight Card
  const InsightCard: React.FC<{ insight: Insight }> = ({ insight }) => {
    const getIconComponent = () => {
      switch (insight.type) {
        case 'critical': return AlertTriangle;
        case 'warning': return AlertTriangle;
        case 'success': return CheckCircle;
        case 'info': return Info;
        default: return Brain;
      }
    };

    const getIconColor = () => {
      switch (insight.type) {
        case 'critical': return Colors.tertiary;
        case 'warning': return '#FA8C16';
        case 'success': return Colors.accent;
        case 'info': return Colors.primary;
        default: return Colors.textSecondary;
      }
    };

    const IconComponent = getIconComponent();

    return (
      <View style={[styles.insightCard, { borderLeftColor: getIconColor() }]}>
        <View style={styles.insightHeader}>
          <View style={[styles.insightIcon, { backgroundColor: getIconColor() }]}>
            <IconComponent size={16} color="#FFFFFF" />
          </View>
          <View style={styles.insightMeta}>
            <Text style={styles.insightTitle}>{insight.title}</Text>
            <Text style={styles.insightTime}>
              {new Date(insight.timestamp).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
          {insight.confidence && (
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>
                {Math.round(insight.confidence * 100)}%
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.insightDescription}>{insight.description}</Text>
        {insight.suggestedAction && (
          <View style={styles.suggestedAction}>
            <Text style={styles.actionText}>Recomendación: {insight.suggestedAction}</Text>
          </View>
        )}
      </View>
    );
  };

  // Componente de Empty State
  const EmptyState: React.FC = () => (
    <View style={styles.emptyState}>
      <Brain size={48} color={Colors.textSecondary} />
      <Text style={styles.emptyTitle}>Aprendiendo</Text>
      <Text style={styles.emptyDescription}>
        Aún estoy aprendiendo de tus hábitos. Registra 2 días más para darte consejos personalizados.
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insights</Text>
        <View style={styles.headerSubtitle}>
          <Activity size={16} color={Colors.accent} />
          <Text style={styles.subtitleText}>Análisis IA</Text>
        </View>
      </View>

      {/* Contenido */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Gráfica de Correlación */}
        <CorrelationChart />

        {/* Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Análisis Personalizados</Text>
          
          {insights.length === 0 ? (
            <EmptyState />
          ) : (
            insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))
          )}
        </View>

        {/* Métricas Clave */}
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Indicadores Clave</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Zap size={20} color={Colors.accent} />
              <Text style={styles.metricLabel}>Energía Promedio</Text>
              <Text style={styles.metricValue}>
                {Math.round(mockEnergySnapshots.reduce((sum, snap) => sum + snap.currentEnergy, 0) / mockEnergySnapshots.length)}%
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Target size={20} color={Colors.primary} />
              <Text style={styles.metricLabel}>Gastos Emocionales</Text>
              <Text style={styles.metricValue}>
                {mockMindfulExpenses.filter(exp => exp.isEmotionalSpending).length}
              </Text>
            </View>
            <View style={styles.metricCard}>
              <TrendingUp size={20} color={Colors.accent} />
              <Text style={styles.metricLabel}>Tendencia</Text>
              <Text style={styles.metricValue}>Estable</Text>
            </View>
            <View style={styles.metricCard}>
              <Brain size={20} color={Colors.tertiary} />
              <Text style={styles.metricLabel}>Carga Cognitiva</Text>
              <Text style={styles.metricValue}>Media</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subtitleText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'lowercase',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  chartContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    textTransform: 'lowercase',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  chartGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
    marginBottom: 8,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 120,
  },
  chartBar: {
    width: 12,
    borderRadius: 6,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  insightsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  insightCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightMeta: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  insightTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.surface,
  },
  confidenceText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  insightDescription: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 12,
  },
  suggestedAction: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 12,
  },
  actionText: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  metricsSection: {
    marginBottom: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: (screenWidth - 56) / 2,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    textTransform: 'lowercase',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});

export default CleanInsightsScreen;
