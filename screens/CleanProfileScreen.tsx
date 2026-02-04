import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  RefreshControl,
  TextInput,
} from 'react-native';
import {
  User,
  Settings,
  Shield,
  Brain,
  Clock,
  Bell,
  Moon,
  ChevronRight,
  Eye,
  AlertCircle,
  CheckCircle,
  Zap,
  Activity,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../types/colors';
import { UserProfile, UserPreferences, IAuditLog } from '../types';
import { InsightService } from '../services/InsightService';

const CleanProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user_1',
    name: 'Alex Chen',
    baseSalary: 5000,
    email: 'alex@neuroflow.app',
    preferences: {
      antiProductivityMode: false,
      notificationsEnabled: true,
      darkMode: false,
      autoBreaks: true,
      breakDuration: 20,
      workingHours: {
        start: '09:00',
        end: '18:00'
      }
    }
  });

  const [auditLogs, setAuditLogs] = useState<IAuditLog[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [editingSalary, setEditingSalary] = useState(false);
  const [tempSalary, setTempSalary] = useState(userProfile.baseSalary.toString());

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = () => {
    const decisionLogs = InsightService.getDecisionLog();
    
    const formattedLogs: IAuditLog[] = decisionLogs.map((log, index) => ({
      id: `audit_${index}`,
      timestamp: log.timestamp,
      decision: log.decision,
      reasoning: log.reasoning,
      confidence: log.confidence,
      impact: log.confidence > 0.9 ? 'high' : log.confidence > 0.7 ? 'medium' : 'low',
      userAction: 'pending'
    }));

    setAuditLogs(formattedLogs);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadAuditLogs();
      setRefreshing(false);
    }, 1000);
  };

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    setUserProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const saveSalary = () => {
    const salary = parseFloat(tempSalary);
    if (!isNaN(salary) && salary > 0) {
      setUserProfile(prev => ({
        ...prev,
        baseSalary: salary
      }));
      setEditingSalary(false);
    }
  };

  // Componente de Setting Item
  const SettingItem: React.FC<{
    icon: React.ComponentType;
    title: string;
    subtitle?: string;
    value?: string | boolean;
    onToggle?: (value: boolean) => void;
    onPress?: () => void;
    showChevron?: boolean;
  }> = ({ icon: Icon, title, subtitle, value, onToggle, onPress, showChevron = true }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Text style={styles.settingIconText}>
            {title === 'Modo Anti-Productividad Tóxica' ? '⚡' :
             title === 'Pausas Automáticas' ? '⏱' :
             title === 'Notificaciones' ? '📢' : '🌓'}
          </Text>
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {typeof value === 'boolean' && onToggle && (
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: Colors.surface, true: Colors.accent }}
            thumbColor={Colors.cardBackground}
          />
        )}
        {typeof value === 'string' && (
          <Text style={styles.settingValue}>{value}</Text>
        )}
        {showChevron && (
          <ChevronRight size={16} color={Colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  // Componente de Audit Log
  const AuditLogItem: React.FC<{ log: IAuditLog }> = ({ log }) => {
    const getImpactColor = () => {
      switch (log.impact) {
        case 'high': return Colors.tertiary;
        case 'medium': return '#FA8C16';
        case 'low': return Colors.accent;
        default: return Colors.textSecondary;
      }
    };

    const getStatusIcon = () => {
      switch (log.userAction) {
        case 'accepted': return CheckCircle;
        case 'rejected': return AlertCircle;
        case 'pending': return Clock;
        default: return Eye;
      }
    };

    const StatusIcon = getStatusIcon();

    return (
      <View style={[styles.auditLogItem, { borderLeftColor: getImpactColor() }]}>
        <View style={styles.auditLogHeader}>
          <View style={styles.auditDecision}>
            <Text style={styles.auditDecisionText}>{log.decision}</Text>
            <View style={[styles.impactBadge, { backgroundColor: getImpactColor() }]}>
              <Text style={styles.impactText}>{log.impact}</Text>
            </View>
          </View>
          <View style={styles.auditMeta}>
            <StatusIcon size={16} color={Colors.textSecondary} />
            <Text style={styles.auditTime}>
              {new Date(log.timestamp).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
        </View>
        <Text style={styles.auditReasoning}>{log.reasoning}</Text>
        <View style={styles.auditFooter}>
          <Text style={styles.confidenceLabel}>
            Confianza: {Math.round(log.confidence * 100)}%
          </Text>
          <TouchableOpacity style={styles.auditAction}>
            <Text style={styles.auditActionText}>
              {log.userAction === 'pending' ? 'Revisar' : 
               log.userAction === 'accepted' ? 'Aceptado' : 'Rechazado'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={styles.headerSubtitle}>
          <User size={16} color={Colors.accent} />
          <Text style={styles.subtitleText}>Configuración</Text>
        </View>
      </View>

      {/* Contenido */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Información del Usuario */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos Personales</Text>
          
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userProfile.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userProfile.name}</Text>
                <Text style={styles.profileEmail}>{userProfile.email}</Text>
              </View>
            </View>
            
            <View style={styles.salarySection}>
              <View style={styles.salaryHeader}>
                <Text style={styles.salaryLabel}>Sueldo Base</Text>
                {!editingSalary && (
                  <TouchableOpacity onPress={() => setEditingSalary(true)}>
                    <Text style={styles.editButton}>Editar</Text>
                  </TouchableOpacity>
                )}
              </View>
              {editingSalary ? (
                <View style={styles.salaryEdit}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.salaryInput}
                    value={tempSalary}
                    onChangeText={setTempSalary}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                  <TouchableOpacity onPress={saveSalary} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Guardar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setEditingSalary(false)} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.salaryValue}>${userProfile.baseSalary.toLocaleString()}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Configuración Ética */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuracion Etica</Text>
          
          <SettingItem
            icon={Zap}
            title="Modo Anti-Productividad Tóxica"
            subtitle="Fuerza descansos de 20min independientemente de entregas"
            value={userProfile.preferences.antiProductivityMode}
            onToggle={(value) => updatePreference('antiProductivityMode', value)}
          />
          
          <SettingItem
            icon={Clock}
            title="Pausas Automáticas"
            subtitle={`Descansos de ${userProfile.preferences.breakDuration} minutos`}
            value={userProfile.preferences.autoBreaks}
            onToggle={(value) => updatePreference('autoBreaks', value)}
          />
          
          <SettingItem
            icon={Activity}
            title="Notificaciones"
            subtitle="Alertas de energía y finanzas"
            value={userProfile.preferences.notificationsEnabled}
            onToggle={(value) => updatePreference('notificationsEnabled', value)}
          />
          
          <SettingItem
            icon={Brain}
            title="Modo Oscuro"
            subtitle="Interfaz nocturna"
            value={userProfile.preferences.darkMode}
            onToggle={(value) => updatePreference('darkMode', value)}
          />
        </View>

        {/* Transparencia del Algoritmo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transparencia IA</Text>
          
          <View style={styles.auditHeader}>
            <Brain size={20} color={Colors.accent} />
            <Text style={styles.auditTitle}>
              Auditoría de Decisiones IA (Nivel 5)
            </Text>
          </View>
          
          <Text style={styles.auditDescription}>
            Revisa por qué la IA tomó decisiones recientes y su nivel de confianza.
          </Text>
          
          {auditLogs.map((log) => (
            <AuditLogItem key={log.id} log={log} />
          ))}
        </View>

        {/* Horario Laboral */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horario Trabajo</Text>
          
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleTime}>{userProfile.preferences.workingHours.start}</Text>
              <Text style={styles.scheduleLabel}>Inicio</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleTime}>{userProfile.preferences.workingHours.end}</Text>
              <Text style={styles.scheduleLabel}>Fin</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subtitleText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'lowercase',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  salarySection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
  },
  salaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  salaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    textTransform: 'lowercase',
  },
  editButton: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '500',
  },
  salaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  salaryEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  salaryInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    borderBottomWidth: 2,
    borderBottomColor: Colors.accent,
    paddingVertical: 4,
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.accent,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.surface,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingIconText: {
    fontSize: 20,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  auditHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  auditTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  auditDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  auditLogItem: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  auditLogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  auditDecision: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  auditDecisionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  impactText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  auditMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  auditTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  auditReasoning: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 12,
  },
  auditFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  auditAction: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.surface,
    borderRadius: 8,
  },
  auditActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.accent,
  },
  scheduleCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  scheduleLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    textTransform: 'lowercase',
  },
});

export default CleanProfileScreen;
