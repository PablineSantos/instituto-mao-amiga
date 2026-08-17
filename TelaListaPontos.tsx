import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View, FlatList } from "react-native";

export type Ponto = {
  id: number;
  nome: string;
  endereco: string;
  horario: string;
  itens: string;
  tipo: string;
  quantidadeAlimentos: number;
};

export const pontosMock: Ponto[] = [
  { id: 1, nome: "Ponto Universitário", endereco: "Setor Leste Universitário, Goiânia - GO", horario: "Seg a Sex, 08h às 18h", itens: "Recebe alimentos não perecíveis", tipo: "Coleta", quantidadeAlimentos: 1000 },
  { id: 2, nome: "Central Fatesg", endereco: "Faculdade SENAI Fatesg, Goiânia - GO", horario: "Seg a Sab, 09h às 21h", itens: "Recebe e distribui eletrônicos e roupas", tipo: "Coleta e Distribuição", quantidadeAlimentos: 450 },
  { id: 3, nome: "Base Solidária Anicuns", endereco: "Centro, Anicuns - GO", horario: "Ter a Dom, 07h às 17h", itens: "Distribui cestas básicas", tipo: "Distribuição", quantidadeAlimentos: 980 },
  { id: 4, nome: "Coleta Leste", endereco: "Rua 227, Setor Leste Universitário, Goiânia - GO", horario: "Seg a Sex, 06h às 22h", itens: "Recebe roupas e calçados", tipo: "Coleta", quantidadeAlimentos: 190 },
  { id: 5, nome: "Distribuição Alfa", endereco: "Av. Anhanguera, Centro, Goiânia - GO", horario: "Seg a Sex, 08h às 17h", itens: "Distribui refeições prontas", tipo: "Distribuição", quantidadeAlimentos: 300 },
  { id: 6, nome: "Comunidade Beta", endereco: "Jardim América, Goiânia - GO", horario: "Sab e Dom, 08h às 12h", itens: "Recebe brinquedos e livros", tipo: "Coleta", quantidadeAlimentos: 50 },
  { id: 7, nome: "Apoio Sigma", endereco: "Setor Bueno, Goiânia - GO", horario: "Seg a Sab, 10h às 16h", itens: "Distribui kits de higiene", tipo: "Distribuição", quantidadeAlimentos: 200 },
  { id: 8, nome: "Estação Ômega", endereco: "Setor Campinas, Goiânia - GO", horario: "Todos os dias, 24h", itens: "Recebe doações em geral", tipo: "Coleta", quantidadeAlimentos: 850 },
];

export default function TelaListaPontos({ navigation }: any) {
  return (
    <View style={styles.container}>
      <FlatList
        data={pontosMock}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.item}
            onPress={() => navigation.navigate('Detalhe', { id: item.id })}
          >
            <Text style={styles.titulo}>{item.nome}</Text>
            <Text style={styles.subtitulo}>{item.tipo}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#CCC',
    marginBottom: 8 
  },
  titulo: { fontSize: 18, fontWeight: 'bold' },
  subtitulo: { fontSize: 14, color: '#666', marginTop: 4 }
});