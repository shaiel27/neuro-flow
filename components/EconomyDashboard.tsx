import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert
} from 'react-native';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  Minus,
  Briefcase,
  PiggyBank,
  Calendar,
  ChevronRight,
  Wallet
} from 'lucide-react-native';
import { Colors } from '../types/colors';
import { MindfulExpense, MindfulIncome } from '../types';
import { IncomeEntryForm } from './IncomeEntryForm';
import { ModernExpenseForm } from './ModernExpenseForm';

interface EconomyDashboardProps {
  expenses: MindfulExpense[];
  incomes: MindfulIncome[];
  onAddExpense?: () => void;
  onAddIncome?: () => void;
  onTransactionPress?: (transaction: MindfulExpense | MindfulIncome) => void;
}

export const EconomyDashboard: React.FC<EconomyDashboardProps> = ({
  expenses,
  incomes,
  onAddExpense,
  onAddIncome,
  onTransactionPress
}) => {
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'incomes'>('overview');

  // Calcular estadísticas
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncomes = incomes.reduce((sum, i) => sum + i.amount, 0);
  const balance = totalIncomes - totalExpenses;
  const savingsRate = totalIncomes > 0 ? ((totalIncomes - totalExpenses) / totalIncomes) * 100 : 0;

  // Obtener transacciones recientes (combinadas)
  const recentTransactions = [...incomes, ...expenses]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const getTrendIcon = (amount: number, isInflow: boolean) => {
    if (isInflow) {
      return TrendingUp;
    } else {
      return amount > 50 ? TrendingDown : TrendingUp;
    }
  };

  const getTrendColor = (amount: number, isInflow: boolean) => {
    if (isInflow) {
      return Colors.accent; // Marrón para ingresos
    } else {
      return amount > 50 ? Colors.tertiary : Colors.accent; // Gris o marrón para gastos
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Principal */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Balance Total</Text>
              <Text style={[
                styles.balanceAmount,
                balance >= 0 ? styles.positiveBalance : styles.negativeBalance
              ]}>
                ${balance.toFixed(2)}
              </Text>
            </View>
            <View style={styles.trendIndicator}>
              {balance >= 0 ? (
                <TrendingUp style={styles.trendIcon} color={Colors.accent} />
              ) : (
                <TrendingDown style={styles.trendIcon} color={Colors.tertiary} />
              )}
            </View>
          </View>
          
          {/* Métricas principales */}
          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>${totalIncomes.toFixed(0)}</Text>
              <Text style={styles.metricLabel}>Ingresos</Text>
              <View style={styles.metricTrend}>
                <TrendingUp size={16} color={Colors.accent} />
                <Text style={styles.trendText}>+12%</Text>
              </View>
            </View>
            
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>${totalExpenses.toFixed(0)}</Text>
              <Text style={styles.metricLabel}>Gastos</Text>
              <View style={styles.metricTrend}>
                <TrendingDown size={16} color={Colors.tertiary} />
                <Text style={styles.trendText}>-8%</Text>
              </View>
            </View>
            
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{savingsRate.toFixed(1)}%</Text>
              <Text style={styles.metricLabel}>Ahorro</Text>
              <View style={styles.metricTrend}>
                <TrendingUp size={16} color={savingsRate > 20 ? Colors.accent : Colors.tertiary} />
                <Text style={styles.trendText}>
                  {savingsRate > 20 ? '+5%' : '-2%'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Selector de Tabs */}
        <View style={styles.tabSelector}>
          {(['overview', 'expenses', 'incomes'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabOption,
                activeTab === tab && styles.tabOptionActive
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive
              ]}>
                {tab === 'overview' ? 'Resumen' : tab === 'expenses' ? 'Gastos' : 'Ingresos'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contenido según tab activa */}
        {activeTab === 'overview' && (
          <View style={styles.content}>
            {/* Acciones Rápidas */}
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.incomeButton]}
                onPress={onAddIncome}
              >
                <Plus size={20} color={Colors.cardBackground} />
                <Text style={styles.actionButtonText}>Agregar Ingreso</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.expenseButton]}
                onPress={onAddExpense}
              >
                <Minus size={20} color={Colors.cardBackground} />
                <Text style={styles.actionButtonText}>Agregar Gasto</Text>
              </TouchableOpacity>
            </View>

            {/* Resumen Mensual */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Resumen del Mes</Text>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Ingresos Totales</Text>
                  <Text style={styles.summaryValue}>${totalIncomes.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Gastos Totales</Text>
                  <Text style={styles.summaryValue}>${totalExpenses.toFixed(2)}</Text>
                </View>
              </View>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Balance Neto</Text>
                  <Text style={[
                    styles.summaryValue,
                    balance >= 0 ? styles.positiveValue : styles.negativeValue
                  ]}>
                    ${balance.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Tasa de Ahorro</Text>
                  <Text style={[
                    styles.summaryValue,
                    savingsRate > 20 ? styles.positiveValue : savingsRate < 10 ? styles.negativeValue : styles.neutralValue
                  ]}>
                    {savingsRate.toFixed(1)}%
                  </Text>
                </View>
              </View>
            </View>

            {/* Transacciones Recientes */}
            <View style={styles.recentTransactions}>
              <View style={styles.transactionsHeader}>
                <Text style={styles.transactionsTitle}>Actividad Reciente</Text>
                <TouchableOpacity style={styles.seeAllButton}>
                  <Text style={styles.seeAllText}>Ver todo</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.transactionsList}>
                {recentTransactions.map((transaction, index) => {
                  const isInflow = incomes.includes(transaction as any);
                  const Icon = getTrendIcon(transaction.amount, isInflow);
                  
                  return (
                    <TouchableOpacity
                      key={transaction.id}
                      style={styles.transactionItem}
                      onPress={() => onTransactionPress?.(transaction)}
                    >
                      <View style={styles.transactionLeft}>
                        <View style={[
                          styles.transactionIcon,
                          { backgroundColor: isInflow ? Colors.accent : Colors.tertiary }
                        ]}>
                          <Icon size={16} color="#FFFFFF" />
                        </View>
                        <View style={styles.transactionInfo}>
                          <Text style={styles.transactionDescription}>
                            {transaction.description}
                          </Text>
                          <Text style={styles.transactionTime}>
                            {new Date(transaction.timestamp).toLocaleDateString('es-ES', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.transactionRight}>
                        <Text style={[
                          isInflow ? styles.incomeAmount : styles.expenseAmount
                        ]}>
                          {isInflow ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </Text>
                        <Text style={styles.transactionType}>
                          {isInflow ? 'Ingreso' : 'Gasto'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'expenses' && (
          <View style={styles.content}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Gastos Recientes</Text>
              <TouchableOpacity style={styles.addButton} onPress={onAddExpense}>
                <Plus size={16} color={Colors.cardBackground} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.transactionsList}>
              {expenses.slice(0, 10).map((expense) => (
                <TouchableOpacity
                  key={expense.id}
                  style={styles.transactionItem}
                  onPress={() => onTransactionPress?.(expense)}
                >
                  <View style={styles.transactionLeft}>
                    <View style={styles.transactionIcon}>
                      <Wallet size={16} color="#FFFFFF" />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionDescription}>
                        {expense.description}
                      </Text>
                      <Text style={styles.transactionTime}>
                        {new Date(expense.timestamp).toLocaleDateString('es-ES', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text style={styles.expenseAmount}>
                      -${expense.amount.toFixed(2)}
                    </Text>
                    <Text style={styles.transactionType}>Gasto</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'incomes' && (
          <View style={styles.content}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ingresos Recientes</Text>
              <TouchableOpacity style={styles.addButton} onPress={onAddIncome}>
                <Plus size={16} color={Colors.cardBackground} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.transactionsList}>
              {incomes.slice(0, 10).map((income) => (
                <TouchableOpacity
                  key={income.id}
                  style={styles.transactionItem}
                  onPress={() => onTransactionPress?.(income)}
                >
                  <View style={styles.transactionLeft}>
                    <View style={styles.transactionIcon}>
                      <Briefcase size={16} color="#FFFFFF" />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionDescription}>
                        {income.description}
                      </Text>
                      <Text style={styles.transactionTime}>
                        {new Date(income.timestamp).toLocaleDateString('es-ES', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text style={styles.incomeAmount}>
                      +${income.amount.toFixed(2)}
                    </Text>
                    <Text style={styles.transactionType}>Ingreso</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Formularios */}
      <IncomeEntryForm
        isVisible={showIncomeForm}
        onClose={() => setShowIncomeForm(false)}
        onSubmit={(incomeData) => {
          // Aquí iría la lógica para guardar el ingreso
          console.log('Nuevo ingreso:', incomeData);
          setShowIncomeForm(false);
        }}
      />

      <ModernExpenseForm
        isVisible={showExpenseForm}
        onClose={() => setShowExpenseForm(false)}
        onSubmit={(expenseData) => {
          // Aquí iría la lógica para guardar el gasto
          console.log('Nuevo gasto:', expenseData);
          setShowExpenseForm(false);
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  positiveBalance: {
    color: Colors.accent,
  },
  negativeBalance: {
    color: Colors.tertiary,
  },
  trendIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendIcon: {
    width: 24,
    height: 24,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tabOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabOptionActive: {
    backgroundColor: Colors.accent,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.cardBackground,
  },
  content: {
    paddingHorizontal: 20,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  incomeButton: {
    backgroundColor: Colors.accent,
  },
  expenseButton: {
    backgroundColor: Colors.tertiary,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.cardBackground,
  },
  summaryCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  summaryRow: {
    marginBottom: 12,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  positiveValue: {
    color: Colors.accent,
  },
  negativeValue: {
    color: Colors.tertiary,
  },
  neutralValue: {
    color: Colors.textPrimary,
  },
  summaryRow: {
    marginBottom: 12,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  recentTransactions: {
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
    gap: 8,
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
    gap: 4,
  },
  incomeAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.accent,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.tertiary,
  },
  transactionType: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
