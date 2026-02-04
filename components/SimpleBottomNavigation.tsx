import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Wallet, BarChart3, User } from 'lucide-react-native';
import { Colors } from '../types/colors';

type TabType = 'flow' | 'resources' | 'insights' | 'profile';

interface SimpleBottomNavigationProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

export const SimpleBottomNavigation: React.FC<SimpleBottomNavigationProps> = ({
  activeTab,
  onTabPress
}) => {
  const tabs = [
    {
      id: 'flow' as TabType,
      label: 'flow',
      icon: Home,
    },
    {
      id: 'resources' as TabType,
      label: 'recursos',
      icon: Wallet,
    },
    {
      id: 'insights' as TabType,
      label: 'insights',
      icon: BarChart3,
    },
    {
      id: 'profile' as TabType,
      label: 'perfil',
      icon: User,
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.navigationBar}>
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
              <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                <Icon 
                  size={20} 
                  color={isActive ? Colors.accent : Colors.textSecondary} 
                />
              </View>
              <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                {tab.label}
              </Text>
              {isActive && (
                <View style={styles.activeIndicator} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  navigationBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingBottom: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 16,
    position: 'relative',
    minHeight: 60,
  },
  activeTab: {
    backgroundColor: Colors.surface,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeIconContainer: {
    backgroundColor: `${Colors.accent}20`, // 20% opacity
  },
  iconText: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
    textTransform: 'lowercase',
    letterSpacing: 0.5,
  },
  activeTabLabel: {
    color: Colors.accent,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.accent,
  },
});
