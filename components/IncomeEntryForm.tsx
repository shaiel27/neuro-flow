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
  DollarSign, 
  Briefcase, 
  Heart, 
  TrendingUp, 
  Calendar, 
  PiggyBank,
  Gift,
  Coffee,
  Car,
  Home,
  Zap
} from 'lucide-react-native';
import { IncomeCategory, IncomeType, MindfulIncome } from '../types';
import { Colors } from '../types/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface IncomeEntryFormProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (income: Omit<MindfulIncome, 'id' | 'timestamp' | 'impactOnEnergy'>) => void;
}

// Categorías de ingresos
const incomeCategories = [
  { 
    category: 'salary' as IncomeCategory, 
    icon: Briefcase, 
    label: 'Salario',
    color: Colors.accent,
    description: 'Ingreso principal mensual'
  },
  { 
    category: 'freelance' as IncomeCategory, 
    icon: Zap, 
    label: 'Freelance',
    color: Colors.accent,
    description: 'Trabajos independientes'
  },
  { 
    category: 'investment' as IncomeCategory, 
    icon: TrendingUp, 
    label: 'Inversión',
    color: Colors.accent,
    description: 'Retornos de inversiones'
  },
  { 
    category: 'business' as IncomeCategory, 
    icon: Home, 
    label: 'Negocio',
    color: Colors.accent,
    description: 'Ingresos de negocio propio'
  },
  { 
    category: 'gift' as IncomeCategory, 
    icon: Gift, 
    label: 'Regalo',
    color: Colors.accent,
    description: 'Regalos o bonos'
  },
  { 
    category: 'other' as IncomeCategory, 
    icon: Coffee, 
    label: 'Otros',
    color: Colors.accent,
    description: 'Otros tipos de ingresos'
  },
];

// Tipos de ingresos
const incomeTypes = [
  { 
    type: 'regular' as IncomeType, 
    label: 'Regular',
    description: 'Ingreso predecible y recurrente',
    icon: Calendar
  },
  { 
    type: 'bonus' as IncomeType, 
    label: 'Bonificación',
    description: 'Ingreso extra o inesperado',
    icon: Gift
  },
  { 
    type: 'passive' as IncomeType, 
    label: 'Pasivo',
    description: 'Ingreso sin esfuerzo activo',
    icon: PiggyBank
  },
];

export const IncomeEntryForm: React.FC<IncomeEntryFormProps> = ({
  isVisible,
  onClose,
  onSubmit
}) => {
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IncomeCategory | null>(null);
  const [selectedType, setSelectedType] = useState<IncomeType>('regular');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleSubmit = () => {
    if (!amount || !selectedCategory) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos obligatorios');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Monto inválido', 'Por favor ingresa un monto válido mayor a 0');
      return;
    }

    submitIncome(amountNum);
  };

  const submitIncome = (amountNum: number) => {
    if (!selectedCategory) return;

    onSubmit({
      amount: amountNum,
      category: selectedCategory,
      type: selectedType,
      description: description.trim(),
      isRecurring,
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setAmount('');
    setSelectedCategory(null);
    setSelectedType('regular');
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
      case 1: return '¿Cuánto recibiste?';
      case 2: return '¿De dónde viene?';
      case 3: return 'Revisa tu ingreso';
      default: return 'Confirma tu ingreso';
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
              {currentStep === 1 && 'Ingresa el monto exacto de tu ingreso'}
              {currentStep === 2 && 'Clasifica tu ingreso para mejor seguimiento'}
              {currentStep === 3 && 'Confirma los detalles de tu ingreso'}
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
                {[100, 250, 500, 1000, 2000].map((value) => (
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

          {/* Paso 2: Categoría y Tipo */}
          {currentStep === 2 && (
            <View style={styles.stepContent}>
              {/* Categoría */}
              <Text style={styles.sectionTitle}>Categoría</Text>
              <View style={styles.categoryGrid}>
                {incomeCategories.map(({ category, icon: Icon, label, color }) => (
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

              {/* Tipo de Ingreso */}
              <Text style={styles.sectionTitle}>Tipo de Ingreso</Text>
              <View style={styles.typeSelector}>
                {incomeTypes.map(({ type, label, description, icon: Icon }) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeOption,
                      selectedType === type && { 
                        backgroundColor: Colors.accent,
                        borderColor: Colors.accent
                      }
                    ]}
                    onPress={() => setSelectedType(type)}
                  >
                    <View style={styles.typeIconContainer}>
                      <Icon 
                        size={16} 
                        color={selectedType === type ? Colors.cardBackground : Colors.accent} 
                      />
                    </View>
                    <Text style={[
                      styles.typeText,
                      selectedType === type && { color: Colors.cardBackground }
                    ]}>
                      {label}
                    </Text>
                    <Text style={[
                      styles.typeDescription,
                      selectedType === type && { color: Colors.cardBackground }
                    ]}>
                      {description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Descripción */}
              <Text style={styles.sectionTitle}>Notas (opcional)</Text>
              <TextInput
                style={styles.descriptionInput}
                value={description}
                onChangeText={setDescription}
                placeholder="Añade detalles sobre este ingreso..."
                placeholderTextColor={Colors.textLight}
                multiline
                numberOfLines={3}
                maxLength={100}
              />

              {/* Recurrente */}
              <View style={styles.recurringSection}>
                <View style={styles.recurringHeader}>
                  <Text style={styles.recurringTitle}>Ingreso recurrente</Text>
                  <TouchableOpacity
                    style={[
                      styles.recurringToggle,
                      isRecurring && { backgroundColor: Colors.accent }
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
                    ? 'Este ingreso se programará mensualmente en tu línea de tiempo'
                    : 'Ingreso único'
                  }
                </Text>
              </View>
            </View>
          )}

          {/* Paso 3: Resumen */}
          {currentStep === 3 && (
            <View style={styles.stepContent}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Resumen del Ingreso</Text>
                
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Monto:</Text>
                  <Text style={styles.summaryValue}>${amount}</Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Categoría:</Text>
                  <Text style={styles.summaryValue}>
                    {incomeCategories.find(c => c.category === selectedCategory)?.label}
                  </Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Tipo:</Text>
                  <Text style={styles.summaryValue}>
                    {incomeTypes.find(t => t.type === selectedType)?.label}
                  </Text>
                </View>
                
                {description && (
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Notas:</Text>
                    <Text style={styles.summaryValue}>{description}</Text>
                  </View>
                )}
                
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Recurrente:</Text>
                  <Text style={styles.summaryValue}>
                    {isRecurring ? 'Sí' : 'No'}
                  </Text>
                </View>
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
                  (currentStep === 2 && !selectedCategory)
                }
              >
                <Text style={styles.nextButtonText}>Siguiente</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.navButton, styles.submitButton]}
                onPress={handleSubmit}
                disabled={!amount || !selectedCategory}
              >
                <Text style={styles.submitButtonText}>Registrar Ingreso</Text>
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
    width: screenWidth * 0.25,
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
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  typeOption: {
    width: screenWidth * 0.45,
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
  summaryCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.accent,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
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
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  prevButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.cardBackground,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.cardBackground,
  },
});
