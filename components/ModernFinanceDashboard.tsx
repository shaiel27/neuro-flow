import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Alert
} from 'react-native';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  PieChart, 
  BarChart3,
  Calendar,
  Bell,
  ChevronRight,
  Plus,
  X
} from 'lucide-react-native';
import { Colors } from '../types/colors';
import { mockWealthHealth, mockMindfulExpenses } from '../types/mockData';
import { MindfulExpense } from '../types';

const { width: screenWidth } = Dimensions.get('window');

interface ModernFinanceDashboardProps {
  onAddExpense?: () => void;
  onTransactionPress?: (expense: MindfulExpense) => void;
}

export const ModernFinanceDashboard: React.FC<ModernFinanceDashboardProps> = ({
  onAddExpense,
  onTransactionPress
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [showQuickStats, setShowQuickStats] = useState(true);

  // Calcular estadísticas
  const todayExpenses = mockMindfulExpenses.filter(e => 
    new Date(e.timestamp).toDateString() === new Date().toDateString()
  );
  const totalToday = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  const emotionalSpending = mockMindfulExpenses.filter(e => e.isEmotionalSpending);
  const recurringExpenses = mockMindfulExpenses.filter(e => e.isRecurring);

  const getSpendingTrend = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayExpenses = mockMindfulExpenses.filter(e => 
      new Date(e.timestamp).toDateString() === yesterday.toDateString()
    );
    const yesterdayTotal = yesterdayExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    if (totalToday > yesterdayTotal) return 'up';
    if (totalToday < yesterdayTotal) return 'down';
    return 'stable';
  };

  const getEmotionalHealthScore = () => {
    const totalExpenses = mockMindfulExpenses.length;
    const emotionalCount = emotionalSpending.length;
    const score = Math.max(0, 100 - (emotionalCount / totalExpenses * 100));
    return Math.round(score);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Principal */}
      <View style={styles.mainHeader}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Tu Dinero</Text>
            <Text style={styles.balance}>${mockWealthHealth.safeToSpend.toFixed(2)}</Text>
            <Text style={styles.balanceLabel}>Disponible hoy</Text>
          </View>
          <TouchableOpacity style={styles.notificationBell}>
            <Bell size={24} color={Colors.accent} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
        
        {/* Tarjeta de Balance Principal */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceTitle}>Balance Total</Text>
              <Text style={styles.balanceAmount}>
                ${mockWealthHealth.totalBalance.toFixed(0)}
              </Text>
            </View>
            <View style={[
              styles.trendIndicator,
              { backgroundColor: getSpendingTrend() === 'up' ? '#FF6B6B' : '#4ECDC4' }
            ]}>
              {getSpendingTrend() === 'up' ? (
                <TrendingUp size={16} color="#FFFFFF" />
              ) : getSpendingTrend() === 'down' ? (
                <TrendingDown size={16} color="#FFFFFF" />
              ) : (
                <DollarSign size={16} color="#FFFFFF" />
              )}
            </View>
          </View>
          
          <View style={styles.balanceMetrics}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>${totalToday.toFixed(0)}</Text>
              <Text style={styles.metricLabel}>Hoy</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>${mockWealthHealth.upcomingPayments.toFixed(0)}</Text>
              <Text style={styles.metricLabel}>Próximos</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{getEmotionalHealthScore()}%</Text>
              <Text style={styles.metricLabel}>Salud</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Selector de Período */}
      <View style={styles.periodSelector}>
        {(['day', 'week', 'month'] as const).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodOption,
              selectedPeriod === period && styles.periodOptionActive
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[
              styles.periodText,
              selectedPeriod === period && styles.periodTextActive
            ]}>
              {period === 'day' ? 'Hoy' : period === 'week' ? 'Semana' : 'Mes'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tarjetas de Estadísticas */}
      <View style={styles.statsGrid}>
        {/* Tarjeta de Salud Emocional */}
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <View style={styles.statIconContainer}>
              <PieChart size={20} color={Colors.accent} />
            </View>
            <Text style={styles.statTitle}>Salud Emocional</Text>
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{getEmotionalHealthScore()}%</Text>
            <Text style={styles.statDescription}>
              {emotionalSpending.length} gastos emocionales
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { 
                  width: `${getEmotionalHealthScore()}%`,
                  backgroundColor: getEmotionalHealthScore() > 70 ? Colors.accent : 
                                   getEmotionalHealthScore() > 40 ? Colors.accent : Colors.tertiary
                }
              ]} 
            />
          </View>
        </View>

        {/* Tarjeta de Recurrencia */}
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <View style={styles.statIconContainer}>
              <Calendar size={20} color="#6B8E7E" />
            </View>
            <Text style={styles.statTitle}>Gastos Recurrentes</Text>
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{recurringExpenses.length}</Text>
            <Text style={styles.statDescription}>
              Programados en Flow
            </Text>
          </View>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>Ver todos</Text>
            <ChevronRight size={16} color={Colors.accent} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Gráfico de Distribución */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Distribución de Gastos</Text>
          <TouchableOpacity style={styles.chartFilter}>
            <Text style={styles.chartFilterText}>Esta semana</Text>
            <ChevronRight size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.distributionContainer}>
          <View style={styles.distributionBars}>
            {[
              { category: 'Comida', amount: 350, color: Colors.accent },
              { category: 'Transporte', amount: 120, color: Colors.textPrimary },
              { category: 'Servicios', amount: 280, color: Colors.accent },
              { category: 'Ocio', amount: 180, color: Colors.tertiary },
              { category: 'Otros', amount: 95, color: Colors.textLight },
            ].map((item, index) => (
              <View key={index} style={styles.distributionItem}>
                <View style={styles.distributionInfo}>
                  <Text style={styles.distributionCategory}>{item.category}</Text>
                  <Text style={styles.distributionAmount}>${item.amount}</Text>
                </View>
                <View style={styles.distributionBarContainer}>
                  <View 
                    style={[
                      styles.distributionBar,
                      { 
                        width: `${(item.amount / 350) * 100}%`,
                        backgroundColor: item.color 
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Transacciones Recientes */}
      <View style={styles.transactionsSection}>
        <View style={styles.transactionsHeader}>
          <Text style={styles.transactionsTitle}>Actividad Reciente</Text>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>Ver todo</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.transactionsList}>
          {todayExpenses.slice(0, 3).map((expense, index) => (
            <TouchableOpacity
              key={expense.id}
              style={styles.transactionItem}
              onPress={() => onTransactionPress?.(expense)}
            >
              <View style={styles.transactionLeft}>
                <View style={[
                  styles.transactionIcon,
                  { backgroundColor: expense.isEmotionalSpending ? '#FF6B35' : '#6B8E7E' }
                ]}>
                  <CreditCard size={16} color="#FFFFFF" />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription}>
                    {expense.description}
                  </Text>
                  <Text style={styles.transactionTime}>
                    {new Date(expense.timestamp).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={styles.transactionAmount}>
                  -${expense.amount.toFixed(2)}
                </Text>
                {expense.isEmotionalSpending && (
                  <View style={[styles.emotionalTag, { backgroundColor: Colors.tertiary }]}>
                    <Text style={styles.emotionalTagText}>Emocional</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Botón de Acción Rápida */}
      <TouchableOpacity style={[styles.quickAddButton, { backgroundColor: Colors.accent }]} onPress={onAddExpense}>
        <Plus size={20} color={Colors.cardBackground} />
        <Text style={styles.quickAddText}>Agregar Gasto</Text>
      </TouchableOpacity>

      {/* Espacio inferior */}
      <View style={styles.bottomSpace} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mainHeader: {
    padding: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  balance: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  balanceLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  notificationBell: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B35',
  },
  balanceCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceTitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  trendIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  periodOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodOptionActive: {
    backgroundColor: Colors.accent,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  periodTextActive: {
    color: Colors.cardBackground,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F5F5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  statContent: {
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  statDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F0F0EB',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  chartFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chartFilterText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  distributionContainer: {
    gap: 16,
  },
  distributionBars: {
    gap: 12,
  },
  distributionItem: {
    gap: 8,
  },
  distributionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distributionCategory: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  distributionAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  distributionBarContainer: {
    height: 8,
    backgroundColor: '#F0F0EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  distributionBar: {
    height: '100%',
    borderRadius: 4,
    minWidth: 4,
  },
  transactionsSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  seeAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.surface,
    borderRadius: 8,
  },
  seeAllText: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '500',
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  emotionalTag: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  emotionalTagText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  quickAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  quickAddText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.cardBackground,
  },
  bottomSpace: {
    height: 40,
  },
});
