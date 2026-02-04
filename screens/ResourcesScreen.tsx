import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../types/colors';
import { mockWealthHealth, mockMindfulExpenses, mockStressProjection } from '../types/mockData';
import { MindfulExpense, MindfulIncome } from '../types';
import { VisualResourcesDashboard } from '../components/VisualResourcesDashboard';
import { ModernExpenseForm } from '../components/ModernExpenseForm';
import { IncomeEntryForm } from '../components/IncomeEntryForm';
import { EnergyFinanceIntegration } from '../services/energyFinanceIntegration';

const ResourcesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [showMindfulEntry, setShowMindfulEntry] = useState(false);
  const [showIncomeEntry, setShowIncomeEntry] = useState(false);
  const [expenses, setExpenses] = useState<MindfulExpense[]>(mockMindfulExpenses);
  const [incomes, setIncomes] = useState<MindfulIncome[]>([]);

  const handleAddExpense = () => {
    setShowMindfulEntry(true);
  };

  const handleAddIncome = () => {
    setShowIncomeEntry(true);
  };

  const handleSubmitExpense = (expenseData: Omit<MindfulExpense, 'id' | 'timestamp' | 'isEmotionalSpending' | 'impactOnEnergy'>) => {
    const newExpense: MindfulExpense = {
      ...expenseData,
      id: `exp_${Date.now()}`,
      timestamp: new Date(),
      isEmotionalSpending: EnergyFinanceIntegration.isEmotionalSpending(
        expenseData.emotionalState, 
        expenseData.expenseType
      ),
      impactOnEnergy: 0
    };

    // Calcular impacto energético (integración cross-module)
    const impact = EnergyFinanceIntegration.calculateEnergyImpact(
      newExpense,
      75, // Simulación de energía actual
      mockWealthHealth.totalBalance
    );

    console.log('🔋 Impacto energético calculado:', impact);
    
    // Si hay advertencia de batería, mostrar alerta
    if (impact.batteryWarning) {
      console.log('⚠️ Advertencia de batería baja - ajustar carga laboral');
      console.log('📋 Recomendaciones para Flow:', impact.flowRecommendations);
    }

    setExpenses([newExpense, ...expenses]);
    setShowMindfulEntry(false);
  };

  const handleSubmitIncome = (incomeData: Omit<MindfulIncome, 'id' | 'timestamp' | 'impactOnEnergy'>) => {
    const newIncome: MindfulIncome = {
      ...incomeData,
      id: `inc_${Date.now()}`,
      timestamp: new Date(),
      impactOnEnergy: 25 // Los ingresos siempre tienen impacto positivo en la energía
    };

    console.log('💰 Nuevo ingreso registrado:', newIncome);
    console.log('🔋 Impacto positivo en energía: +25');

    setIncomes([newIncome, ...incomes]);
    setShowIncomeEntry(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      <VisualResourcesDashboard
        expenses={expenses}
        incomes={incomes}
        onAddExpense={handleAddExpense}
        onAddIncome={handleAddIncome}
      />

      {/* Modern Expense Form */}
      <ModernExpenseForm
        isVisible={showMindfulEntry}
        onClose={() => setShowMindfulEntry(false)}
        onSubmit={handleSubmitExpense}
      />

      {/* Income Entry Form */}
      <IncomeEntryForm
        isVisible={showIncomeEntry}
        onClose={() => setShowIncomeEntry(false)}
        onSubmit={handleSubmitIncome}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default ResourcesScreen;
