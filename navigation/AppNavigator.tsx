import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from '../screens/HomeScreen';
import ResourcesScreen from '../screens/ResourcesScreen';
import { BottomNavigation } from '../components/BottomNavigation';

type TabType = 'flow' | 'resources' | 'insights' | 'profile';

const AppNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('flow');

  const renderScreen = () => {
    switch (activeTab) {
      case 'flow':
        return <HomeScreen />;
      case 'resources':
        return <ResourcesScreen />;
      case 'insights':
        return <View style={styles.placeholderScreen} />;
      case 'profile':
        return <View style={styles.placeholderScreen} />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        {renderScreen()}
      </View>
      
      <BottomNavigation
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
  },
  placeholderScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});

export default AppNavigator;
