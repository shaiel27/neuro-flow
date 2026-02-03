import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Alert 
} from 'react-native';
import { 
  X, 
  Heart, 
  Brain, 
  Smile, 
  Frown, 
  Home, 
  ShoppingBag, 
  Zap, 
  Utensils, 
  Car, 
  Stethoscope, 
  MoreHorizontal,
  Wallet,
  TrendingUp,
  Calendar
} from 'lucide-react-native';
import { EmotionalState, ExpenseCategory, ExpenseType, MindfulExpense } from '../types';
import { Colors } from '../types/colors';

interface MindfulEntryFormProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (expense: Omit<MindfulExpense, 'id' | 'timestamp' | 'isEmotionalSpending' | 'impactOnEnergy'>) => void;
}

// Estados emocionales con iconos y colores
const emotionalStates = [
  { 
    state: 'calm' as EmotionalState, 
    icon: Brain, 
    label: 'Tranquilo', 
    color: '#6B8E7E',
    description: 'Estado de paz y claridad mental'
  },
  { 
    state: 'happy' as EmotionalState, 
    icon: Smile, 
    label: 'Feliz', 
    color: '#8FA398',
    description: 'Estado de alegría y satisfacción'
  },
  { 
    state: 'stressed' as EmotionalState, 
    icon: Frown, 
    label: 'Estresado', 
    color: '#B8A878',
    description: 'Estado de presión y tensión'
  },
  { 
    state: 'tired' as EmotionalState, 
    icon: Heart, 
    label: 'Cansado', 
    color: '#A0A090',
    description: 'Estado de fatiga mental'
  },
];

// Categorías de gastos con iconos
const categories = [
  { 
    category: 'home' as ExpenseCategory, 
    icon: Home, 
    label: 'Casa',
    description: 'Gastos del hogar y mantenimiento'
  },
  { 
    category: 'clothing' as ExpenseCategory, 
    icon: ShoppingBag, 
    label: 'Ropa',
    description: 'Vestimenta y accesorios'
  },
  { 
    category: 'services' as ExpenseCategory, 
    icon: Zap, 
    label: 'Servicios',
    description: 'Suscripciones y servicios recurrentes'
  },
  { 
    category: 'leisure' as ExpenseCategory, 
    icon: Smile, 
    label: 'Ocio',
    description: 'Entretenimiento y tiempo libre'
  },
  { 
    category: 'food' as ExpenseCategory, 
    icon: Utensils, 
    label: 'Comida',
    description: 'Alimentos y restaurantes'
  },
  { 
    category: 'transport' as ExpenseCategory, 
    icon: Car, 
    label: 'Transporte',
    description: 'Movilidad y viajes'
  },
  { 
    category: 'health' as ExpenseCategory, 
    icon: Stethoscope, 
    label: 'Salud',
    description: 'Cuidado médico y bienestar'
  },
  { 
    category: 'other' as ExpenseCategory, 
    icon: MoreHorizontal, 
    label: 'Otros',
    description: 'Categorías no especificadas'
  },
];

