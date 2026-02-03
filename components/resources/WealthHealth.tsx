import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WealthHealth as WealthHealthType, FinancialStressLevel } from '../../types/resources';
import { ResourcesColors } from '../../types/resourcesColors';

interface WealthHealthProps {
  wealthHealth: WealthHealthType;
  onDetailsPress?: () => void;
}

const getStressColor = (level: FinancialStressLevel): string => {
  switch (level) {
    case 'low': return ResourcesColors.stressLow;
    case 'medium': return ResourcesColors.stressMedium;
    case 'high': return ResourcesColors.stressHigh;
    default: return ResourcesColors.textSecondary;
  }
};

const getStressText = (level: FinancialStressLevel): string => {
  switch (level) {
    case 'low': return 'Baja Carga';
    case 'medium': return 'Carga Moderada';
    case 'high': return 'Alta Carga';
    default: return 'Estable';
  }
};

const getStressEmoji = (level: FinancialStressLevel): string => {
  switch (level) {
    case 'low': return '😌';
    case 'medium': return '😐';
    case 'high': return '😰';
    default: return '😐';
  }
};

export const WealthHealth: React.FC<WealthHealthProps> = ({
  wealthHealth,
  onDetailsPress
}) => {
  const stressColor = getStressColor(wealthHealth.financialStressLevel);
  const stressEmoji = getStressEmoji(wealthHealth.financialStressLevel);

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onDetailsPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>💰</Text>
          </View>
          <Text style={styles.title}>Salud Financiera</Text>
        </View>
        <View style={[styles.stressIndicator, { backgroundColor: stressColor }]}>
          <Text style={styles.stressEmoji}>{stressEmoji}</Text>
          <Text style={styles.stressText}>{getStressText(wealthHealth.financialStressLevel)}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.mainMetric}>
          <Text style={styles.safeToSpendLabel}>Dinero Seguro para Hoy</Text>
          <Text style={styles.safeToSpendAmount}>
            ${wealthHealth.safeToSpend.toFixed(2)}
          </Text>
          <Text style={styles.safeToSpendDescription}>
            Después de cubrir obligaciones mensuales
          </Text>
        </View>

        <View style={styles.secondaryMetrics}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Balance Total</Text>
            <Text style={styles.metricValue}>
              ${wealthHealth.totalBalance.toFixed(0)}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Obligaciones</Text>
            <Text style={[styles.metricValue, { color: stressColor }]}>
              -${wealthHealth.monthlyObligations.toFixed(0)}
            </Text>
          </View>
        </View>
      </View>

      {wealthHealth.stressFactors.length > 0 && (
        <View style={styles.stressFactors}>
          <Text style={styles.factorsTitle}>Factores de estrés:</Text>
          <View style={styles.factorsList}>
            {wealthHealth.stressFactors.slice(0, 2).map((factor, index) => (
              <Text key={index} style={styles.factorItem}>• {factor}</Text>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ResourcesColors.surface,
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: ResourcesColors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
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
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ResourcesColors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: ResourcesColors.textPrimary,
  },
  stressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stressEmoji: {
    fontSize: 14,
  },
  stressText: {
    fontSize: 12,
    fontWeight: '600',
    color: ResourcesColors.surface,
  },
  content: {
    marginBottom: 16,
  },
  mainMetric: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: ResourcesColors.background,
    borderRadius: 16,
    marginBottom: 16,
  },
  safeToSpendLabel: {
    fontSize: 14,
    color: ResourcesColors.textSecondary,
    marginBottom: 8,
  },
  safeToSpendAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: ResourcesColors.primary,
    marginBottom: 8,
  },
  safeToSpendDescription: {
    fontSize: 12,
    color: ResourcesColors.textLight,
    textAlign: 'center',
  },
  secondaryMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: ResourcesColors.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '600',
    color: ResourcesColors.textPrimary,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: ResourcesColors.border,
  },
  stressFactors: {
    backgroundColor: ResourcesColors.background,
    padding: 12,
    borderRadius: 12,
  },
  factorsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: ResourcesColors.textSecondary,
    marginBottom: 6,
  },
  factorsList: {
    gap: 2,
  },
  factorItem: {
    fontSize: 11,
    color: ResourcesColors.textLight,
  },
});
