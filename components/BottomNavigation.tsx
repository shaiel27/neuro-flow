import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Brain, Wallet, BarChart3, User } from 'lucide-react-native';
import { Colors } from '../types/colors';

type TabType = 'flow' | 'resources' | 'insights' | 'profile';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabPress
}) => {
  const tabs = [
    {
      id: 'flow' as TabType,
      label: 'Flow',
      icon: Home,
    },
    {
      id: 'resources' as TabType,
      label: 'Finanzas',
      icon: Wallet,
    },
    {
      id: 'insights' as TabType,
      label: 'Análisis',
      icon: BarChart3,
    },
    {
      id: 'profile' as TabType,
      label: 'Perfil',
      icon: User,
    }
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <Icon 
              size={20} 
              color={isActive ? Colors.primary : Colors.textLight} 
            />
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.surface,
  },
  tabLabel: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 4,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
