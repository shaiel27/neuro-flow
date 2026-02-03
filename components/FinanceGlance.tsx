import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Wallet, TrendingDown, DollarSign, Plus, Minus, Briefcase } from 'lucide-react-native';
import { FinanceMetrics } from '../types';
import { Colors, FinanceColors } from '../types/colors';

interface FinanceGlanceProps {
  metrics: FinanceMetrics;
  onQuickAddExpense?: () => void;
  onQuickAddIncome?: () => void;
}

export const FinanceGlance: React.FC<FinanceGlanceProps> = ({
  metrics,
  onQuickAddExpense,
  onQuickAddIncome
}) => {
  const budgetPercentage = (metrics.remainingBudget / metrics.dailyBudget) * 100;
  const isOverBudget = metrics.todayExpenses > metrics.dailyBudget;

  const getProgressColor = () => {
    if (budgetPercentage > 80) return FinanceColors.positive; // Verde - bien
    if (budgetPercentage > 50) return FinanceColors.neutral; // Naranja - atención
    return FinanceColors.caution; // Rojo - peligro
  };

  const getQuickAddColor = () => {
    return FinanceColors.neutral; // Naranja de la barra para consistencia
  };

  const getIconColor = () => {
    return FinanceColors.neutral; // Naranja para iconos principales
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Wallet size={20} color={getIconColor()} />
          <Text style={styles.title}>Bienestar Financiero</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.incomeButton]}
            onPress={onQuickAddIncome}
          >
            <Briefcase size={16} color={Colors.cardBackground} />
            <Text style={styles.actionButtonText}>Ingreso</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.expenseButton]}
            onPress={onQuickAddExpense}
          >
            <Minus size={16} color={Colors.cardBackground} />
            <Text style={styles.actionButtonText}>Gasto</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <TrendingDown size={14} color={isOverBudget ? FinanceColors.caution : FinanceColors.neutral} />
            <Text style={styles.metricLabel}>Gastos hoy</Text>
          </View>
          <Text style={[styles.metricValue, isOverBudget && styles.negativeValue]}>
            -${metrics.todayExpenses.toFixed(2)}
          </Text>
        </View>

        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <DollarSign size={14} color={FinanceColors.positive} />
            <Text style={styles.metricLabel}>Disponible</Text>
          </View>
          <Text style={styles.metricValue}>
            ${metrics.safeToSpend.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.budgetContainer}>
        <Text style={styles.budgetLabel}>Presupuesto restante</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${Math.min(budgetPercentage, 100)}%`,
                backgroundColor: getProgressColor()
              }
            ]} 
          />
        </View>
        <View style={styles.budgetInfo}>
          <Text style={styles.budgetText}>
            ${metrics.remainingBudget.toFixed(2)} / ${metrics.dailyBudget.toFixed(2)}
          </Text>
          <Text style={styles.percentageText}>
            {budgetPercentage.toFixed(0)}%
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 14,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 2.22,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  quickAddButton: {
    backgroundColor: Colors.accent,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  incomeButton: {
    backgroundColor: Colors.accent,
  },
  expenseButton: {
    backgroundColor: Colors.tertiary,
  },
  actionButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.cardBackground,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  metricItem: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 10,
    borderRadius: 10,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  metricLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  negativeValue: {
    color: FinanceColors.caution, // Rojo para valores negativos
  },
  budgetContainer: {
    backgroundColor: Colors.surface,
    padding: 10,
    borderRadius: 10,
  },
  budgetLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  budgetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  percentageText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
