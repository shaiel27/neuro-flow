import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Brain, Clock, Coffee, BarChart3, Zap, Wallet, DollarSign, TrendingUp } from 'lucide-react-native';
import { TimelineItem, CognitiveLoad } from '../types';
import { Colors, CognitiveLoadColors } from '../types/colors';

interface TaskCardProps {
  item: TimelineItem;
  isCurrent?: boolean;
  showTimeline?: boolean;
}

const getFinanceColor = (category?: string, amount?: number): string => {
  if (amount && amount > 0) return '#4CAF50'; // Verde para ingresos
  if (amount && amount < 0) return '#FF9800'; // Naranja para gastos
  return '#9C27B0'; // Púrpura para pagos
};

const getCognitiveLoadColor = (load: CognitiveLoad, itemType?: string, category?: string, amount?: number): string => {
  if (itemType === 'finance') {
    return getFinanceColor(category, amount);
  }
  
  switch (load) {
    case 'high': return '#F44336'; // Rojo vibrante para alta carga
    case 'medium': return '#FF9800'; // Naranja para media carga
    case 'low': return '#4CAF50'; // Verde para baja carga
    case 'rest': return '#2196F3'; // Azul para recuperación
    default: return Colors.textLight;
  }
};

const getFinanceIcon = (category?: string) => {
  switch (category) {
    case 'payment':
      return Wallet;
    case 'income':
      return TrendingUp;
    case 'expense':
      return DollarSign;
    default:
      return Wallet;
  }
};

const getCognitiveLoadIcon = (load: CognitiveLoad, itemType?: string) => {
  if (itemType === 'finance') {
    return getFinanceIcon('payment'); // Default finance icon
  }
  
  switch (load) {
    case 'high':
      return BarChart3;
    case 'medium':
      return Brain;
    case 'low':
      return Zap;
    case 'rest':
      return Coffee;
    default:
      return Brain;
  }
};

const getCognitiveLoadText = (load: CognitiveLoad): string => {
  switch (load) {
    case 'high': return 'Alta Carga';
    case 'medium': return 'Media Carga';
    case 'low': return 'Baja Carga';
    case 'rest': return 'Recuperación';
    default: return 'Normal';
  }
};

const getFinanceCategoryText = (category?: string): string => {
  switch (category) {
    case 'payment': return 'Pago';
    case 'income': return 'Ingreso';
    case 'expense': return 'Gasto';
    default: return 'Finanzas';
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({ 
  item, 
  isCurrent = false, 
  showTimeline = true 
}) => {
  const isFinance = item.type === 'finance';
  const cognitiveColor = getCognitiveLoadColor(
    item.cognitiveLoad, 
    item.type, 
    isFinance ? (item as any).category : undefined, 
    isFinance ? (item as any).amount : undefined
  );
  const CognitiveIcon = getCognitiveLoadIcon(item.cognitiveLoad, item.type);

  return (
    <View style={[styles.container, isCurrent && styles.currentContainer]}>
      {showTimeline && (
        <View style={styles.timelineContainer}>
          <View style={[styles.timelineDot, { backgroundColor: cognitiveColor }]} />
          <View style={[styles.timelineLine, { backgroundColor: Colors.border }]} />
        </View>
      )}
      
      <View style={[styles.card, isCurrent && styles.currentCard]}>
        <View style={styles.header}>
          <View style={styles.timeContainer}>
            <Text style={[styles.time, isCurrent && styles.currentTime]}>
              {item.time}
            </Text>
            <View style={[styles.timeBar, { backgroundColor: cognitiveColor }]} />
          </View>
          <View style={styles.durationContainer}>
            <Clock size={14} color={Colors.textLight} />
            <Text style={styles.duration}>
              {isFinance ? `$${Math.abs((item as any).amount || 0).toFixed(2)}` : `${(item as any).duration || 0} min`}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.title, isCurrent && styles.currentTitle]}>
          {item.title}
        </Text>
        
        {item.description && (
          <Text style={[styles.description, isCurrent && styles.currentDescription]}>
            {item.description}
          </Text>
        )}
        
        <View style={styles.footer}>
          <View style={styles.cognitiveLoad}>
            <CognitiveIcon size={16} color={cognitiveColor} />
            <Text style={[styles.cognitiveLoadText, { color: cognitiveColor }]}>
              {isFinance ? getFinanceCategoryText((item as any).category) : getCognitiveLoadText(item.cognitiveLoad)}
            </Text>
          </View>
          
          <View style={styles.energyIndicator}>
            <View style={[styles.energyDot, { backgroundColor: cognitiveColor }]} />
            <Text style={styles.energyText}>
              {isFinance ? 'Finanzas' : (item.cognitiveLoad === 'rest' ? 'Recarga' : 'Consumo')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    position: 'relative',
  },
  timelineContainer: {
    alignItems: 'center',
    marginRight: 16,
    paddingTop: 8,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 8,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.02,
    shadowRadius: 1.22,
    elevation: 2,
  },
  currentContainer: {
    marginBottom: 20,
  },
  currentCard: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeContainer: {
    flex: 1,
  },
  time: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textLight,
  },
  currentTime: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  timeBar: {
    height: 3,
    width: 40,
    borderRadius: 2,
    marginTop: 4,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  duration: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
    lineHeight: 22,
  },
  currentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  currentDescription: {
    fontSize: 15,
    color: Colors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cognitiveLoad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cognitiveLoadText: {
    fontSize: 12,
    fontWeight: '500',
  },
  energyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  energyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  energyText: {
    fontSize: 11,
    color: Colors.textLight,
    fontWeight: '500',
  },
});
