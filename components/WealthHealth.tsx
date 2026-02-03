import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Wallet, Shield, TrendingUp, Brain } from 'lucide-react-native';
import { WealthHealth as WealthHealthType, FinancialLoad } from '../types';
import { Colors, FinancialLoadColors } from '../types/colors';

interface WealthHealthProps {
  wealthHealth: WealthHealthType;
  onAddExpense?: () => void;
}

const getFinancialLoadLabel = (load: FinancialLoad): string => {
  switch (load) {
    case 'low': return 'Baja';
    case 'medium': return 'Media';
    case 'high': return 'Alta';
    default: return 'Media';
  }
};

const getFinancialLoadDescription = (load: FinancialLoad): string => {
  switch (load) {
    case 'low': return 'Tranquilidad financiera';
    case 'medium': return 'Atención moderada';
    case 'high': return 'Alta vigilancia';
    default: return 'Equilibrio estable';
  }
};

export const WealthHealth: React.FC<WealthHealthProps> = ({
  wealthHealth,
  onAddExpense
}) => {
  const loadColor = FinancialLoadColors[wealthHealth.financialLoad];
  const safeToSpendPercentage = (wealthHealth.safeToSpend / wealthHealth.totalBalance) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Shield size={20} color={Colors.accent} />
          <Text style={styles.title}>Salud Financiera</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={onAddExpense}
          activeOpacity={0.7}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Safe-to-Spend Principal */}
      <View style={styles.mainMetric}>
        <Text style={styles.mainLabel}>Dinero Seguro para Hoy</Text>
        <Text style={styles.mainValue}>
          ${wealthHealth.safeToSpend.toFixed(2)}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${Math.min(safeToSpendPercentage, 100)}%`,
                backgroundColor: Colors.positive
              }
            ]} 
          />
        </View>
      </View>

      {/* Carga Mental Financiera */}
      <View style={styles.mentalLoadContainer}>
        <View style={styles.loadHeader}>
          <Brain size={16} color={loadColor} />
          <Text style={styles.loadTitle}>Carga Mental Financiera</Text>
        </View>
        <View style={styles.loadContent}>
          <View style={[styles.loadIndicator, { backgroundColor: loadColor }]}>
            <Text style={styles.loadLevel}>
              {getFinancialLoadLabel(wealthHealth.financialLoad)}
            </Text>
          </View>
          <Text style={styles.loadDescription}>
            {getFinancialLoadDescription(wealthHealth.financialLoad)}
          </Text>
        </View>
      </View>

      {/* Métricas secundarias */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <View style={styles.metricIcon}>
            <TrendingUp size={14} color={Colors.accentLight} />
          </View>
          <Text style={styles.metricLabel}>Balance Total</Text>
          <Text style={styles.metricValue}>
            ${wealthHealth.totalBalance.toFixed(0)}
          </Text>
        </View>

        <View style={styles.metricItem}>
          <View style={styles.metricIcon}>
            <Wallet size={14} color={Colors.caution} />
          </View>
          <Text style={styles.metricLabel}>Pagos Próximos</Text>
          <Text style={styles.metricValue}>
            ${wealthHealth.upcomingPayments.toFixed(0)}
          </Text>
        </View>
      </View>

      {/* Insight */}
      <View style={styles.insightContainer}>
        <Text style={styles.insightText}>
          {wealthHealth.financialLoad === 'high' 
            ? 'Considera posponer gastos no esenciales esta semana'
            : wealthHealth.financialLoad === 'medium'
            ? 'Mantén el equilibrio entre necesidades y deseos'
            : 'Buen momento para inversiones personales o ahorro'
          }
        </Text>
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
    padding: 16,
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
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
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
  addButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.cardBackground,
    lineHeight: 20,
  },
  mainMetric: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  mainValue: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.positive,
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  mentalLoadContainer: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  loadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  loadTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  loadContent: {
    alignItems: 'center',
  },
  loadIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  loadLevel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.cardBackground,
  },
  loadDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 12,
  },
  metricIcon: {
    marginBottom: 6,
  },
  metricLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  insightContainer: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  insightText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
