import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TrendingUp, Shield, AlertTriangle, CheckCircle } from 'lucide-react-native';
import { StressProjection as StressProjectionType, FinancialLoad } from '../types';
import { Colors, FinancialLoadColors } from '../types/colors';

interface StressProjectionProps {
  projection: StressProjectionType;
}

const getDayName = (date: Date): string => {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  return days[date.getDay()];
};

const getLoadIcon = (load: FinancialLoad) => {
  switch (load) {
    case 'low': return CheckCircle;
    case 'medium': return Shield;
    case 'high': return AlertTriangle;
    default: return Shield;
  }
};

const getLoadLabel = (load: FinancialLoad): string => {
  switch (load) {
    case 'low': return 'Bajo';
    case 'medium': return 'Medio';
    case 'high': return 'Alto';
    default: return 'Medio';
  }
};

export const StressProjection: React.FC<StressProjectionProps> = ({
  projection
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <TrendingUp size={20} color={Colors.accent} />
          <Text style={styles.title}>Proyección de Estrés</Text>
        </View>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            {projection.safeDays} días seguros
          </Text>
        </View>
      </View>

      {/* Resumen semanal */}
      <View style={styles.weeklySummary}>
        <View style={styles.weeklyHeader}>
          <Text style={styles.weeklyTitle}>Estrés Semanal</Text>
          <View style={[
            styles.weeklyIndicator,
            { backgroundColor: FinancialLoadColors[projection.weeklyStress] }
          ]}>
            <Text style={styles.weeklyIndicatorText}>
              {getLoadLabel(projection.weeklyStress)}
            </Text>
          </View>
        </View>
        
        <Text style={styles.weeklyDescription}>
          {projection.weeklyStress === 'high' 
            ? 'Alta vigilancia recomendada esta semana'
            : projection.weeklyStress === 'medium'
            ? 'Mantén el equilibrio en tus gastos'
            : 'Buen momento para tranquilidad financiera'
          }
        </Text>
      </View>

      {/* Proyección diaria */}
      <View style={styles.projectionContainer}>
        <Text style={styles.projectionTitle}>Próximos 7 días</Text>
        
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
          contentContainerStyle={styles.scrollContent}
        >
          {projection.daily.map((day, index) => {
            const LoadIcon = getLoadIcon(day.stressLevel);
            const isToday = new Date(day.date).toDateString() === today.toDateString();
            const dayDate = new Date(day.date);
            
            return (
              <View
                key={index}
                style={[
                  styles.dayCard,
                  isToday && styles.todayCard
                ]}
              >
                <Text style={[
                  styles.dayName,
                  isToday && styles.todayText
                ]}>
                  {getDayName(dayDate)}
                </Text>
                
                <Text style={[
                  styles.dayDate,
                  isToday && styles.todayText
                ]}>
                  {dayDate.getDate()}
                </Text>

                <View style={styles.expenseContainer}>
                  <Text style={styles.expenseAmount}>
                    ${day.expectedExpenses.toFixed(0)}
                  </Text>
                  <Text style={styles.expenseLabel}>
                    {day.expectedExpenses > 0 ? 'gastos' : 'libre'}
                  </Text>
                </View>

                <View style={[
                  styles.stressIndicator,
                  { backgroundColor: FinancialLoadColors[day.stressLevel] }
                ]}>
                  <LoadIcon size={16} color={Colors.cardBackground} />
                </View>

                <Text style={[
                  styles.stressLabel,
                  { color: FinancialLoadColors[day.stressLevel] }
                ]}>
                  {getLoadLabel(day.stressLevel)}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Insight */}
      <View style={styles.insightContainer}>
        <Text style={styles.insightTitle}>Consejo Zen</Text>
        <Text style={styles.insightText}>
          {projection.safeDays >= 5
            ? '🌿 Tienes varios días de tranquilidad financiera. Aprovecha para planificar metas a largo plazo.'
            : projection.safeDays >= 3
            ? '⚖️ Mantén el equilibrio. Los días próximos requieren atención moderada.'
            : '🧘 Prioriza tu paz mental. Considera posponer gastos no esenciales.'
          }
        </Text>
      </View>

      {/* Barra de progreso de seguridad */}
      <View style={styles.safetyBarContainer}>
        <Text style={styles.safetyBarTitle}>Días de Seguridad</Text>
        <View style={styles.safetyBar}>
          <View style={styles.safetyBarBackground}>
            {Array.from({ length: 7 }, (_, index) => (
              <View
                key={index}
                style={[
                  styles.safetyDay,
                  index < projection.safeDays && styles.safeDay
                ]}
              >
                <Text style={[
                  styles.safetyDayText,
                  index < projection.safeDays && styles.safeDayText
                ]}>
                  {index + 1}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <Text style={styles.safetyBarSubtext}>
          {projection.safeDays} de 7 días con baja carga financiera
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
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  summaryContainer: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.positive,
  },
  weeklySummary: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  weeklyTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  weeklyIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  weeklyIndicatorText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.cardBackground,
  },
  weeklyDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  projectionContainer: {
    marginBottom: 16,
  },
  projectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  horizontalScroll: {
    marginHorizontal: -4,
  },
  scrollContent: {
    paddingHorizontal: 4,
  },
  dayCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    width: 80,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  todayCard: {
    backgroundColor: Colors.primary,
    borderColor: Colors.accent,
    borderWidth: 2,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  dayDate: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  todayText: {
    color: Colors.accent,
  },
  expenseContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  expenseLabel: {
    fontSize: 10,
    color: Colors.textLight,
  },
  stressIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stressLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  insightContainer: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
    marginBottom: 16,
  },
  insightTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  insightText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  safetyBarContainer: {
    marginBottom: 8,
  },
  safetyBarTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  safetyBar: {
    marginBottom: 8,
  },
  safetyBarBackground: {
    flexDirection: 'row',
    gap: 4,
  },
  safetyDay: {
    flex: 1,
    height: 24,
    backgroundColor: Colors.border,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeDay: {
    backgroundColor: Colors.positive,
  },
  safetyDayText: {
    fontSize: 10,
    color: Colors.textLight,
    fontWeight: '500',
  },
  safeDayText: {
    color: Colors.cardBackground,
  },
  safetyBarSubtext: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
