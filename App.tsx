import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import ApiService from './src/services/ApiService';

export default function App() {
  useEffect(() => {
    // Inicializa o serviço de API
    ApiService.init();
  }, []);

  return <AppNavigator />;
}
