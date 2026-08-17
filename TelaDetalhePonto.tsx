import React from 'react';
import { View, StyleSheet, Text } from "react-native";
import { Ponto, pontosMock } from "./TelaListaPontos";

function DetalheDoPonto({ ponto }: { ponto: Ponto }) {
  return (
    <View style={stylesCard.container}>
      <Text style={stylesCard.titulo}>{ponto.nome}</Text>
      
      <View style={stylesCard.infoContainer}>
        <Text style={stylesCard.label}>Tipo de Serviço:</Text>
        <Text style={stylesCard.texto}>{ponto.tipo}</Text>
      </View>

      <View style={stylesCard.infoContainer}>
        <Text style={stylesCard.label}>Endereço:</Text>
        <Text style={stylesCard.texto}>{ponto.endereco}</Text>
      </View>

      <View style={stylesCard.infoContainer}>
        <Text style={stylesCard.label}>Dias e Horários:</Text>
        <Text style={stylesCard.texto}>{ponto.horario}</Text>
      </View>

      <View style={stylesCard.infoContainer}>
        <Text style={stylesCard.label}>Itens Aceitos/Distribuídos:</Text>
        <Text style={stylesCard.texto}>{ponto.itens}</Text>
      </View>

      <View style={stylesCard.infoContainer}>
        <Text style={stylesCard.label}>Total de Alimentos Registrados:</Text>
        <Text style={stylesCard.texto}>{ponto.quantidadeAlimentos}</Text>
      </View>
    </View>
  );
}

export default function TelaDetalhePontos({ route }: any) {
  const { id } = route.params;
  const pontoEncontrado = pontosMock.find((p) => p.id === id);

  if (!pontoEncontrado) {
    return (
      <View style={styles.container}>
        <Text>Ponto de coleta não encontrado.</Text>
      </View>
    );
  }

  return <DetalheDoPonto ponto={pontoEncontrado} />
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }
});

const stylesCard = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#888',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  texto: {
    fontSize: 16,
    color: '#444',
    marginTop: 4,
  }
});