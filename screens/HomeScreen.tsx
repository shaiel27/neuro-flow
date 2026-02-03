import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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

type TabType = 'flow' | 'resources' | 'insights' | 'profile';

const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [energyLevel, setEnergyLevel] = useState(mockEnergyLevel);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(mockTimeline);
  const [insight, setInsight] = useState<XAIInsight | null>(mockXAIInsight);
  const [userName] = useState('Alex');
  const [activeTab, setActiveTab] = useState<TabType>('flow');

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

  const handleQuickAddExpense = () => {
    console.log('Añadir gasto rápido...');
    // TODO: Implementar modal de añadir gasto
  };

  const handleQuickAddIncome = () => {
    console.log('Añadir ingreso rápido...');
    // TODO: Implementar modal de añadir ingreso
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

        {/* Balance Widget */}
        <BalanceWidget
          currentStreak={mockBalanceData.currentStreak}
          weeklyData={mockBalanceData.weeklyData}
          balanceStatus={mockBalanceData.balanceStatus}
          energyVsFinanceData={mockBalanceData.energyVsFinanceData}
          xaiMessage={mockBalanceData.xaiMessage}
          onExpand={handleExpandBalance}
        />

        {/* XAI Insight */}
        {insight && (
          <XAIInsightComponent
            insight={insight}
            onDismiss={handleDismissInsight}
          />
        )}

        {/* Finance Glance Widget */}
        <FinanceGlance
          metrics={mockFinanceMetrics}
          onQuickAddExpense={handleQuickAddExpense}
          onQuickAddIncome={handleQuickAddIncome}
        />

        {/* Timeline Section */}
        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>Línea de Tiempo Dinámica</Text>
          
          {/* Current Item */}
          {currentItem && (
            <View style={styles.currentTaskSection}>
              <Text style={styles.currentTaskLabel}>
                {currentItem.type === 'finance' ? 'Pago Programado' : 'En Foco'}
              </Text>
              <TaskCard
                item={currentItem}
                isCurrent={true}
                showTimeline={false}
              />
            </View>
          )}

          {/* Timeline with upcoming items */}
          <View style={styles.upcomingSection}>
            {upcomingItems.length > 0 && (
              <Text style={styles.upcomingTitle}>Próximas Actividades</Text>
            )}
            {upcomingItems.map((item: TimelineItem, index: number) => (
              <TaskCard
                key={item.id}
                item={item}
                isCurrent={false}
                showTimeline={index < upcomingItems.length - 1}
              />
            ))}
          </View>

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
  bottomPadding: {
    height: 40,
  },
});

export default HomeScreen;
