import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaListaPontos, { pontosMock, Ponto } from './TelaListaPontos';
import TelaDetalhePontos from './TelaDetalhePonto';
import TelaMinhasDoacoes from './TelaMinhasDoacoes';
import { listarDoacoes } from './doacoesStorage';
const Stack = createNativeStackNavigator();

export default function App() {
  const [pontos, setPontos] = useState<Ponto[]>(pontosMock);

  useEffect(() => {
    async function carregarDoacoesSalvas() {
      try {
        const doacoes = await listarDoacoes();
        if (doacoes && doacoes.length > 0) {
          setPontos((pontosAtuais) =>
            pontosAtuais.map((p) => {
              const totalDoado = doacoes
                .filter((d) => d.pontoId === p.id)
                .reduce((acc, d) => acc + (Number(d.quantidade) || 0), 0);
              return totalDoado > 0
                ? { ...p, quantidadeAlimentos: p.quantidadeAlimentos + totalDoado }
                : p;
            })
          );
        }
      } catch (error) {
        console.error('Erro ao carregar histórico de doações:', error);
      }
    }

    carregarDoacoesSalvas();
  }, []);

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
        <Stack.Screen
          name="Lista"
          options={({ navigation }: any) => ({
            title: 'Pontos de Coleta',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('MinhasDoacoes')}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: '#2563EB',
                  borderRadius: 6,
                }}
                activeOpacity={0.8}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 }}>
                  Minhas Doações
                </Text>
              </TouchableOpacity>
            ),
          })}
        >
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
        <Stack.Screen name="MinhasDoacoes" options={{ title: 'Minhas doações' }}>
          {(props: any) => <TelaMinhasDoacoes {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}