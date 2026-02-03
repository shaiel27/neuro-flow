import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Lightbulb, X, Brain } from 'lucide-react-native';
import { XAIInsight } from '../types';
import { Colors } from '../types/colors';

interface XAIInsightProps {
  insight: XAIInsight;
  onDismiss?: () => void;
}

export const XAIInsightComponent: React.FC<XAIInsightProps> = ({
  insight,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(1));

  const handleDismiss = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
      onDismiss?.();
    });
  };

  const getInsightIcon = (type: XAIInsight['type']) => {
    switch (type) {
      case 'reschedule':
        return Lightbulb;
      case 'energy':
        return Brain;
      case 'priority':
        return Lightbulb;
      default:
        return Lightbulb;
    }
  };

  const getInsightColor = (type: XAIInsight['type']): string => {
    switch (type) {
      case 'reschedule': return Colors.primary;
      case 'energy': return Colors.secondary;
      case 'priority': return Colors.tertiary;
      default: return Colors.textLight;
    }
  };

  if (!isVisible) return null;

  const InsightIcon = getInsightIcon(insight.type);
  const insightColor = getInsightColor(insight.type);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.insightCard}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <InsightIcon size={20} color={insightColor} />
            <Text style={[styles.insightType, { color: insightColor }]}>
              Insight IA
            </Text>
          </View>
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={handleDismiss}
            activeOpacity={0.7}
          >
            <X size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.message}>
          {insight.message}
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.timestamp}>
            {new Date(insight.timestamp).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  insightCard: {
    backgroundColor: Colors.surface,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    borderRadius: 12,
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
    marginBottom: 12,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  insightType: {
    fontSize: 14,
    fontWeight: '600',
  },
  dismissButton: {
    padding: 4,
    borderRadius: 4,
  },
  message: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 12,
  },
  footer: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
});