export const MindfulEntryForm: React.FC<MindfulEntryFormProps> = ({
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
    // Validaciones
    if (!amount || !selectedCategory || !selectedEmotionalState) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos obligatorios');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Monto inválido', 'Por favor ingresa un monto válido mayor a 0');
      return;
    }

    // Detección de gasto emocional
    const isEmotionalSpending = selectedEmotionalState === 'stressed' && expenseType === 'want';
    
    // Alerta si es posible gasto emocional
    if (isEmotionalSpending) {
      Alert.alert(
        '⚠️ Posible Gasto Emocional',
        'Detectamos que estás estresado y este es un deseo. ¿Deseas continuar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Continuar', 
            onPress: () => submitExpense(amountNum, isEmotionalSpending)
          }
        ]
      );
    } else {
      submitExpense(amountNum, isEmotionalSpending);
    }
  };

  const submitExpense = (amountNum: number, isEmotionalSpending: boolean) => {
    if (!selectedCategory || !selectedEmotionalState) return;

    onSubmit({
      amount: amountNum,
      category: selectedCategory,
      emotionalState: selectedEmotionalState,
      expenseType,
      description: description.trim(),
      isRecurring,
    });

    // Reset form
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setAmount('');
    setSelectedCategory(null);
    setSelectedEmotionalState(null);
    setExpenseType('need');
    setDescription('');
    setIsRecurring(false);
  };

  const getEmotionalInsight = () => {
    if (!selectedEmotionalState) return null;
    
    const state = emotionalStates.find(s => s.state === selectedEmotionalState);
    if (!state) return null;

    if (selectedEmotionalState === 'stressed' && expenseType === 'want') {
      return {
        icon: '⚠️',
        text: 'Posible gasto emocional detectado. ¿Es realmente necesario ahora?',
        color: '#B8A878'
      };
    }
    
    if (selectedEmotionalState === 'tired') {
      return {
        icon: '🧘',
        text: 'El cansancio puede afectar nuestras decisiones financieras.',
        color: '#A0A090'
      };
    }
    
    if (selectedEmotionalState === 'happy') {
      return {
        icon: '✨',
        text: 'Aprovecha este estado para decisiones financieras inteligentes.',
        color: '#8FA398'
      };
    }
    
    return {
      icon: '🌊',
      text: 'Mantén la calma y el equilibrio en tus decisiones.',
      color: '#6B8E7E'
    };
  };

  if (!isVisible) return null;

  const insight = getEmotionalInsight();

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Wallet size={24} color="#6B8E7E" />
            <Text style={styles.title}>Registro Consciente</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={20} color="#5A6F6F" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Monto */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monto</Text>
            <View style={styles.amountContainer}>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="numeric"
                placeholderTextColor="#8A9A9A"
                maxLength={10}
              />
              <Text style={styles.currencyLabel}>USD</Text>
            </View>
          </View>

          {/* Estado Emocional */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>¿Cómo te sientes ahora?</Text>
            <Text style={styles.sectionSubtitle}>
              Tu estado emocional afecta tus decisiones financieras
            </Text>
            <View style={styles.emotionalGrid}>
              {emotionalStates.map(({ state, icon: Icon, label, color, description }) => (
                <TouchableOpacity
                  key={state}
                  style={[
                    styles.emotionalOption,
                    selectedEmotionalState === state && { 
                      backgroundColor: color,
                      borderColor: color 
                    }
                  ]}
                  onPress={() => setSelectedEmotionalState(state)}
                  activeOpacity={0.7}
                >
                  <Icon 
                    size={24} 
                    color={selectedEmotionalState === state ? '#FFFFFF' : color} 
                  />
                  <Text style={[
                    styles.emotionalLabel,
                    selectedEmotionalState === state && { color: '#FFFFFF' }
                  ]}>
                    {label}
                  </Text>
                  <Text style={[
                    styles.emotionalDescription,
                    selectedEmotionalState === state && { color: '#FFFFFF' }
                  ]}>
                    {description}
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
                    selectedCategory === category && { 
                      backgroundColor: '#6B8E7E',
                      borderColor: '#6B8E7E'
                    }
                  ]}
                  onPress={() => setSelectedCategory(category)}
                  activeOpacity={0.7}
                >
                  <Icon 
                    size={20} 
                    color={selectedCategory === category ? '#FFFFFF' : '#6B8E7E'} 
                  />
                  <Text style={[
                    styles.categoryLabel,
                    selectedCategory === category && { color: '#FFFFFF' }
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
            <Text style={styles.sectionSubtitle}>
              ¿Es algo que necesitas o algo que deseas?
            </Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeOption,
                  expenseType === 'need' && { 
                    backgroundColor: '#6B8E7E',
                    borderColor: '#6B8E7E'
                  }
                ]}
                onPress={() => setExpenseType('need')}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.typeLabel,
                  expenseType === 'need' && { color: '#FFFFFF' }
                ]}>
                  💚 Necesidad
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeOption,
                  expenseType === 'want' && { 
                    backgroundColor: '#B8A878',
                    borderColor: '#B8A878'
                  }
                ]}
                onPress={() => setExpenseType('want')}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.typeLabel,
                  expenseType === 'want' && { color: '#FFFFFF' }
                ]}>
                  🧡 Deseo
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
              placeholderTextColor="#8A9A9A"
              multiline
              numberOfLines={3}
              maxLength={100}
            />
          </View>

          {/* Recurrente */}
          <View style={styles.section}>
            <View style={styles.recurringContainer}>
              <View style={styles.recurringInfo}>
                <Text style={styles.recurringLabel}>Gasto recurrente mensual</Text>
                <Text style={styles.recurringSublabel}>
                  Se programará automáticamente en tu línea de tiempo
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.toggle,
                  isRecurring && { backgroundColor: '#6B8E7E' }
                ]}
                onPress={() => setIsRecurring(!isRecurring)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.toggleCircle,
                  isRecurring && { 
                    backgroundColor: '#FFFFFF',
                    transform: [{ translateX: 12 }]
                  }
                ]} />
              </TouchableOpacity>
            </View>
            {isRecurring && (
              <View style={styles.flowBadge}>
                <Calendar size={12} color="#FFFFFF" />
                <Text style={styles.flowBadgeText}>Programado en Flow</Text>
              </View>
            )}
          </View>

          {/* Insight dinámico */}
          {insight && (
            <View style={[styles.insightContainer, { backgroundColor: `${insight.color}15` }]}>
              <Text style={styles.insightIcon}>{insight.icon}</Text>
              <Text style={[styles.insightText, { color: insight.color }]}>
                {insight.text}
              </Text>
            </View>
          )}

          {/* Botones */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                resetForm();
                onClose();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!amount || !selectedCategory || !selectedEmotionalState) && 
                styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!amount || !selectedCategory || !selectedEmotionalState}
              activeOpacity={0.7}
            >
              <Text style={styles.submitButtonText}>Registrar Conscientemente</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0EB',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E3D',
  },
  closeButton: {
    padding: 4,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E3D',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#5A6F6F',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F0',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E8E8E3',
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C3E3D',
    flex: 1,
    paddingRight: 10,
  },
  currencyLabel: {
    fontSize: 18,
    color: '#5A6F6F',
    fontWeight: '500',
  },
  emotionalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emotionalOption: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F5F5F0',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E8E8E3',
    alignItems: 'center',
    minHeight: 120,
  },
  emotionalLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  emotionalDescription: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryOption: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: '#F5F5F0',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: '#E8E8E3',
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F5F5F0',
    borderWidth: 2,
    borderColor: '#E8E8E3',
    alignItems: 'center',
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E3D',
  },
  descriptionInput: {
    backgroundColor: '#F5F5F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#2C3E3D',
    borderWidth: 2,
    borderColor: '#E8E8E3',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  recurringContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F0',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8E8E3',
  },
  recurringInfo: {
    flex: 1,
  },
  recurringLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E3D',
    marginBottom: 4,
  },
  recurringSublabel: {
    fontSize: 12,
    color: '#5A6F6F',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8E8E3',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8A9A9A',
  },
  flowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6B8E7E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
    gap: 6,
  },
  flowBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  insightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 12,
  },
  insightIcon: {
    fontSize: 20,
  },
  insightText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 20,
    paddingBottom: 40,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F5F5F0',
    borderWidth: 2,
    borderColor: '#E8E8E3',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5A6F6F',
  },
  submitButton: {
    flex: 2,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#6B8E7E',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#E8E8E3',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
