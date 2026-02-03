import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Modal, 
  Alert,
  Dimensions
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
  CreditCard,
  TrendingUp,
  Calendar,
  DollarSign,
  Shield,
  Gift
} from 'lucide-react-native';
import { EmotionalState, ExpenseCategory, ExpenseType, MindfulExpense } from '../types';
import { Colors } from '../types/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ModernExpenseFormProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (expense: Omit<MindfulExpense, 'id' | 'timestamp' | 'isEmotionalSpending' | 'impactOnEnergy'>) => void;
}

// Estados emocionales modernos
const emotionalStates = [
  { 
    state: 'calm' as EmotionalState, 
    icon: Brain, 
    label: 'En Calma', 
    color: '#4ECDC4',
    bgColor: '#4ECDC420',
    description: 'Claridad mental y paz interior'
  },
  { 
    state: 'happy' as EmotionalState, 
    icon: Smile, 
    label: 'Feliz', 
    color: '#FFD93D',
    bgColor: '#FFD93D20',
    description: 'Estado de alegría y satisfacción'
  },
  { 
    state: 'stressed' as EmotionalState, 
    icon: Frown, 
    label: 'Estresado', 
    color: '#FF6B6B',
    bgColor: '#FF6B6B20',
    description: 'Presión y tensión mental'
  },
  { 
    state: 'tired' as EmotionalState, 
    icon: Heart, 
    label: 'Cansado', 
    color: '#95A5A6',
    bgColor: '#95A5A620',
    description: 'Fatiga mental y física'
  },
];

// Categorías modernas
const categories = [
  { 
    category: 'home' as ExpenseCategory, 
    icon: Home, 
    label: 'Hogar',
    color: '#6B8E7E',
    description: 'Gastos del hogar y mantenimiento'
  },
  { 
    category: 'clothing' as ExpenseCategory, 
    icon: ShoppingBag, 
    label: 'Ropa',
    color: '#B8A878',
    description: 'Vestimenta y accesorios'
  },
  { 
    category: 'services' as ExpenseCategory, 
    icon: Zap, 
    label: 'Servicios',
    color: '#4ECDC4',
    description: 'Suscripciones y servicios'
  },
  { 
    category: 'leisure' as ExpenseCategory, 
    icon: Smile, 
    label: 'Ocio',
    color: '#FFD93D',
    description: 'Entretenimiento y tiempo libre'
  },
  { 
    category: 'food' as ExpenseCategory, 
    icon: Utensils, 
    label: 'Comida',
    color: '#FF6B35',
    description: 'Alimentos y restaurantes'
  },
  { 
    category: 'transport' as ExpenseCategory, 
    icon: Car, 
    label: 'Transporte',
    color: '#6B8E7E',
    description: 'Movilidad y viajes'
  },
  { 
    category: 'health' as ExpenseCategory, 
    icon: Stethoscope, 
    label: 'Salud',
    color: '#4ECDC4',
    description: 'Cuidado médico y bienestar'
  },
  { 
    category: 'other' as ExpenseCategory, 
    icon: MoreHorizontal, 
    label: 'Otros',
    color: '#95A5A6',
    description: 'Categorías varias'
  },
];

