import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingUp,
  Activity,
  Target,
  Zap,
} from 'lucide-react-native';
import { Colors } from '../types/colors';
import { MindfulExpense, MindfulIncome, StressProjection, WealthHealth } from '../types';
import { ModernExpenseForm } from './ModernExpenseForm';
import { IncomeEntryForm } from './IncomeEntryForm';

interface VisualResourcesDashboardProps {
  expenses?: MindfulExpense[];
  incomes?: MindfulIncome[];
  onAddExpense?: () => void;
  onAddIncome?: () => void;
  wealthHealth?: WealthHealth;
  stressProjection?: StressProjection;
}

const { width: screenWidth } = Dimensions.get('window');

export const VisualResourcesDashboard: React.FC<VisualResourcesDashboardProps> = ({
  expenses = [],
  incomes = [],
  onAddExpense,
  onAddIncome,
  wealthHealth,
  stressProjection,
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'details'>('overview');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Cálculos
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalIncomes = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const balance = totalIncomes - totalExpenses;
  const savingsRate = totalIncomes > 0 ? ((totalIncomes - totalExpenses) / totalIncomes) * 100 : 0;

  const emotionalSpent = expenses.filter(e => e.isEmotionalSpending).reduce((sum, e) => sum + e.amount, 0);
  const emotionalRatio = totalExpenses > 0 ? (emotionalSpent / totalExpenses) * 100 : 0;

  const stressLabel = stressProjection?.weeklyStress ?? 'medium';
  const stressColor =
    stressLabel === 'high' ? Colors.tertiary :
    stressLabel === 'low' ? Colors.accent :
    Colors.primary;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Componente de tarjeta visual
  const VisualCard: React.FC<{
    children: React.ReactNode;
    style?: object;
  }> = ({ children, style }) => (
    <View style={[styles.visualCard, style]}>
      {children}
    </View>
  );

  // Componente de métrica circular
  const CircularMetric: React.FC<{
    value: number;
    size?: number;
    color?: string;
    label: string;
  }> = ({ value, size = 80, color = Colors.accent, label }) => {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <View style={styles.circularMetric}>
        <View style={[styles.circleContainer, { width: size, height: size }]}>
          <View style={[styles.circleBackground, { width: size, height: size, borderRadius: size / 2 }]} />
          <View style={[
            styles.circleProgress,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: color,
              borderWidth: 10,
            }
          ]} />
          <View style={styles.circleContent}>
            <Text style={[styles.circleValue, { color }]}>
              {Math.round(value)}%
            </Text>
          </View>
        </View>
        <Text style={styles.circleLabel}>{label}</Text>
      </View>
    );
  };

  // Componente de transacción visual
  const VisualTransaction: React.FC<{
    item: MindfulExpense | MindfulIncome;
    isIncome: boolean;
  }> = ({ item, isIncome }) => (
    <View style={styles.visualTransaction}>
      <View style={[
        styles.transactionIndicator,
        { backgroundColor: isIncome ? Colors.accent : Colors.tertiary }
      ]}>
        {isIncome ? (
          <ArrowUpRight size={16} color="#FFFFFF" />
        ) : (
          <ArrowDownRight size={16} color="#FFFFFF" />
        )}
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>{item.description}</Text>
        <Text style={styles.transactionAmount}>
          {isIncome ? '+' : '-'}${item.amount.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header visual */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>recursos</Text>
          <View style={styles.headerBalance}>
            <Text style={styles.balanceLabel}>balance</Text>
            <Text style={[
              styles.balanceValue,
              { color: balance >= 0 ? Colors.accent : Colors.tertiary }
            ]}>
              ${balance.toFixed(0)}
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.incomeBtn]}
            onPress={() => setShowIncomeForm(true)}
          >
            <Plus size={16} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.expenseBtn]}
            onPress={() => setShowExpenseForm(true)}
          >
            <Minus size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Selector de sección */}
      <View style={styles.sectionSelector}>
        <TouchableOpacity
          style={[
            styles.sectionTab,
            activeSection === 'overview' && styles.activeSection
          ]}
          onPress={() => setActiveSection('overview')}
        >
          <Activity size={16} color={activeSection === 'overview' ? Colors.accent : Colors.textSecondary} />
          <Text style={[
            styles.sectionTabText,
            activeSection === 'overview' && styles.activeSectionText
          ]}>
            resumen
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sectionTab,
            activeSection === 'details' && styles.activeSection
          ]}
          onPress={() => setActiveSection('details')}
        >
          <Wallet size={16} color={activeSection === 'details' ? Colors.accent : Colors.textSecondary} />
          <Text style={[
            styles.sectionTabText,
            activeSection === 'details' && styles.activeSectionText
          ]}>
            detalles
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {activeSection === 'overview' && (
          <View style={styles.overviewContent}>
            {/* Tarjeta principal */}
            <VisualCard style={styles.mainCard}>
              <View style={styles.mainCardContent}>
                <View style={styles.mainMetric}>
                  <View style={styles.metricIcon}>
                    <Wallet size={24} color={Colors.accent} />
                  </View>
                  <View style={styles.metricData}>
                    <Text style={styles.metricLabel}>flujo mensual</Text>
                    <Text style={styles.metricValue}>${(totalIncomes - totalExpenses).toFixed(0)}</Text>
                  </View>
                </View>
                
                <View style={styles.progressBars}>
                  <View style={styles.progressItem}>
                    <Text style={styles.progressLabel}>ingresos</Text>
                    <View style={styles.progressBar}>
                      <View style={[
                        styles.progressFill,
                        { 
                          width: `${Math.min(100, (totalIncomes / Math.max(totalIncomes, totalExpenses))) * 100}%`,
                          backgroundColor: Colors.accent
                        }
                      ]} />
                    </View>
                    <Text style={styles.progressValue}>${totalIncomes.toFixed(0)}</Text>
                  </View>
                  
                  <View style={styles.progressItem}>
                    <Text style={styles.progressLabel}>gastos</Text>
                    <View style={styles.progressBar}>
                      <View style={[
                        styles.progressFill,
                        { 
                          width: `${Math.min(100, (totalExpenses / Math.max(totalIncomes, totalExpenses))) * 100}%`,
                          backgroundColor: Colors.tertiary
                        }
                      ]} />
                    </View>
                    <Text style={styles.progressValue}>${totalExpenses.toFixed(0)}</Text>
                  </View>
                </View>
              </View>
            </VisualCard>

            <VisualCard>
              <View style={styles.overviewHeaderRow}>
                <Text style={styles.overviewTitle}>hoy</Text>
                <View style={styles.overviewPills}>
                  <View style={[styles.overviewPillDot, { backgroundColor: stressColor }]} />
                  <Text style={styles.overviewPillText}>{`estrés ${stressLabel}`}</Text>
                </View>
              </View>

              <View style={styles.overviewStatsGrid}>
                <View style={styles.overviewStatCard}>
                  <Text style={styles.overviewStatLabel}>safe to spend</Text>
                  <Text style={styles.overviewStatValue}>
                    ${((wealthHealth?.safeToSpend ?? 0)).toFixed(0)}
                  </Text>
                  <Text style={styles.overviewStatSub}>
                    {wealthHealth?.financialLoad ? `carga ${wealthHealth.financialLoad}` : 'estimado'}
                  </Text>
                </View>
                <View style={styles.overviewStatCard}>
                  <Text style={styles.overviewStatLabel}>próximos pagos</Text>
                  <Text style={styles.overviewStatValue}>
                    ${((wealthHealth?.upcomingPayments ?? 0)).toFixed(0)}
                  </Text>
                  <Text style={styles.overviewStatSub}>7 días</Text>
                </View>
                <View style={styles.overviewStatCard}>
                  <Text style={styles.overviewStatLabel}>gasto emocional</Text>
                  <Text style={styles.overviewStatValue}>{Math.round(emotionalRatio)}%</Text>
                  <Text style={styles.overviewStatSub}>
                    ${emotionalSpent.toFixed(0)}
                  </Text>
                </View>
                <View style={styles.overviewStatCard}>
                  <Text style={styles.overviewStatLabel}>días seguros</Text>
                  <Text style={styles.overviewStatValue}>{stressProjection?.safeDays ?? 0}</Text>
                  <Text style={styles.overviewStatSub}>esta semana</Text>
                </View>
              </View>
            </VisualCard>

            {/* Métricas circulares */}
            <View style={styles.circularMetrics}>
              <CircularMetric
                value={savingsRate}
                label="ahorro"
                color={savingsRate >= 20 ? Colors.accent : Colors.textSecondary}
              />
              <CircularMetric
                value={Math.min(100, (incomes.length / 5) * 100)}
                label="diversidad"
                color={Colors.primary}
              />
            </View>

            {/* Insights visuales */}
            <VisualCard style={styles.insightsCard}>
              <View style={styles.insightHeader}>
                <Target size={20} color={Colors.accent} />
                <Text style={styles.insightTitle}>estado actual</Text>
              </View>
              <View style={styles.insightContent}>
                <View style={styles.insightItem}>
                  <View style={[
                    styles.insightDot,
                    { backgroundColor: balance >= 0 ? Colors.accent : Colors.tertiary }
                  ]} />
                  <Text style={styles.insightText}>
                    {balance >= 0 ? 'positivo' : 'negativo'}
                  </Text>
                </View>
                <View style={styles.insightItem}>
                  <View style={[
                    styles.insightDot,
                    { backgroundColor: savingsRate >= 20 ? Colors.accent : Colors.textSecondary }
                  ]} />
                  <Text style={styles.insightText}>
                    {savingsRate >= 20 ? 'saludable' : 'mejorable'}
                  </Text>
                </View>
                <View style={styles.insightItem}>
                  <View style={[
                    styles.insightDot,
                    { backgroundColor: expenses.length > 10 ? Colors.tertiary : Colors.accent }
                  ]} />
                  <Text style={styles.insightText}>
                    {expenses.length > 10 ? 'alto gasto' : 'controlado'}
                  </Text>
                </View>
              </View>
            </VisualCard>
          </View>
        )}

        {activeSection === 'details' && (
          <View style={styles.detailsContent}>
            {/* Resumen financiero mejorado */}
            <View style={styles.enhancedSummaryContainer}>
              <Text style={styles.enhancedSummaryTitle}>resumen financiero</Text>
              
              {/* Tarjeta principal de balance */}
              <View style={styles.balanceCard}>
                <View style={styles.balanceHeader}>
                  <Text style={styles.balanceMainLabel}>balance neto</Text>
                  <Text style={[
                    styles.balanceMainValue,
                    { color: balance >= 0 ? Colors.accent : Colors.tertiary }
                  ]}>
                    ${balance.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.balanceTrend}>
                  <Text style={styles.balanceTrendText}>
                    {balance >= 0 ? '+12.5% vs mes anterior' : '-8.3% vs mes anterior'}
                  </Text>
                </View>
              </View>

              {/* Grid de métricas mejorado */}
              <View style={styles.enhancedMetricsGrid}>
                <View style={[styles.enhancedMetricCard, { borderLeftColor: Colors.accent }]}>
                  <View style={styles.metricHeader}>
                    <View style={[styles.metricIconContainer, { backgroundColor: '#E6F7FF' }]}>
                      <TrendingUp size={20} color={Colors.accent} />
                    </View>
                    <View style={styles.metricBadge}>
                      <Text style={styles.metricBadgeText}>+15%</Text>
                    </View>
                  </View>
                  <Text style={styles.metricMainLabel}>ingresos</Text>
                  <Text style={styles.metricMainValue}>${totalIncomes.toFixed(2)}</Text>
                  <Text style={styles.metricSubLabel}>3 fuentes activas</Text>
                  <View style={styles.metricProgress}>
                    <View style={[styles.metricProgressBar, { backgroundColor: '#E6F7FF' }]}>
                      <View style={[
                        styles.metricProgressFill,
                        { width: '75%', backgroundColor: Colors.accent }
                      ]} />
                    </View>
                    <Text style={styles.metricProgressText}>75%</Text>
                  </View>
                </View>

                <View style={[styles.enhancedMetricCard, { borderLeftColor: Colors.tertiary }]}>
                  <View style={styles.metricHeader}>
                    <View style={[styles.metricIconContainer, { backgroundColor: '#FFF1F0' }]}>
                      <ArrowDownRight size={20} color={Colors.tertiary} />
                    </View>
                    <View style={styles.metricBadge}>
                      <Text style={[styles.metricBadgeText, { color: Colors.tertiary }]}>-8%</Text>
                    </View>
                  </View>
                  <Text style={styles.metricMainLabel}>gastos</Text>
                  <Text style={styles.metricMainValue}>${totalExpenses.toFixed(2)}</Text>
                  <Text style={styles.metricSubLabel}>{expenses.length} transacciones</Text>
                  <View style={styles.metricProgress}>
                    <View style={[styles.metricProgressBar, { backgroundColor: '#FFF1F0' }]}>
                      <View style={[
                        styles.metricProgressFill,
                        { width: '60%', backgroundColor: Colors.tertiary }
                      ]} />
                    </View>
                    <Text style={styles.metricProgressText}>60%</Text>
                  </View>
                </View>

                <View style={[styles.enhancedMetricCard, { borderLeftColor: Colors.primary }]}>
                  <View style={styles.metricHeader}>
                    <View style={[styles.metricIconContainer, { backgroundColor: '#F0F5FF' }]}>
                      <Zap size={20} color={Colors.primary} />
                    </View>
                    <View style={styles.metricBadge}>
                      <Text style={[styles.metricBadgeText, { color: Colors.primary }]}>+25</Text>
                    </View>
                  </View>
                  <Text style={styles.metricMainLabel}>energía</Text>
                  <Text style={styles.metricMainValue}>{balance >= 0 ? 'Alta' : 'Media'}</Text>
                  <Text style={styles.metricSubLabel}>Nivel {balance >= 0 ? 'óptimo' : 'estable'}</Text>
                  <View style={styles.metricProgress}>
                    <View style={[styles.metricProgressBar, { backgroundColor: '#F0F5FF' }]}>
                      <View style={[
                        styles.metricProgressFill,
                        { width: balance >= 0 ? '85%' : '65%', backgroundColor: Colors.primary }
                      ]} />
                    </View>
                    <Text style={styles.metricProgressText}>{balance >= 0 ? '85%' : '65%'}</Text>
                  </View>
                </View>

                <View style={[styles.enhancedMetricCard, { borderLeftColor: savingsRate >= 20 ? Colors.accent : Colors.textSecondary }]}>
                  <View style={styles.metricHeader}>
                    <View style={[styles.metricIconContainer, { backgroundColor: savingsRate >= 20 ? '#E6F7FF' : '#F5F5F5' }]}>
                      <Target size={20} color={savingsRate >= 20 ? Colors.accent : Colors.textSecondary} />
                    </View>
                    <View style={styles.metricBadge}>
                      <Text style={[
                        styles.metricBadgeText,
                        { color: savingsRate >= 20 ? Colors.accent : Colors.textSecondary }
                      ]}>
                        {savingsRate >= 20 ? '✓' : '→'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.metricMainLabel}>meta</Text>
                  <Text style={styles.metricMainValue}>{savingsRate.toFixed(0)}%</Text>
                  <Text style={styles.metricSubLabel}>Objetivo: 20%</Text>
                  <View style={styles.metricProgress}>
                    <View style={[styles.metricProgressBar, { backgroundColor: savingsRate >= 20 ? '#E6F7FF' : '#F5F5F5' }]}>
                      <View style={[
                        styles.metricProgressFill,
                        { 
                          width: `${Math.min(100, savingsRate * 5)}%`,
                          backgroundColor: savingsRate >= 20 ? Colors.accent : Colors.textSecondary
                        }
                      ]} />
                    </View>
                    <Text style={styles.metricProgressText}>{Math.min(100, savingsRate * 5)}%</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Transacciones recientes */}
            <VisualCard style={styles.transactionsCard}>
              <Text style={styles.transactionsTitle}>reciente</Text>
              {[...expenses.slice(0, 5), ...incomes.slice(0, 3)].map((item, index) => {
                const isIncomeItem = incomes.includes(item as any);
                return (
                  <VisualTransaction
                    key={item.id}
                    item={item}
                    isIncome={isIncomeItem}
                  />
                );
              })}
            </VisualCard>
          </View>
        )}
      </ScrollView>

      {/* Formularios modales */}
      <ModernExpenseForm
        isVisible={showExpenseForm}
        onClose={() => setShowExpenseForm(false)}
        onSubmit={(expenseData) => {
          console.log('Nuevo gasto:', expenseData);
          setShowExpenseForm(false);
        }}
      />

      <IncomeEntryForm
        isVisible={showIncomeForm}
        onClose={() => setShowIncomeForm(false)}
        onSubmit={(incomeData) => {
          console.log('Nuevo ingreso:', incomeData);
          setShowIncomeForm(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  headerBalance: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  balanceLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'lowercase',
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  incomeBtn: {
    backgroundColor: Colors.accent,
  },
  expenseBtn: {
    backgroundColor: Colors.tertiary,
  },
  sectionSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  activeSection: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.accent,
  },
  sectionTabText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  activeSectionText: {
    color: Colors.accent,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  overviewContent: {
    gap: 20,
  },
  overviewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    textTransform: 'lowercase',
  },
  overviewPills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.surface,
  },
  overviewPillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  overviewPillText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'lowercase',
    fontWeight: '500',
  },
  overviewStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  overviewStatCard: {
    width: (screenWidth - 72) / 2,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
  },
  overviewStatLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'lowercase',
    marginBottom: 6,
  },
  overviewStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  overviewStatSub: {
    fontSize: 11,
    color: Colors.textLight,
    textTransform: 'lowercase',
  },
  visualCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mainCard: {
    marginBottom: 4,
  },
  mainCardContent: {
    gap: 20,
  },
  mainMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricData: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'lowercase',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  progressBars: {
    gap: 12,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    width: 60,
    textTransform: 'lowercase',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressValue: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '500',
    width: 60,
    textAlign: 'right',
  },
  circularMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  circularMetric: {
    alignItems: 'center',
    gap: 12,
  },
  circleContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBackground: {
    position: 'absolute',
    backgroundColor: Colors.surface,
  },
  circleProgress: {
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
  },
  circleContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  circleLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'lowercase',
  },
  insightsCard: {
    marginTop: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  insightContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  insightItem: {
    alignItems: 'center',
    gap: 8,
  },
  insightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  insightText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'lowercase',
  },
  detailsContent: {
    gap: 20,
  },
  summaryCard: {
    marginBottom: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  summaryItem: {
    width: (screenWidth - 72) / 2,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'lowercase',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  transactionsCard: {
    marginTop: 4,
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  visualTransaction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  transactionIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionTitle: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  // Estilos mejorados para el resumen financiero
  enhancedSummaryContainer: {
    gap: 20,
  },
  enhancedSummaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  balanceCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceMainLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    textTransform: 'lowercase',
    marginBottom: 8,
  },
  balanceMainValue: {
    fontSize: 36,
    fontWeight: '700',
  },
  balanceTrend: {
    alignItems: 'center',
  },
  balanceTrendText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  enhancedMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  enhancedMetricCard: {
    width: (screenWidth - 56) / 2,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.surface,
  },
  metricBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.accent,
  },
  metricMainLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'lowercase',
    marginBottom: 4,
  },
  metricMainValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  metricSubLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  metricProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricProgressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  metricProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  metricProgressText: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
});
