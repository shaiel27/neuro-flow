import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StressProjection as StressProjectionType, FinancialStressLevel } from '../../types/resources';
import { ResourcesColors } from '../../types/resourcesColors';

interface StressProjectionProps {
  projections: StressProjectionType[];
  onDayPress?: (date: string) => void;
}

const getStressColor = (level: FinancialStressLevel): string => {
  switch (level) {
    case 'low': return ResourcesColors.stressLow;
    case 'medium': return ResourcesColors.stressMedium;
    case 'high': return ResourcesColors.stressHigh;
    default: return ResourcesColors.textSecondary;
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

const getStressText = (level: FinancialStressLevel): string => {
  switch (level) {
    case 'low': return 'Seguro';
    case 'medium': return 'Atención';
    case 'high': return 'Crítico';
    default: return 'Estable';
  }
};

export const StressProjection: React.FC<StressProjectionProps> = ({
  projections,
  onDayPress
}) => {
  const getOverallStress = (): FinancialStressLevel => {
    const highStressDays = projections.filter(p => p.stressLevel === 'high').length;
    const mediumStressDays = projections.filter(p => p.stressLevel === 'medium').length;
    
    if (highStressDays >= 3) return 'high';
    if (mediumStressDays >= 4) return 'medium';
    return 'low';
  };

  const overallStress = getOverallStress();
  const stressEmoji = getStressEmoji(overallStress);
  const stressColor = getStressColor(overallStress);

  const getBarHeight = (value: number, maxValue: number, containerHeight: number) => {
    return (value / maxValue) * containerHeight;
  };

  const maxExpense = Math.max(...projections.map(p => p.fixedExpenses));
  const minBalance = Math.min(...projections.map(p => p.projectedBalance));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleEmoji}>📅</Text>
          <Text style={styles.title}>Proyección de Estrés</Text>
        </View>
        <View style={[styles.overallStress, { backgroundColor: stressColor }]}>
          <Text style={styles.overallStressEmoji}>{stressEmoji}</Text>
          <Text style={styles.overallStressText}>
            {getStressText(overallStress)}
          </Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        Próximos 7 días - Tus necesidades básicas están cubiertas para bajar el cortisol
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chartContainer}>
          {projections.map((projection) => {
            const stressEmoji = getStressEmoji(projection.stressLevel);
            const stressColor = getStressColor(projection.stressLevel);
            const expenseHeight = getBarHeight(projection.fixedExpenses, maxExpense, 80);
            const balanceHeight = getBarHeight(
              Math.abs(projection.projectedBalance - minBalance), 
              Math.abs(minBalance), 
              80
            );

            return (
              <TouchableOpacity
                key={projection.date}
                style={styles.dayContainer}
                onPress={() => onDayPress?.(projection.date)}
                activeOpacity={0.7}
              >
                <View style={styles.dayHeader}>
                  <Text style={styles.dayName}>{projection.dayName}</Text>
                  <Text style={styles.dayDate}>{projection.date}</Text>
                  <Text style={styles.stressEmoji}>{stressEmoji}</Text>
                </View>

                <View style={styles.chartArea}>
                  <View style={styles.barsContainer}>
                    <View style={styles.barGroup}>
                      <View style={styles.barLabel}>
                        <Text style={styles.barLabelText}>Gastos</Text>
                      </View>
                      <View style={[styles.expenseBar, { height: expenseHeight }]}>
                        <Text style={styles.barValue}>
                          ${projection.fixedExpenses}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.barGroup}>
                      <View style={styles.barLabel}>
                        <Text style={styles.barLabelText}>Balance</Text>
                      </View>
                      <View style={[
                        styles.balanceBar, 
                        { 
                          height: balanceHeight,
                          backgroundColor: projection.projectedBalance > 0 
                            ? ResourcesColors.stressLow 
                            : ResourcesColors.stressHigh
                        }
                      ]}>
                        <Text style={styles.barValue}>
                          ${Math.abs(projection.projectedBalance)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.dayFooter}>
                  <Text style={[
                    styles.stressLevel,
                    { color: stressColor }
                  ]}>
                    {getStressText(projection.stressLevel)}
                  </Text>
                  {projection.factors.length > 0 && (
                    <Text style={styles.factorHint}>
                      {projection.factors.length} factores
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.insights}>
        <Text style={styles.insightsTitle}>💡 Insights para reducir cortisol</Text>
        <View style={styles.insightsList}>
          {projections.filter(p => p.stressLevel === 'high').length > 0 && (
            <Text style={styles.insightItem}>
              • {projections.filter(p => p.stressLevel === 'high').length} días con estrés financiero alto
            </Text>
          )}
          {projections.filter(p => p.stressLevel === 'low').length >= 5 && (
            <Text style={styles.insightItem}>
              • Mayoría de días con finanzas estables - Buen momento para invertir en ti
            </Text>
          )}
          <Text style={styles.insightItem}>
            • Gastos fijos promedio: ${(projections.reduce((acc, p) => acc + p.fixedExpenses, 0) / projections.length).toFixed(0)}/día
          </Text>
          <Text style={styles.insightItem}>
            • Balance mínimo proyectado: ${Math.min(...projections.map(p => p.projectedBalance)).toFixed(0)}
          </Text>
        </View>
      </View>
    </View>
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
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleEmoji: {
    fontSize: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: ResourcesColors.textPrimary,
  },
  overallStress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  overallStressEmoji: {
    fontSize: 16,
  },
  overallStressText: {
    fontSize: 12,
    fontWeight: '600',
    color: ResourcesColors.surface,
  },
  subtitle: {
    fontSize: 12,
    color: ResourcesColors.textSecondary,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  chartContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
  },
  dayContainer: {
    alignItems: 'center',
    backgroundColor: ResourcesColors.background,
    borderRadius: 12,
    padding: 8,
    minWidth: 90,
  },
  dayHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    color: ResourcesColors.textPrimary,
    marginBottom: 2,
  },
  dayDate: {
    fontSize: 10,
    color: ResourcesColors.textSecondary,
    marginBottom: 4,
  },
  stressEmoji: {
    fontSize: 14,
  },
  chartArea: {
    height: 140,
    marginBottom: 8,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '100%',
    gap: 4,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
  },
  barLabel: {
    marginBottom: 4,
  },
  barLabelText: {
    fontSize: 8,
    color: ResourcesColors.textSecondary,
  },
  expenseBar: {
    backgroundColor: ResourcesColors.wantColor,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: 20,
  },
  balanceBar: {
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: 20,
  },
  barValue: {
    fontSize: 8,
    fontWeight: '600',
    color: ResourcesColors.surface,
  },
  dayFooter: {
    alignItems: 'center',
  },
  stressLevel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  factorHint: {
    fontSize: 8,
    color: ResourcesColors.textLight,
  },
  insights: {
    backgroundColor: ResourcesColors.background,
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: ResourcesColors.textPrimary,
    marginBottom: 8,
  },
  insightsList: {
    gap: 4,
  },
  insightItem: {
    fontSize: 12,
    color: ResourcesColors.textSecondary,
  },
});
