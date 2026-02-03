import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Transaction, TransactionCategory, EmotionalState } from '../../types/resources';
import { ResourcesColors } from '../../types/resourcesColors';

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionPress?: (transaction: Transaction) => void;
  onEditPress?: (transaction: Transaction) => void;
}

const categoryEmojis: Record<TransactionCategory, string> = {
  housing: '🏠',
  clothing: '👕',
  services: '⚡',
  leisure: '🎮',
  food: '🍕',
  transport: '🚗',
  health: '❤️',
  other: '📦',
};

const emotionalEmojis: Record<EmotionalState, string> = {
  stressed: '😰',
  happy: '😊',
  tired: '😴',
  neutral: '😐',
};

const emotionalColors: Record<EmotionalState, string> = {
  stressed: ResourcesColors.emotionalStressed,
  happy: ResourcesColors.emotionalHappy,
  tired: ResourcesColors.emotionalTired,
  neutral: ResourcesColors.emotionalNeutral,
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const TransactionItem: React.FC<{
  transaction: Transaction;
  onPress?: () => void;
  onEditPress?: () => void;
}> = ({ transaction, onPress, onEditPress }) => {
  const categoryEmoji = categoryEmojis[transaction.category];
  const emotionalEmoji = emotionalEmojis[transaction.emotionalState];
  const emotionalColor = emotionalColors[transaction.emotionalState];

  return (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.transactionLeft}>
        <View style={styles.categoryIcon}>
          <Text style={styles.categoryEmoji}>{categoryEmoji}</Text>
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>{transaction.description}</Text>
          <View style={styles.transactionMeta}>
            <Text style={styles.transactionDate}>{formatDate(transaction.timestamp)}</Text>
            <View style={[styles.emotionalIndicator, { backgroundColor: emotionalColor }]}>
              <Text style={styles.emotionalEmoji}>{emotionalEmoji}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.transactionRight}>
        <View style={styles.amountContainer}>
          <Text style={[
            styles.transactionAmount,
            transaction.amount < 0 && styles.expenseAmount
          ]}>
            {formatCurrency(transaction.amount)}
          </Text>
          <Text style={[
            styles.transactionType,
            transaction.type === 'need' ? styles.needType : styles.wantType
          ]}>
            {transaction.type === 'need' ? '✅ Necesidad' : '🎯 Deseo'}
          </Text>
        </View>

        <View style={styles.badges}>
          {transaction.isRecurring && (
            <View style={styles.recurringBadge}>
              <Text style={styles.badgeText}>🔄 Programado en Flow</Text>
            </View>
          )}
          {transaction.scheduledInFlow && (
            <View style={styles.flowBadge}>
              <Text style={styles.badgeText}>📅 En Flow</Text>
            </View>
          )}
          {transaction.isEmotionalSpending && (
            <View style={styles.emotionalBadge}>
              <Text style={styles.badgeText}>⚠️ Emocional</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

type ListItem = Transaction | { type: 'header'; title: string; count: number };

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onTransactionPress,
  onEditPress
}) => {
  const sortedTransactions = [...transactions].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TransactionItem
      transaction={item}
      onPress={() => onTransactionPress?.(item)}
      onEditPress={() => onEditPress?.(item)}
    />
  );

  // Agrupar transacciones por fecha
  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const groups: { [key: string]: Transaction[] } = {};
    
    transactions.forEach(transaction => {
      const dateKey = transaction.timestamp.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
    });

    return Object.entries(groups).map(([date, transactions]) => ({
      title: new Date(date).toLocaleDateString('es-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      }),
      data: transactions,
    }));
  };

  const sections = groupTransactionsByDate(sortedTransactions);

  // Crear datos planos para FlatList con headers
  const flatData: ListItem[] = [];
  
  sections.forEach(section => {
    flatData.push({
      type: 'header',
      title: section.title,
      count: section.data.length
    });
    flatData.push(...section.data);
  });

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{item.title}</Text>
          <Text style={styles.sectionCount}>{item.count} transacciones</Text>
        </View>
      );
    }
    return renderTransaction({ item: item as Transaction });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transacciones</Text>
        <Text style={styles.subtitle}>
          {transactions.length} transacciones totales
        </Text>
      </View>

      <FlatList
        data={flatData}
        keyExtractor={(item, index) => 
          item.type === 'header' ? `header-${item.title}-${index}` : item.id
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ResourcesColors.background,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: ResourcesColors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: ResourcesColors.textSecondary,
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: ResourcesColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: ResourcesColors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ResourcesColors.textPrimary,
  },
  sectionCount: {
    fontSize: 12,
    color: ResourcesColors.textSecondary,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: ResourcesColors.border,
    backgroundColor: ResourcesColors.surface,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ResourcesColors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: ResourcesColors.textPrimary,
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transactionDate: {
    fontSize: 12,
    color: ResourcesColors.textSecondary,
  },
  emotionalIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emotionalEmoji: {
    fontSize: 12,
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: ResourcesColors.stressLow,
  },
  expenseAmount: {
    color: ResourcesColors.textPrimary,
  },
  transactionType: {
    fontSize: 10,
    fontWeight: '500',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  needType: {
    backgroundColor: ResourcesColors.needColor,
    color: ResourcesColors.surface,
  },
  wantType: {
    backgroundColor: ResourcesColors.wantColor,
    color: ResourcesColors.surface,
  },
  badges: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
    maxWidth: 140,
  },
  recurringBadge: {
    backgroundColor: ResourcesColors.recurringBadge,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  flowBadge: {
    backgroundColor: ResourcesColors.flowBadge,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  emotionalBadge: {
    backgroundColor: ResourcesColors.emotionalFlag,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '600',
    color: ResourcesColors.surface,
  },
});
