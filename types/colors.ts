// Paleta de colores consistente para toda la aplicación
export const Colors = {
  // Colores principales (crema)
  primary: '#F4E4C1', // Crema oscuro
  secondary: '#E8D5B7', // Crema medio
  tertiary: '#DCC9A6', // Crema claro
  
  // Acentos y texto
  accent: '#8B7355', // Marrón suave para textos e iconos
  accentLight: '#A68B6B', // Marrón más claro
  textPrimary: '#424242', // Texto principal
  textSecondary: '#6B7280', // Texto secundario
  textLight: '#9CA3AF', // Texto ligero
  
  // Fondos
  background: '#FAFAFA', // Fondo principal
  cardBackground: '#FFFFFF', // Fondo de tarjetas
  surface: '#F9F3E9', // Superficies secundarias
  
  // Estados especiales
  rest: '#81C784', // Verde suave para descanso
  border: '#F5F5F5', // Bordes sutiles
  
  // Estados financieros y emocionales
  positive: '#4CAF50', // Verde para positivos
  caution: '#FF9800', // Naranja para precaución
  negative: '#F44336', // Rojo para negativos
  
  // Sombras
  shadow: '#000000',
  
  // Colores emocionales (para compatibilidad)
  emotional: {
    calm: '#4CAF50',
    happy: '#4CAF50',
    stressed: '#FF9800',
    tired: '#F44336',
  },
};

// Colores por nivel de energía
export const EnergyColors = {
  high: Colors.primary,
  medium: Colors.secondary,
  low: Colors.tertiary,
  rest: Colors.rest,
};

// Colores por carga cognitiva
export const CognitiveLoadColors = {
  high: Colors.primary,
  medium: Colors.secondary,
  low: Colors.tertiary,
  rest: Colors.rest,
};

// Colores por carga financiera
export const FinancialLoadColors = {
  high: Colors.caution,
  medium: Colors.accent,
  low: Colors.positive,
};

// Colores para finanzas (manteniendo compatibilidad)
export const FinanceColors = {
  positive: Colors.positive,
  neutral: Colors.accent,  
  caution: Colors.caution,
};

// Colores emocionales
export const EmotionalColors = {
  calm: Colors.positive,
  happy: Colors.positive,
  stressed: Colors.caution,
  tired: Colors.negative,
};
