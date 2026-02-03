import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Home, ShoppingBag, Zap, Utensils, Car, Stethoscope, MoreHorizontal, Heart, Brain, Smile, Frown, Calendar, AlertCircle } from 'lucide-react-native';
import { MindfulExpense, ExpenseCategory, EmotionalState } from '../types';
import { Colors } from '../types/colors';

interface MindfulTransactionsProps {
  expenses: MindfulExpense[];
  onTransactionPress?: (expense: MindfulExpense) => void;
}

const getCategoryIcon = (category: ExpenseCategory) => {
  switch (category) {
    case 'home': return Home;
    case 'clothing': return ShoppingBag;
    case 'services': return Zap;
    case 'leisure': return Smile;
    case 'food': return Utensils;
    case 'transport': return Car;
    case 'health': return Stethoscope;
    case 'other': return MoreHorizontal;
    default: return MoreHorizontal;
  }
};

const getCategoryLabel = (category: ExpenseCategory): string => {
  switch (category) {
    case 'home': return 'Casa';
    case 'clothing': return 'Ropa';
    case 'services': return 'Servicios';
    case 'leisure': return 'Ocio';
    case 'food': return 'Comida';
    case 'transport': return 'Transporte';
    case 'health': return 'Salud';
    case 'other': return 'Otros';
    default: return 'Otros';
  }
};

const getEmotionalIcon = (state: EmotionalState) => {
  switch (state) {
    case 'calm': return Brain;
    case 'happy': return Smile;
    case 'stressed': return Frown;
    case 'tired': return Heart;
    default: return Brain;
  }
};

const getEmotionalColor = (state: EmotionalState): string => {
  return Colors.emotional[state];
};

const formatTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `Hace ${diffMinutes} min`;
  } else if (diffHours < 24) {
    return `Hace ${diffHours} h`;
  } else {
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays} d`;
  }
};

export const MindfulTransactions: React.FC<MindfulTransactionsProps> = ({
  expenses,
  onTransactionPress
}) => {
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transacciones Conscientes</Text>
        <Text style={styles.subtitle}>
          {expenses.length} {expenses.length === 1 ? 'registro' : 'registros'}
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {sortedExpenses.map((expense) => {
          const CategoryIcon = getCategoryIcon(expense.category);
          const EmotionalIcon = getEmotionalIcon(expense.emotionalState);
          
          return (
            <TouchableOpacity
              key={expense.id}
              style={styles.transactionItem}
              onPress={() => onTransactionPress?.(expense)}
              activeOpacity={0.7}
            >
              <View style={styles.transactionLeft}>
                <View style={styles.categoryContainer}>
                  <View style={[
                    styles.categoryIcon,
                    { backgroundColor: expense.isRecurring ? Colors.accent : Colors.surface }
                  ]}>
                    <CategoryIcon 
                      size={16} 
                      color={expense.isRecurring ? Colors.cardBackground : Colors.accent} 
                    />
                  </View>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryName}>
                      {getCategoryLabel(expense.category)}
                    </Text>
                    <Text style={styles.expenseType}>
                      {expense.expenseType === 'need' ? 'Necesidad' : 'Deseo'}
                    </Text>
                  </View>
                </View>

                <View style={styles.emotionalContainer}>
                  <EmotionalIcon size={12} color={getEmotionalColor(expense.emotionalState)} />
                  <Text style={styles.emotionalLabel}>
                    {expense.emotionalState === 'calm' ? 'Tranquilo' :
                     expense.emotionalState === 'happy' ? 'Feliz' :
                     expense.emotionalState === 'stressed' ? 'Estresado' : 'Cansado'}
                  </Text>
                </View>
              </View>

              <View style={styles.transactionRight}>
                <Text style={[
                  styles.amount,
                  expense.isEmotionalSpending && { color: Colors.caution }
                ]}>
                  -${expense.amount.toFixed(2)}
                </Text>
                
                <View style={styles.metadata}>
                  <Text style={styles.time}>
                    {formatTime(expense.timestamp)}
                  </Text>
                  
                  {expense.isRecurring && (
                    <View style={styles.flowBadge}>
                      <Calendar size={10} color={Colors.cardBackground} />
                      <Text style={styles.flowBadgeText}>En Flow</Text>
                    </View>
                  )}
                  
                  {expense.isEmotionalSpending && (
                    <View style={styles.emotionalBadge}>
                      <AlertCircle size={10} color={Colors.cardBackground} />
                      <Text style={styles.emotionalBadgeText}>Emocional</Text>
                    </View>
                  )}
                </View>

                {expense.description && (
                  <Text style={styles.description} numberOfLines={1}>
                    {expense.description}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {expenses.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No hay transacciones registradas
            </Text>
            <Text style={styles.emptySubtext}>
              Comienza a registrar tus gastos de forma consciente
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
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
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  scrollContainer: {
    maxHeight: 300,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  transactionLeft: {
    flex: 1,
    marginRight: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  expenseType: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  emotionalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  emotionalLabel: {
    fontSize: 10,
    color: Colors.textLight,
  },
  transactionRight: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  time: {
    fontSize: 10,
    color: Colors.textLight,
  },
  flowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  flowBadgeText: {
    fontSize: 8,
    color: Colors.cardBackground,
    fontWeight: '500',
  },
  emotionalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.caution,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  emotionalBadgeText: {
    fontSize: 8,
    color: Colors.cardBackground,
    fontWeight: '500',
  },
  description: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    maxWidth: 150,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
});
