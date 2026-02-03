// Paleta de colores consistente para toda la aplicación
export const Colors = {
  // Colores principales (crema)
  primary: '#F4E4C1', // Crema oscuro
  secondary: '#E8D5B7', // Crema medio
  tertiary: '#DCC9A6', // Crema claro
  
  // Acentos y texto
  accent: '#8B7355', // Marrón suave para textos e iconos
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
  
  // Sombras
  shadow: '#000000',
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

// Colores para finanzas (manteniendo compatibilidad)
export const FinanceColors = {
  positive: '#4CAF50', // Verde para positivos
  neutral: '#FF9800', // Naranja para neutrales  
  caution: '#F44336', // Rojo para precaución
};
