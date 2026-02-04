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
  Alert,
  Share,
  Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  Edit3,
  Calendar,
  Download,
  Upload,
  UserPlus,
  LogOut,
  RefreshCw,
} from 'lucide-react-native';
import { Colors } from '../types/colors';
import { UserProfile, UserPreferences, IAuditLog } from '../types';
import { InsightService } from '../services/InsightService';

const CleanProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user_1',
    name: 'Alex Chen',
    baseSalary: 5000,
    email: 'alex.chen@example.com',
    avatar: undefined,
    preferences: {
      antiProductivityMode: false,
      notificationsEnabled: true,
      darkMode: false,
      autoBreaks: true,
      breakDuration: 15,
      workingHours: {
        start: '09:00',
        end: '17:00'
      }
    }
  });

  const [refreshing, setRefreshing] = useState(false);
  const [editingSalary, setEditingSalary] = useState(false);
  const [tempSalary, setTempSalary] = useState(userProfile.baseSalary.toString());
  const [editingProfile, setEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(userProfile.name);
  const [tempEmail, setTempEmail] = useState(userProfile.email);

  type ScheduleCategory = 'trabajo' | 'personal' | 'salud' | 'aprendizaje';
  type ScheduleActivity = {
    id: string;
    dayIndex: number;
    title: string;
    startTime: string;
    endTime: string;
    category: ScheduleCategory;
    color: string;
  };

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] as const;
  const todayIndex = (new Date().getDay() + 6) % 7;

  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(todayIndex);
  const [scheduleFormOpen, setScheduleFormOpen] = useState(false);
  const [scheduleEditingId, setScheduleEditingId] = useState<string | null>(null);
  const [scheduleDraft, setScheduleDraft] = useState<Omit<ScheduleActivity, 'id'>>({
    dayIndex: todayIndex,
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    category: 'personal',
    color: Colors.accent,
  });

  const [scheduleActivities, setScheduleActivities] = useState<ScheduleActivity[]>(() => {
    const base: ScheduleActivity[] = [];
    for (let d = 0; d < 5; d++) {
      base.push({
        id: `work_${d}`,
        dayIndex: d,
        title: 'Trabajo',
        startTime: userProfile.preferences.workingHours.start,
        endTime: userProfile.preferences.workingHours.end,
        category: 'trabajo',
        color: Colors.primary,
      });
    }
    base.push({
      id: 'med_0',
      dayIndex: todayIndex,
      title: 'Meditación',
      startTime: '07:30',
      endTime: '07:45',
      category: 'salud',
      color: Colors.accent,
    });
    return base;
  });
  
  // Nuevos estados para funcionalidades avanzadas
  const [stats, setStats] = useState({
    totalInsights: 0,
    accuracyRate: 0,
    daysActive: 0,
    energySaved: 0
  });
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const [auditLogs, setAuditLogs] = useState<IAuditLog[]>([]);

  useEffect(() => {
    loadAuditLogs();
    calculateStats();
  }, []);

  const calculateStats = () => {
    // Simular cálculo de estadísticas
    setStats({
      totalInsights: 147,
      accuracyRate: 87,
      daysActive: 45,
      energySaved: 23
    });
  };

  const handleExportData = () => {
    const userData = {
      profile: userProfile,
      auditLogs,
      stats,
      exportDate: new Date().toISOString()
    };
    
    Share.share({
      message: JSON.stringify(userData, null, 2),
      title: 'NeuroFlow - Exportación de Datos'
    });
  };

  const handleImportData = () => {
    Alert.alert(
      'Importar Datos',
      'Esta acción sobreescribirá tus datos actuales. ¿Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Importar', onPress: () => console.log('Importar datos') }
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      'Restablecer Datos',
      '¿Estás seguro de que quieres restablecer todos los datos? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Restablecer', 
          style: 'destructive',
          onPress: () => {
            setAuditLogs([]);
            setStats({
              totalInsights: 0,
              accuracyRate: 0,
              daysActive: 0,
              energySaved: 0
            });
          }
        }
      ]
    );
  };

  const handleShareProfile = () => {
    Share.share({
      message: `Únete a NeuroFlow - ${userProfile.name} está optimizando su productividad y bienestar.`,
      title: 'NeuroFlow App'
    });
  };

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

  const timeToMinutes = (time: string) => {
    const parts = time.split(':');
    if (parts.length !== 2) return null;
    const h = Number(parts[0]);
    const m = Number(parts[1]);
    if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
    if (h < 0 || h > 23 || m < 0 || m > 59) return null;
    return h * 60 + m;
  };

  const getDurationMinutes = (startTime: string, endTime: string) => {
    const s = timeToMinutes(startTime);
    const e = timeToMinutes(endTime);
    if (s === null || e === null) return 0;
    return Math.max(0, e - s);
  };

  const openNewScheduleItem = () => {
    setScheduleEditingId(null);
    setScheduleDraft(prev => ({
      ...prev,
      dayIndex: selectedDayIndex,
      title: '',
      startTime: '09:00',
      endTime: '10:00',
      category: 'personal',
      color: Colors.accent,
    }));
    setScheduleFormOpen(true);
  };

  const openEditScheduleItem = (activityId: string) => {
    const activity = scheduleActivities.find(a => a.id === activityId);
    if (!activity) return;
    setScheduleEditingId(activityId);
    const { id: _id, ...rest } = activity;
    setSelectedDayIndex(rest.dayIndex);
    setScheduleDraft(rest);
    setScheduleFormOpen(true);
  };

  const deleteScheduleItem = (activityId: string) => {
    setScheduleActivities(prev => prev.filter(a => a.id !== activityId));
  };

  const saveScheduleDraft = () => {
    const s = timeToMinutes(scheduleDraft.startTime);
    const e = timeToMinutes(scheduleDraft.endTime);
    if (!scheduleDraft.title.trim()) {
      Alert.alert('Actividad', 'Agrega un nombre para la actividad.');
      return;
    }
    if (s === null || e === null) {
      Alert.alert('Horario', 'Formato de hora inválido. Usa HH:MM.');
      return;
    }
    if (e <= s) {
      Alert.alert('Horario', 'La hora de fin debe ser mayor que la de inicio.');
      return;
    }

    if (scheduleEditingId) {
      setScheduleActivities(prev =>
        prev.map(a => (a.id === scheduleEditingId ? { ...a, ...scheduleDraft } : a))
      );
    } else {
      const newItem: ScheduleActivity = {
        id: `act_${Date.now()}`,
        ...scheduleDraft,
      };
      setScheduleActivities(prev => [...prev, newItem]);
    }
    setScheduleFormOpen(false);
    setScheduleEditingId(null);
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
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Horario personal</Text>
            <TouchableOpacity style={styles.addPill} onPress={openNewScheduleItem}>
              <Text style={styles.addPillText}>Agregar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.daySelectorRow}>
            {weekDays.map((d, idx) => {
              const isActive = idx === selectedDayIndex;
              return (
                <TouchableOpacity
                  key={d}
                  onPress={() => {
                    setSelectedDayIndex(idx);
                    setScheduleDraft(prev => ({ ...prev, dayIndex: idx }));
                  }}
                  style={[styles.dayPill, isActive && styles.dayPillActive]}
                >
                  <Text style={[styles.dayPillText, isActive && styles.dayPillTextActive]}>{d}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {(() => {
            const dayItems = scheduleActivities
              .filter(a => a.dayIndex === selectedDayIndex)
              .sort((a, b) => (timeToMinutes(a.startTime) ?? 0) - (timeToMinutes(b.startTime) ?? 0));
            const totalMinutes = dayItems.reduce(
              (sum, a) => sum + getDurationMinutes(a.startTime, a.endTime),
              0
            );

            return (
              <>
                <View style={styles.scheduleMetaRow}>
                  <View style={styles.metaChip}>
                    <Text style={styles.metaChipText}>{dayItems.length} actividades</Text>
                  </View>
                  <View style={styles.metaChip}>
                    <Text style={styles.metaChipText}>{totalMinutes} min</Text>
                  </View>
                </View>

                <View style={styles.scheduleListCard}>
                  {dayItems.length === 0 ? (
                    <View style={styles.scheduleEmpty}>
                      <Text style={styles.scheduleEmptyText}>Sin actividades para este día</Text>
                      <Text style={styles.scheduleEmptySubtext}>Agrega tu primera actividad</Text>
                    </View>
                  ) : (
                    dayItems.map(a => (
                      <View key={a.id} style={styles.scheduleRow}>
                        <View style={[styles.scheduleColor, { backgroundColor: a.color }]} />
                        <View style={styles.scheduleMain}>
                          <Text style={styles.scheduleTitle}>{a.title}</Text>
                          <Text style={styles.scheduleTimeRange}>
                            {a.startTime}–{a.endTime} · {getDurationMinutes(a.startTime, a.endTime)}m
                          </Text>
                          <Text style={styles.scheduleCategory}>{a.category}</Text>
                        </View>
                        <View style={styles.scheduleActions}>
                          <TouchableOpacity onPress={() => openEditScheduleItem(a.id)}>
                            <Text style={styles.editButton}>Editar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => deleteScheduleItem(a.id)}>
                            <Text style={styles.deleteText}>×</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              </>
            );
          })()}

          {scheduleFormOpen && (
            <View style={styles.scheduleFormCard}>
              <Text style={styles.formTitleText}>
                {scheduleEditingId ? 'Editar actividad' : 'Nueva actividad'}
              </Text>

              <TextInput
                style={styles.formInput}
                placeholder="Nombre"
                value={scheduleDraft.title}
                onChangeText={(t) => setScheduleDraft(prev => ({ ...prev, title: t }))}
              />

              <View style={styles.timeRow}>
                <TextInput
                  style={[styles.formInput, styles.timeInput]}
                  placeholder="Inicio (HH:MM)"
                  value={scheduleDraft.startTime}
                  onChangeText={(t) => setScheduleDraft(prev => ({ ...prev, startTime: t }))}
                  maxLength={5}
                />
                <TextInput
                  style={[styles.formInput, styles.timeInput]}
                  placeholder="Fin (HH:MM)"
                  value={scheduleDraft.endTime}
                  onChangeText={(t) => setScheduleDraft(prev => ({ ...prev, endTime: t }))}
                  maxLength={5}
                />
              </View>

              <View style={styles.categoryRow}>
                {(['trabajo', 'personal', 'salud', 'aprendizaje'] as ScheduleCategory[]).map((c) => {
                  const active = scheduleDraft.category === c;
                  return (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setScheduleDraft(prev => ({ ...prev, category: c }))}
                      style={[styles.categoryChip, active && styles.categoryChipActive]}
                    >
                      <Text style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>{c}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.colorRow}>
                {[Colors.accent, Colors.primary, Colors.tertiary, '#FF9800', '#4CAF50', '#9C27B0'].map((color) => {
                  const active = scheduleDraft.color === color;
                  return (
                    <TouchableOpacity
                      key={color}
                      onPress={() => setScheduleDraft(prev => ({ ...prev, color }))}
                      style={[styles.colorDot, { backgroundColor: color }, active && styles.colorDotActive]}
                    />
                  );
                })}
              </View>

              <View style={styles.formButtonsRow}>
                <TouchableOpacity
                  style={[styles.formButton, styles.formButtonPrimary]}
                  onPress={saveScheduleDraft}
                >
                  <Text style={[styles.formButtonText, styles.formButtonTextPrimary]}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.formButton}
                  onPress={() => {
                    setScheduleFormOpen(false);
                    setScheduleEditingId(null);
                  }}
                >
                  <Text style={styles.formButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addPillText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
    textTransform: 'lowercase',
  },
  daySelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  dayPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  dayPillActive: {
    backgroundColor: `${Colors.accent}20`,
    borderColor: `${Colors.accent}40`,
  },
  dayPillText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  dayPillTextActive: {
    color: Colors.textPrimary,
  },
  scheduleMetaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  metaChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.surface,
  },
  metaChipText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    textTransform: 'lowercase',
  },
  scheduleListCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 12,
  },
  scheduleEmpty: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  scheduleEmptyText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  scheduleEmptySubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  scheduleColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  scheduleMain: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  scheduleTimeRange: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  scheduleCategory: {
    fontSize: 11,
    color: Colors.textLight,
    textTransform: 'lowercase',
  },
  scheduleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 10,
  },
  deleteText: {
    fontSize: 18,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  scheduleFormCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },
  formTitleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  formInput: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  timeInput: {
    flex: 1,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: `${Colors.primary}15`,
    borderColor: `${Colors.primary}35`,
  },
  categoryChipText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    textTransform: 'lowercase',
  },
  categoryChipTextActive: {
    color: Colors.textPrimary,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  colorDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  colorDotActive: {
    borderWidth: 2,
    borderColor: Colors.textPrimary,
  },
  formButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  formButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formButtonPrimary: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  formButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    textTransform: 'lowercase',
  },
  formButtonTextPrimary: {
    color: '#FFFFFF',
  },
});

export default CleanProfileScreen;
