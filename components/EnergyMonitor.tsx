import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Battery, Zap, TrendingUp, Activity } from 'lucide-react-native';
import { EnergyLevel } from '../types';
import { Colors, EnergyColors } from '../types/colors';

interface EnergyMonitorProps {
  energyLevel: EnergyLevel;
  userName: string;
  onRecalibrate?: () => void;
}

const getEnergyColor = (level: number): string => {
  if (level >= 75) return '#4CAF50'; // Verde para alta energía
  if (level >= 25) return Colors.primary; // Color base para niveles medios
  return '#F44336'; // Rojo para baja energía
};

const getBatteryIcon = (level: number) => {
  if (level >= 70) return Battery;
  if (level >= 40) return Battery;
  return Battery;
};

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
};

export const EnergyMonitor: React.FC<EnergyMonitorProps> = ({
  energyLevel,
  userName,
  onRecalibrate
}) => {
  const energyColor = getEnergyColor(energyLevel.current);
  const BatteryIcon = getBatteryIcon(energyLevel.current);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>
            {getGreeting()},{' '}
          </Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Activity size={14} color={Colors.accent} />
            <Text style={styles.statText}>Activo</Text>
          </View>
          <View style={styles.statItem}>
            <TrendingUp size={14} color={Colors.accent} />
            <Text style={styles.statText}>+12%</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.energyContainer}
        onPress={onRecalibrate}
        activeOpacity={0.7}
      >
        <View style={styles.energyInfo}>
          <Text style={styles.energyTitle}>Monitor de Batería Humana</Text>
          <View style={styles.energyRow}>
            <BatteryIcon 
              size={32} 
              color={energyColor} 
              fill={energyColor}
            />
            <View style={styles.energyNumbers}>
              <Text style={[styles.energyLevel, { color: energyColor }]}>
                {energyLevel.current}%
              </Text>
              <Text style={styles.energyLabel}>Nivel Actual</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { 
                  width: `${energyLevel.current}%`,
                  backgroundColor: energyColor
                }
              ]} 
            />
          </View>
          <View style={styles.progressMarkers}>
            <Text style={styles.markerText}>0%</Text>
            <Text style={styles.markerText}>50%</Text>
            <Text style={styles.markerText}>100%</Text>
          </View>
        </View>
        
        <View style={styles.energyMetrics}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>8.5h</Text>
            <Text style={styles.metricLabel}>Focus Time</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>92%</Text>
            <Text style={styles.metricLabel}>Eficiencia</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>3</Text>
            <Text style={styles.metricLabel}>Pausas</Text>
          </View>
        </View>
        
        <Text style={styles.recalibrateText}>
          Toca para recalibrar
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 2.22,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.accent,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.accent,
  },
  energyContainer: {
    alignItems: 'center',
  },
  energyInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  energyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 12,
  },
  energyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  energyNumbers: {
    alignItems: 'flex-start',
  },
  energyLevel: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.accent,
  },
  energyLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  markerText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  energyMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
    paddingVertical: 12,
    borderRadius: 8,
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  metricLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  recalibrateText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});
