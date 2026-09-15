import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaListaPontos, { pontosMock, Ponto } from './TelaListaPontos';
import TelaDetalhePontos from './TelaDetalhePonto';

const Stack = createNativeStackNavigator();

export default function App() {
  const [pontos, setPontos] = useState<Ponto[]>(pontosMock);

  function registrarDoacao(pontoId: number, quantidade: number) {
    setPontos((pontosAtuais) =>
      pontosAtuais.map((p) =>
        p.id === pontoId
          ? { ...p, quantidadeAlimentos: p.quantidadeAlimentos + quantidade }
          : p
      )
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Lista"
        screenOptions={{
          contentStyle: { flex: 1, backgroundColor: '#F4F6F8' },
        }}
      >
        <Stack.Screen name="Lista" options={{ title: 'Pontos de Coleta' }}>
          {(props: any) => (
            <TelaListaPontos
              {...props}
              pontos={pontos}
              onRegistrarDoacao={registrarDoacao}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Detalhe" options={{ title: 'Detalhes do Ponto' }}>
          {(props: any) => <TelaDetalhePontos {...props} pontos={pontos} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}