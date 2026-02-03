import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { X, Heart, Brain, Smile, Frown, Home, ShoppingBag, Zap, Utensils, Car, Stethoscope, MoreHorizontal } from 'lucide-react-native';
import { EmotionalState, ExpenseCategory, ExpenseType, MindfulExpense } from '../types';
import { Colors } from '../types/colors';

interface MindfulEntryProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (expense: Omit<MindfulExpense, 'id' | 'timestamp' | 'isEmotionalSpending' | 'impactOnEnergy'>) => void;
}

const emotionalStates = [
  { state: 'calm' as EmotionalState, icon: Brain, label: 'Tranquilo', color: Colors.emotional.calm },
  { state: 'happy' as EmotionalState, icon: Smile, label: 'Feliz', color: Colors.emotional.happy },
  { state: 'stressed' as EmotionalState, icon: Frown, label: 'Estresado', color: Colors.emotional.stressed },
  { state: 'tired' as EmotionalState, icon: Heart, label: 'Cansado', color: Colors.emotional.tired },
];

const categories = [
  { category: 'home' as ExpenseCategory, icon: Home, label: 'Casa' },
  { category: 'clothing' as ExpenseCategory, icon: ShoppingBag, label: 'Ropa' },
  { category: 'services' as ExpenseCategory, icon: Zap, label: 'Servicios' },
  { category: 'leisure' as ExpenseCategory, icon: Smile, label: 'Ocio' },
  { category: 'food' as ExpenseCategory, icon: Utensils, label: 'Comida' },
  { category: 'transport' as ExpenseCategory, icon: Car, label: 'Transporte' },
  { category: 'health' as ExpenseCategory, icon: Stethoscope, label: 'Salud' },
  { category: 'other' as ExpenseCategory, icon: MoreHorizontal, label: 'Otros' },
];

export const MindfulEntry: React.FC<MindfulEntryProps> = ({
  isVisible,
  onClose,
  onSubmit
}) => {
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const [selectedEmotionalState, setSelectedEmotionalState] = useState<EmotionalState | null>(null);
  const [expenseType, setExpenseType] = useState<ExpenseType>('need');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  if (!isVisible) return null;

  const handleSubmit = () => {
    if (!amount || !selectedCategory || !selectedEmotionalState) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos obligatorios');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Monto inválido', 'Por favor ingresa un monto válido');
      return;
    }

    const isEmotionalSpending = selectedEmotionalState === 'stressed' && expenseType === 'want';

    onSubmit({
      amount: amountNum,
      category: selectedCategory,
      emotionalState: selectedEmotionalState,
      expenseType,
      description: description.trim(),
      isRecurring,
    });

    // Reset form
    setAmount('');
    setSelectedCategory(null);
    setSelectedEmotionalState(null);
    setExpenseType('need');
    setDescription('');
    setIsRecurring(false);
    onClose();
  };

  const getEmotionalInsight = () => {
    if (selectedEmotionalState === 'stressed' && expenseType === 'want') {
      return '⚠️ Posible gasto emocional detectado. ¿Es realmente necesario ahora?';
    }
    if (selectedEmotionalState === 'tired') {
      return '🧘 El cansancio puede afectar nuestras decisiones financieras.';
    }
    if (selectedEmotionalState === 'happy') {
      return '✨ Aprovecha este estado para decisiones financieras inteligentes.';
    }
    return '🌊 Mantén la calma y el equilibrio en tus decisiones.';
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Registro Consciente</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Monto */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monto</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="numeric"
              placeholderTextColor={Colors.textLight}
            />
            <Text style={styles.currencyLabel}>USD</Text>
          </View>

          {/* Estado Emocional */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>¿Cómo te sientes ahora?</Text>
            <View style={styles.emotionalGrid}>
              {emotionalStates.map(({ state, icon: Icon, label, color }) => (
                <TouchableOpacity
                  key={state}
                  style={[
                    styles.emotionalOption,
                    selectedEmotionalState === state && { backgroundColor: color }
                  ]}
                  onPress={() => setSelectedEmotionalState(state)}
                >
                  <Icon 
                    size={20} 
                    color={selectedEmotionalState === state ? Colors.cardBackground : color} 
                  />
                  <Text style={[
                    styles.emotionalLabel,
                    selectedEmotionalState === state && { color: Colors.cardBackground }
                  ]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Categoría */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categoría</Text>
            <View style={styles.categoryGrid}>
              {categories.map(({ category, icon: Icon, label }) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryOption,
                    selectedCategory === category && { backgroundColor: Colors.accent }
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Icon 
                    size={16} 
                    color={selectedCategory === category ? Colors.cardBackground : Colors.textSecondary} 
                  />
                  <Text style={[
                    styles.categoryLabel,
                    selectedCategory === category && { color: Colors.cardBackground }
                  ]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Necesidad vs Deseo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tipo de gasto</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeOption,
                  expenseType === 'need' && { backgroundColor: Colors.positive }
                ]}
                onPress={() => setExpenseType('need')}
              >
                <Text style={[
                  styles.typeLabel,
                  expenseType === 'need' && { color: Colors.cardBackground }
                ]}>
                  Necesidad
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeOption,
                  expenseType === 'want' && { backgroundColor: Colors.caution }
                ]}
                onPress={() => setExpenseType('want')}
              >
                <Text style={[
                  styles.typeLabel,
                  expenseType === 'want' && { color: Colors.cardBackground }
                ]}>
                  Deseo
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Descripción */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción (opcional)</Text>
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Añade notas sobre este gasto..."
              placeholderTextColor={Colors.textLight}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Recurrente */}
          <View style={styles.section}>
            <View style={styles.recurringContainer}>
              <Text style={styles.recurringLabel}>Gasto recurrente mensual</Text>
              <TouchableOpacity
                style={[
                  styles.toggle,
                  isRecurring && { backgroundColor: Colors.accent }
                ]}
                onPress={() => setIsRecurring(!isRecurring)}
              >
                <View style={[
                  styles.toggleCircle,
                  isRecurring && { backgroundColor: Colors.cardBackground }
                ]} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Insight */}
          {selectedEmotionalState && (
            <View style={styles.insightContainer}>
              <Text style={styles.insightText}>
                {getEmotionalInsight()}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Botones */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    width: '100%',
    maxHeight: '90%',
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    borderBottomWidth: 2,
    borderBottomColor: Colors.accent,
    paddingBottom: 8,
    paddingRight: 50,
  },
  currencyLabel: {
    position: 'absolute',
    right: 0,
    bottom: 8,
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  emotionalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emotionalOption: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emotionalLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    flex: 1,
    minWidth: '22%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  descriptionInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    textAlignVertical: 'top',
  },
  recurringContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recurringLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.textLight,
  },
  insightContainer: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  insightText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  submitButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.cardBackground,
  },
});
