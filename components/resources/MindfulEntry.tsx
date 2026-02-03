import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Animated } from 'react-native';
import { MindfulEntry as MindfulEntryType, EmotionalState, TransactionCategory, TransactionType } from '../../types/resources';
import { ResourcesColors } from '../../types/resourcesColors';

interface MindfulEntryProps {
  onSubmit: (entry: MindfulEntryType) => void;
  onCancel: () => void;
}

const categoryLabels: Record<TransactionCategory, string> = {
  housing: '🏠 Vivienda',
  clothing: '👕 Ropa',
  services: '⚡ Servicios',
  leisure: '🎮 Ocio',
  food: '🍕 Comida',
  transport: '🚗 Transporte',
  health: '❤️ Salud',
  other: '📦 Otros',
};

const emotionalLabels: Record<EmotionalState, string> = {
  stressed: '😰 Estresado',
  happy: '😊 Feliz',
  tired: '😴 Cansado',
  neutral: '😐 Neutral',
};

const emotionalColors: Record<EmotionalState, string> = {
  stressed: ResourcesColors.emotionalStressed,
  happy: ResourcesColors.emotionalHappy,
  tired: ResourcesColors.emotionalTired,
  neutral: ResourcesColors.emotionalNeutral,
};

export const MindfulEntry: React.FC<MindfulEntryProps> = ({
  onSubmit,
  onCancel
}) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('other');
  const [emotionalState, setEmotionalState] = useState<EmotionalState>('neutral');
  const [type, setType] = useState<TransactionType>('need');
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [isRecurring, setIsRecurring] = useState(false);
  
  // Animaciones
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSubmit = () => {
    if (!amount || !description) return;

    const finalAmount = transactionType === 'income' ? parseFloat(amount) : -parseFloat(amount);
    const entry: MindfulEntryType = {
      amount: finalAmount,
      category,
      description,
      emotionalState,
      type,
      isRecurring,
    };

    onSubmit(entry);
  };

  const isEmotionalSpending = emotionalState === 'stressed' && type === 'want';

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Registro Consciente</Text>
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <Text style={styles.cancelText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Monto con selector de tipo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monto</Text>
          <View style={styles.transactionTypeContainer}>
            <TouchableOpacity
              style={[
                styles.transactionTypeButton,
                transactionType === 'expense' && styles.transactionTypeButtonActive
              ]}
              onPress={() => setTransactionType('expense')}
            >
              <Text style={[
                styles.transactionTypeButtonText,
                transactionType === 'expense' && styles.transactionTypeButtonTextActive
              ]}>
                💸 Gasto
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.transactionTypeButton,
                transactionType === 'income' && styles.transactionTypeButtonActive
              ]}
              onPress={() => setTransactionType('income')}
            >
              <Text style={[
                styles.transactionTypeButtonText,
                transactionType === 'income' && styles.transactionTypeButtonTextActive
              ]}>
                💰 Ingreso
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="numeric"
            textAlign="center"
          />
          <Text style={styles.currencyLabel}>USD</Text>
        </View>

        {/* Descripción */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="¿Qué compraste o ingresaste?"
            multiline
          />
        </View>

        {/* Categoría */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categoría</Text>
          <View style={styles.categoryGrid}>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.categoryItem,
                  category === key && styles.categoryItemSelected
                ]}
                onPress={() => setCategory(key as TransactionCategory)}
              >
                <Text style={styles.categoryEmoji}>{label.split(' ')[0]}</Text>
                <Text style={[
                  styles.categoryLabel,
                  category === key && styles.categoryLabelSelected
                ]}>
                  {label.split(' ')[1]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Estado Emocional - OBLIGATORIO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado Emocional *</Text>
          <Text style={styles.sectionSubtitle}>¿Cómo te sientes en este momento?</Text>
          <View style={styles.emotionalGrid}>
            {Object.entries(emotionalLabels).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.emotionalItem,
                  { 
                    backgroundColor: emotionalState === key 
                      ? emotionalColors[key as EmotionalState] 
                      : ResourcesColors.background,
                    borderColor: emotionalState === key 
                      ? emotionalColors[key as EmotionalState] 
                      : ResourcesColors.border
                  }
                ]}
                onPress={() => setEmotionalState(key as EmotionalState)}
              >
                <Text style={styles.emotionalEmoji}>{label.split(' ')[0]}</Text>
                <Text style={[
                  styles.emotionalLabel,
                  emotionalState === key && styles.emotionalLabelSelected
                ]}>
                  {label.split(' ')[1]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Necesidad vs Deseo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Gasto</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'need' && styles.typeButtonSelected
              ]}
              onPress={() => setType('need')}
            >
              <Text style={styles.typeEmoji}>✅</Text>
              <Text style={[
                styles.typeButtonText,
                type === 'need' && styles.typeButtonTextSelected
              ]}>
                Necesidad
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'want' && styles.typeButtonSelected
              ]}
              onPress={() => setType('want')}
            >
              <Text style={styles.typeEmoji}>🎯</Text>
              <Text style={[
                styles.typeButtonText,
                type === 'want' && styles.typeButtonTextSelected
              ]}>
                Deseo
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recurrente */}
        <View style={styles.section}>
          <View style={styles.recurringContainer}>
            <TouchableOpacity
              style={[
                styles.recurringToggle,
                isRecurring && styles.recurringToggleActive
              ]}
              onPress={() => setIsRecurring(!isRecurring)}
            >
              <Text style={styles.recurringEmoji}>{isRecurring ? '🔄' : '⏸️'}</Text>
              <Text style={[
                styles.recurringText,
                isRecurring && styles.recurringTextActive
              ]}>
                {isRecurring ? 'Programado en Flow' : 'No recurrente'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Alerta de gasto emocional */}
        {isEmotionalSpending && (
          <View style={styles.emotionalAlert}>
            <Text style={styles.emotionalAlertTitle}>⚠️ Gasto Emocional Detectado</Text>
            <Text style={styles.emotionalAlertText}>
              Estás estresado y esto es un deseo. ¿Seguro que quieres continuar?
            </Text>
          </View>
        )}

        {/* Botones de acción */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.submitButton, isEmotionalSpending && styles.submitButtonWarning]}
            onPress={handleSubmit}
            disabled={!amount || !description}
          >
            <Text style={styles.submitButtonText}>
              {isEmotionalSpending ? 'Registrar Igualmente' : '💾 Registrar Conscientemente'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ResourcesColors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: ResourcesColors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: ResourcesColors.textPrimary,
  },
  cancelButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ResourcesColors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: ResourcesColors.textSecondary,
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
    fontWeight: '600',
    color: ResourcesColors.textPrimary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: ResourcesColors.textSecondary,
    marginBottom: 12,
  },
  transactionTypeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: ResourcesColors.background,
    borderRadius: 8,
    padding: 4,
  },
  transactionTypeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  transactionTypeButtonActive: {
    backgroundColor: ResourcesColors.primary,
  },
  transactionTypeButtonText: {
    fontSize: 14,
    color: ResourcesColors.textSecondary,
    fontWeight: '500',
  },
  transactionTypeButtonTextActive: {
    color: ResourcesColors.surface,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '700',
    color: ResourcesColors.textPrimary,
    padding: 12,
    borderBottomWidth: 2,
    borderBottomColor: ResourcesColors.primary,
  },
  currencyLabel: {
    fontSize: 14,
    color: ResourcesColors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  descriptionInput: {
    fontSize: 16,
    color: ResourcesColors.textPrimary,
    padding: 12,
    borderWidth: 1,
    borderColor: ResourcesColors.border,
    borderRadius: 8,
    minHeight: 60,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryItem: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: ResourcesColors.border,
    borderRadius: 12,
    backgroundColor: ResourcesColors.background,
    width: '22%',
  },
  categoryItemSelected: {
    backgroundColor: ResourcesColors.primary,
    borderColor: ResourcesColors.primary,
  },
  categoryEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 10,
    color: ResourcesColors.textSecondary,
    textAlign: 'center',
  },
  categoryLabelSelected: {
    color: ResourcesColors.surface,
  },
  emotionalGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  emotionalItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
  },
  emotionalEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  emotionalLabel: {
    fontSize: 12,
    color: ResourcesColors.textSecondary,
  },
  emotionalLabelSelected: {
    color: ResourcesColors.surface,
    fontWeight: '600',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: ResourcesColors.border,
    borderRadius: 8,
  },
  typeButtonSelected: {
    backgroundColor: ResourcesColors.primary,
    borderColor: ResourcesColors.primary,
  },
  typeEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  typeButtonText: {
    fontSize: 14,
    color: ResourcesColors.textSecondary,
  },
  typeButtonTextSelected: {
    color: ResourcesColors.surface,
    fontWeight: '600',
  },
  recurringContainer: {
    alignItems: 'center',
  },
  recurringToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: ResourcesColors.border,
    borderRadius: 20,
  },
  recurringToggleActive: {
    backgroundColor: ResourcesColors.recurringBadge,
    borderColor: ResourcesColors.recurringBadge,
  },
  recurringEmoji: {
    fontSize: 16,
  },
  recurringText: {
    fontSize: 12,
    color: ResourcesColors.textSecondary,
  },
  recurringTextActive: {
    color: ResourcesColors.surface,
  },
  emotionalAlert: {
    backgroundColor: ResourcesColors.emotionalFlag,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  emotionalAlertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: ResourcesColors.surface,
    marginBottom: 4,
  },
  emotionalAlertText: {
    fontSize: 12,
    color: ResourcesColors.surface,
  },
  actions: {
    marginTop: 24,
  },
  submitButton: {
    backgroundColor: ResourcesColors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonWarning: {
    backgroundColor: ResourcesColors.emotionalFlag,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: ResourcesColors.surface,
  },
});
