import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, Droplets, TrendingUp, TrendingDown, Brain, Wallet } from 'lucide-react-native';
import { Colors } from '../types/colors';

interface DayData {
  day: string;
  completed: boolean;
  energyLevel: number;
  balanceScore: number;
}

interface BalanceWidgetProps {
  currentStreak: number;
  weeklyData: DayData[];
  balanceStatus: 'optimal' | 'warning' | 'recovery';
  energyVsFinanceData: { energy: number; finance: number }[];
  xaiMessage?: string;
  onExpand?: () => void;
}

export const BalanceWidget: React.FC<BalanceWidgetProps> = ({
  currentStreak,
  weeklyData,
  balanceStatus,
  energyVsFinanceData,
  xaiMessage,
  onExpand
}) => {
  const getBalanceColor = (status: string) => {
    switch (status) {
      case 'optimal': return '#81C784'; // Verde suave
      case 'warning': return '#FFB74D'; // Amarillo advertencia
      case 'recovery': return '#9E9E9E'; // Gris recuperación
      default: return Colors.primary;
    }
  };

  const getBalanceGradient = () => {
    return {
      from: '#81C784',
      to: '#64B5F6',
    };
  };

  const renderBalanceCircle = () => {
    const percentage = weeklyData.reduce((acc, day) => acc + day.balanceScore, 0) / weeklyData.length;
    const radius = 32;
    const strokeWidth = 6;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <View style={styles.circleContainer}>
        <View style={[styles.balanceCircle, { borderColor: getBalanceColor(balanceStatus) }]}>
          <View style={styles.innerCircle}>
            <Text style={[styles.percentageText, { color: getBalanceColor(balanceStatus) }]}>
              {Math.round(percentage)}%
            </Text>
            <Text style={styles.balanceLabel}>Balance</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderWeeklyStreak = () => {
    return (
      <View style={styles.streakContainer}>
        <Text style={styles.streakTitle}>Racha de Flujo</Text>
        <View style={styles.daysContainer}>
          {weeklyData.map((day, index) => (
            <View key={index} style={styles.dayItem}>
              <View style={[
                styles.dayCircle,
                { 
                  backgroundColor: day.completed ? getBalanceGradient().from : Colors.border,
                  borderColor: day.completed ? getBalanceGradient().to : Colors.border
                }
              ]}>
                {day.completed ? (
                  <Droplets size={12} color={Colors.cardBackground} />
                ) : (
                  <Text style={styles.dayText}>{day.day.charAt(0)}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.streakCount}>
          {currentStreak} días equilibrados
        </Text>
      </View>
    );
  };

  const renderBalanceInsight = () => {
    const avgEnergy = energyVsFinanceData.reduce((acc, d) => acc + d.energy, 0) / energyVsFinanceData.length;
    const avgFinance = energyVsFinanceData.reduce((acc, d) => acc + d.finance, 0) / energyVsFinanceData.length;
    
    return (
      <View style={styles.insightContainer}>
        <Text style={styles.insightTitle}>Equilibrio Semanal</Text>
        <View style={styles.insightMetrics}>
          <View style={styles.insightMetric}>
            <Brain size={16} color="#FF6B35" />
            <View>
              <Text style={styles.insightValue}>{Math.round(avgEnergy)}%</Text>
              <Text style={styles.insightLabel}>Energía Promedio</Text>
            </View>
          </View>
          <View style={styles.insightDivider} />
          <View style={styles.insightMetric}>
            <Wallet size={16} color="#FF6B35" />
            <View>
              <Text style={styles.insightValue}>{Math.round(avgFinance)}%</Text>
              <Text style={styles.insightLabel}>Salud Financiera</Text>
            </View>
          </View>
        </View>
        <View style={styles.balanceIndicator}>
          <View style={[
            styles.balanceDot,
            { backgroundColor: avgEnergy > 60 && avgFinance > 60 ? Colors.primary : Colors.secondary }
          ]} />
          <Text style={styles.balanceText}>
            {avgEnergy > 60 && avgFinance > 60 
              ? 'Excelente equilibrio esta semana' 
              : 'Enfócate en descansar y ajustar gastos'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onExpand}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Racha de Flujo</Text>
        <View style={[styles.statusBadge, { backgroundColor: getBalanceColor(balanceStatus) }]}>
          <Text style={styles.statusText}>
            {balanceStatus === 'optimal' ? 'Equilibrado' : 
             balanceStatus === 'warning' ? 'Atención' : 'Recuperación'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {renderBalanceCircle()}
        {renderWeeklyStreak()}
      </View>

      {renderBalanceInsight()}

      {xaiMessage && (
        <View style={styles.xaiContainer}>
          <Text style={styles.xaiMessage}>{xaiMessage}</Text>
        </View>
      )}
    </TouchableOpacity>
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
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.cardBackground,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  circleContainer: {
    alignItems: 'center',
  },
  balanceCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '700',
  },
  balanceLabel: {
    fontSize: 9,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  streakContainer: {
    flex: 1,
    marginLeft: 16,
  },
  streakTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dayItem: {
    alignItems: 'center',
    flex: 1,
  },
  dayCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  dayText: {
    fontSize: 9,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  dayLabel: {
    fontSize: 8,
    color: Colors.textLight,
  },
  streakCount: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  sparklineContainer: {
    marginTop: 12,
  },
  insightContainer: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  insightMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  insightValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  insightLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  insightDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },
  balanceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  balanceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  balanceText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    flex: 1,
  },
  xaiContainer: {
    backgroundColor: Colors.surface,
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  xaiMessage: {
    fontSize: 11,
    color: Colors.textPrimary,
    lineHeight: 14,
    fontStyle: 'italic',
  },
});
