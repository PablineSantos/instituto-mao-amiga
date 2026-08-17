import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaListaPontos from './TelaListaPontos';
import TelaDetalhePontos from './TelaDetalhePonto';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Lista">
        <Stack.Screen
          name="Lista"
          component={TelaListaPontos}
          options={{ title: 'Pontos de Coleta' }}
        />
        <Stack.Screen
          name="Detalhe"
          component={TelaDetalhePontos}
          options={{ title: 'Detalhes do Ponto' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}