export const ModernExpenseForm: React.FC<ModernExpenseFormProps> = ({
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
  const [currentStep, setCurrentStep] = useState(1);

  const handleSubmit = () => {
    if (!amount || !selectedCategory || !selectedEmotionalState) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos obligatorios');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Monto inválido', 'Por favor ingresa un monto válido mayor a 0');
      return;
    }

    const isEmotionalSpending = selectedEmotionalState === 'stressed' && expenseType === 'want';
    
    if (isEmotionalSpending) {
      Alert.alert(
        '⚠️ Gasto Emocional Detectado',
        'Estás estresado y esto es un deseo. ¿Deseas continuar?',
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
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return '¿Cuánto gastaste?';
      case 2: return '¿Cómo te sientes?';
      case 3: return '¿En qué categoría?';
      default: return 'Revisa tu gasto';
    }
  };

  const getStepProgress = () => {
    return (currentStep / 3) * 100;
  };

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent={false}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {
            resetForm();
            onClose();
          }} style={styles.closeButton}>
            <X size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          
          <View style={styles.progressContainer}>
            <Text style={styles.stepIndicator}>Paso {currentStep} de 3</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${getStepProgress()}%` }
                ]} 
              />
            </View>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Título Principal */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>{getStepTitle()}</Text>
            <Text style={styles.subtitle}>
              {currentStep === 1 && 'Ingresa el monto exacto de tu gasto'}
              {currentStep === 2 && 'Tu estado emocional afecta tus decisiones'}
              {currentStep === 3 && 'Clasifica tu gasto para mejor seguimiento'}
            </Text>
          </View>

          {/* Paso 1: Monto */}
          {currentStep === 1 && (
            <View style={styles.stepContent}>
              <View style={styles.amountCard}>
                <DollarSign size={24} color={Colors.accent} />
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textLight}
                  maxLength={10}
                  autoFocus
                />
                <Text style={styles.currencyLabel}>USD</Text>
              </View>
              
              {/* Montos Rápidos */}
              <View style={styles.quickAmounts}>
                {[10, 25, 50, 100, 200].map((value) => (
                  <TouchableOpacity
                    key={value}
                    style={styles.quickAmountButton}
                    onPress={() => setAmount(value.toString())}
                  >
                    <Text style={styles.quickAmountText}>${value}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Paso 2: Estado Emocional */}
          {currentStep === 2 && (
            <View style={styles.stepContent}>
              <Text style={styles.emotionalQuestion}>
                ¿Cómo te sientes en este momento?
              </Text>
              
              <View style={styles.emotionalGrid}>
                {emotionalStates.map(({ state, icon: Icon, label, color, bgColor, description }) => (
                  <TouchableOpacity
                    key={state}
                    style={[
                      styles.emotionalCard,
                      selectedEmotionalState === state && { 
                        backgroundColor: color,
                        borderColor: color
                      }
                    ]}
                    onPress={() => setSelectedEmotionalState(state)}
                  >
                    <View style={[
                      styles.emotionalIcon,
                      { backgroundColor: bgColor }
                    ]}>
                      <Icon 
                        size={28} 
                        color={selectedEmotionalState === state ? '#FFFFFF' : color} 
                      />
                    </View>
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
          )}

          {/* Paso 3: Categoría y Tipo */}
          {currentStep === 3 && (
            <View style={styles.stepContent}>
              {/* Categoría */}
              <Text style={styles.sectionTitle}>Categoría</Text>
              <View style={styles.categoryGrid}>
                {categories.map(({ category, icon: Icon, label, color }) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryCard,
                      selectedCategory === category && { 
                        backgroundColor: color,
                        borderColor: color
                      }
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Icon 
                      size={20} 
                      color={selectedCategory === category ? '#FFFFFF' : color} 
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

              {/* Tipo de Gasto */}
              <Text style={styles.sectionTitle}>Tipo de Gasto</Text>
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    expenseType === 'need' && { 
                      backgroundColor: Colors.accent,
                      borderColor: Colors.accent
                    }
                  ]}
                  onPress={() => setExpenseType('need')}
                >
                  <View style={styles.typeIconContainer}>
                    <Shield size={20} color={expenseType === 'need' ? Colors.cardBackground : Colors.accent} />
                  </View>
                  <Text style={[
                    styles.typeText,
                    expenseType === 'need' && { color: Colors.cardBackground }
                  ]}>
                    Necesidad
                  </Text>
                  <Text style={[
                    styles.typeDescription,
                    expenseType === 'need' && { color: Colors.cardBackground }
                  ]}>
                    Gasto esencial para tu bienestar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    expenseType === 'want' && { 
                      backgroundColor: Colors.accent,
                      borderColor: Colors.accent
                    }
                  ]}
                  onPress={() => setExpenseType('want')}
                >
                  <View style={styles.typeIconContainer}>
                    <Gift size={20} color={expenseType === 'want' ? Colors.cardBackground : Colors.accent} />
                  </View>
                  <Text style={[
                    styles.typeText,
                    expenseType === 'want' && { color: Colors.cardBackground }
                  ]}>
                    Deseo
                  </Text>
                  <Text style={[
                    styles.typeDescription,
                    expenseType === 'want' && { color: Colors.cardBackground }
                  ]}>
                    Gasto opcional para disfrute
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Descripción */}
              <Text style={styles.sectionTitle}>Notas (opcional)</Text>
              <TextInput
                style={styles.descriptionInput}
                value={description}
                onChangeText={setDescription}
                placeholder="Añade detalles sobre este gasto..."
                placeholderTextColor={Colors.textLight}
                multiline
                numberOfLines={3}
                maxLength={100}
              />

              {/* Recurrente */}
              <View style={styles.recurringSection}>
                <View style={styles.recurringHeader}>
                  <Text style={styles.recurringTitle}>Gasto recurrente</Text>
                  <TouchableOpacity
                    style={[
                      styles.recurringToggle,
                      isRecurring && { backgroundColor: '#4ECDC4' }
                    ]}
                    onPress={() => setIsRecurring(!isRecurring)}
                  >
                    <View style={[
                      styles.recurringCircle,
                      isRecurring && { 
                        backgroundColor: '#FFFFFF',
                        transform: [{ translateX: 20 }]
                      }
                    ]} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.recurringDescription}>
                  {isRecurring 
                    ? 'Este gasto se programará mensualmente en tu línea de tiempo'
                    : 'Gasto único'
                  }
                </Text>
              </View>
            </View>
          )}

          {/* Botones de Navegación */}
          <View style={styles.navigationButtons}>
            <TouchableOpacity
              style={[styles.navButton, styles.prevButton]}
              onPress={prevStep}
              disabled={currentStep === 1}
            >
              <Text style={styles.prevButtonText}>Anterior</Text>
            </TouchableOpacity>
            
            {currentStep < 3 ? (
              <TouchableOpacity
                style={[styles.navButton, styles.nextButton]}
                onPress={nextStep}
                disabled={
                  (currentStep === 1 && !amount) ||
                  (currentStep === 2 && !selectedEmotionalState) ||
                  (currentStep === 3 && !selectedCategory)
                }
              >
                <Text style={styles.nextButtonText}>Siguiente</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.navButton, styles.submitButton]}
                onPress={handleSubmit}
                disabled={!amount || !selectedCategory || !selectedEmotionalState}
              >
                <Text style={styles.submitButtonText}>Registrar Gasto</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: 8,
  },
  progressContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepIndicator: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  progressBar: {
    width: 200,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  titleSection: {
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  stepContent: {
    minHeight: 400,
  },
  amountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  amountInput: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  currencyLabel: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginLeft: 12,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  quickAmountButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  emotionalQuestion: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emotionalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  emotionalCard: {
    width: screenWidth * 0.4,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    minHeight: 140,
  },
  emotionalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emotionalLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  emotionalDescription: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  categoryCard: {
    width: screenWidth * 0.2,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    minHeight: 80,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  typeOption: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    minHeight: 100,
  },
  typeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  descriptionInput: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: Colors.textPrimary,
    borderWidth: 2,
    borderColor: Colors.border,
    textAlignVertical: 'top',
    minHeight: 80,
    marginBottom: 24,
  },
  recurringSection: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  recurringHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recurringTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  recurringToggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  recurringCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.textLight,
  },
  recurringDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  prevButton: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.border,
  },
  nextButton: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  submitButton: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  prevButtonText: {
    color: Colors.textSecondary,
  },
  nextButtonText: {
    color: Colors.cardBackground,
  },
  submitButtonText: {
    color: Colors.cardBackground,
  },
});
