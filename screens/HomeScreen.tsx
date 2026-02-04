import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EnergyMonitor } from '../components/EnergyMonitor';
import { TaskCard } from '../components/TaskCard';
import { XAIInsightComponent } from '../components/XAIInsight';
import { FinanceGlance } from '../components/FinanceGlance';
import { BalanceWidget } from '../components/BalanceWidget';
import { mockTimeline, mockEnergyLevel, mockXAIInsight, getGreeting, mockFinanceMetrics, mockBalanceData } from '../types/mockData';
import { XAIInsight, TimelineItem } from '../types';
import { Colors } from '../types/colors';
import { Brain, TrendingUp, AlertCircle, Clock, Target, Zap, Activity, Calendar } from 'lucide-react-native';

type TabType = 'flow' | 'resources' | 'insights' | 'profile';

const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [energyLevel, setEnergyLevel] = useState(mockEnergyLevel);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(mockTimeline);
  const [insight, setInsight] = useState<XAIInsight | null>(mockXAIInsight);
  const [userName] = useState('Alex');
  const [activeTab, setActiveTab] = useState<TabType>('flow');
  
  // Estados mejorados para funcionalidad avanzada
  const [todayStats, setTodayStats] = useState({
    tasksCompleted: 0,
    totalTasks: 0,
    energySpent: 0,
    focusTime: 0
  });
  const [quickActions, setQuickActions] = useState([
    { id: '1', title: 'Pausa Inteligente', icon: Clock, color: Colors.accent },
    { id: '2', title: 'Modo Focus', icon: Brain, color: Colors.tertiary },
    { id: '3', title: 'Resumen Día', icon: Activity, color: Colors.primary }
  ]);

  useEffect(() => {
    calculateTodayStats();
  }, [timelineItems, energyLevel]);

  const calculateTodayStats = () => {
    const completed = timelineItems.filter(item => item.status === 'completed').length;
    const total = timelineItems.length;
    const energyUsage = 100 - energyLevel.current;
    const focusMinutes = completed * 25; // Estimación: 25 min por tarea
    
    setTodayStats({
      tasksCompleted: completed,
      totalTasks: total,
      energySpent: energyUsage,
      focusTime: focusMinutes
    });
  };

  const handleRecalibrate = () => {
    console.log('Recalibrando energía...');
    const newLevel = Math.floor(Math.random() * 40) + 60;
    setEnergyLevel({
      current: newLevel,
      timestamp: new Date()
    });
    console.log(`Nueva energía: ${newLevel}%`);
  };

  const handleDismissInsight = () => {
    setInsight(null);
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case '1':
        // Pausa Inteligente
        setEnergyLevel(prev => ({
          ...prev,
          current: Math.min(prev.current + 15, 100)
        }));
        break;
      case '2':
        // Modo Focus
        console.log('Activando Modo Focus');
        break;
      case '3':
        // Resumen Día
        console.log('Mostrando Resumen del Día');
        break;
    }
  };

  const getEnergyStatus = () => {
    if (energyLevel.current >= 75) return { text: 'Óptimo', color: Colors.accent };
    if (energyLevel.current >= 50) return { text: 'Bueno', color: Colors.primary };
    if (energyLevel.current >= 25) return { text: 'Bajo', color: '#FA8C16' };
    return { text: 'Crítico', color: Colors.tertiary };
  };

  const getProgressPercentage = () => {
    return todayStats.totalTasks > 0 ? (todayStats.tasksCompleted / todayStats.totalTasks) * 100 : 0;
  };

  const currentItem = timelineItems.find(item => item.status === 'current');
  const upcomingItems = timelineItems.filter(item => item.status === 'upcoming');
  const completedItems = timelineItems.filter(item => item.status === 'completed');

  const handleExpandBalance = () => {
    console.log('Expandiendo Balance Tracker...');
    // TODO: Implementar vista detallada de balance
  };

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    console.log(`Navegando a: ${tab}`);
    // TODO: Implementar navegación real entre módulos
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      
      <View style={styles.mainContent}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        {/* Header with Energy Monitor */}
        <EnergyMonitor
          energyLevel={energyLevel}
          userName={userName}
          onRecalibrate={handleRecalibrate}
        />

        {/* Estadísticas del Día */}
        <View style={styles.dayStatsContainer}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Resumen del Día</Text>
            <View style={styles.statsDate}>
              <Calendar size={16} color={Colors.accent} />
              <Text style={styles.statsDateText}>
                {new Date().toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
              </Text>
            </View>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${Colors.accent}20` }]}>
                <Zap size={20} color={Colors.accent} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{energyLevel.current}%</Text>
                <Text style={styles.statLabel}>Energía</Text>
                <Text style={[styles.statStatus, { color: getEnergyStatus().color }]}>
                  {getEnergyStatus().text}
                </Text>
              </View>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${Colors.primary}20` }]}>
                <Target size={20} color={Colors.primary} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{todayStats.tasksCompleted}/{todayStats.totalTasks}</Text>
                <Text style={styles.statLabel}>Tareas</Text>
                <Text style={styles.statStatus}>{Math.round(getProgressPercentage())}%</Text>
              </View>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${Colors.tertiary}20` }]}>
                <Activity size={20} color={Colors.tertiary} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{todayStats.focusTime}min</Text>
                <Text style={styles.statLabel}>Focus</Text>
                <Text style={styles.statStatus}>Tiempo profundo</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionCard, { backgroundColor: action.color }]}
                onPress={() => handleQuickAction(action.id)}
              >
                <action.icon size={20} color="#FFFFFF" />
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Finance Glance Widget */}
        <FinanceGlance
          metrics={mockFinanceMetrics}
          onQuickAddExpense={() => console.log('Quick add expense')}
          onQuickAddIncome={() => console.log('Quick add income')}
        />

        {/* Timeline Section */}
        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>Flujo del Día</Text>
          
          {/* Current Task */}
          {currentItem && (
            <TaskCard
              key={currentItem.id}
              item={currentItem}
              isCurrent={true}
              showTimeline={upcomingItems.length > 0}
            />
          )}
          
          {/* Upcoming Tasks */}
          {upcomingItems.length > 0 && (
            <View style={styles.upcomingSection}>
              <Text style={styles.upcomingTitle}>Próximas</Text>
              {upcomingItems.map((item: TimelineItem, index: number) => (
                <TaskCard
                  key={item.id}
                  item={item}
                  isCurrent={false}
                  showTimeline={index < upcomingItems.length - 1}
                />
              ))}
            </View>
          )}

          {/* Completed Items */}
          {completedItems.length > 0 && (
            <View style={styles.completedSection}>
              <Text style={styles.completedTitle}>Completado Hoy</Text>
              {completedItems.map((item: TimelineItem) => (
                <TaskCard
                  key={item.id}
                  item={item}
                  isCurrent={false}
                  showTimeline={false}
                />
              ))}
            </View>
          )}
        </View>

        {/* Bottom padding for smooth scrolling */}
        <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mainContent: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  timelineSection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  currentTaskSection: {
    marginBottom: 24,
  },
  currentTaskLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textLight,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  upcomingSection: {
    marginBottom: 24,
  },
  upcomingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  completedSection: {
    marginBottom: 24,
  },
  completedTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textLight,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  // Estilos para el diseño mejorado
  dayStatsContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    margin: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  statsDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statsDateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  statStatus: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  quickActionsContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    margin: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },

  bottomPadding: {
    height: 20,
  },
});

export default HomeScreen;
