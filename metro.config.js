const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Habilitar Fast Refresh
config.resolver.assetExts.push(
  // ...extensión de archivos si necesitas
);

// Configuración para mejor sincronización
config.watchFolders = [
  // Monitorear cambios en carpetas específicas
];

module.exports = config;
