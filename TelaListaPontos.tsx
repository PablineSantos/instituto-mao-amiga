import React, { useState, useRef } from 'react';
import { Text, TouchableOpacity, StyleSheet, View, FlatList, TextInput, Keyboard, Alert } from "react-native";

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

export default function TelaListaPontos({ navigation, pontos = pontosMock }: any) {
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestino, setPontoDestino] = useState('');
  const [erro, setErro] = useState('');

  const inputQuantidadeRef = useRef<TextInput>(null);
  const inputPontoDestinoRef = useRef<TextInput>(null);

  function validarESalvar() {
    if (tipoItem.trim() === '') {
      setErro('O tipo do item não pode ficar vazio.');
      return;
    }

    if (quantidade.trim() === '') {
      setErro('A quantidade não pode ficar vazia.');
      return;
    }

    const quantidadeNumerica = Number(quantidade.trim());
    if (isNaN(quantidadeNumerica) || !/^\d+$/.test(quantidade.trim())) {
      setErro('A quantidade deve ser um valor numérico válido.');
      return;
    }

    if (quantidadeNumerica <= 0) {
      setErro('A quantidade precisa ser maior que zero.');
      return;
    }

    if (pontoDestino.trim() === '') {
      setErro('O ponto de destino não pode ficar vazio.');
      return;
    }

    Alert.alert('Sucesso', `Doação de ${quantidadeNumerica} ${tipoItem}(s) para "${pontoDestino}" registrada com sucesso!`);

    setTipoItem('');
    setQuantidade('');
    setPontoDestino('');
    setErro('');
    Keyboard.dismiss();
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pontos}
        keyExtractor={(item: Ponto) => String(item.id)}
        ListHeaderComponent={
          <View>
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Registrar Doação</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Tipo do item (ex: Cesta Básica)"
                placeholderTextColor="#888"
                value={tipoItem}
                onChangeText={setTipoItem}
                returnKeyType="next"
                onSubmitEditing={() => inputQuantidadeRef.current?.focus()}
              />

              <View style={styles.row}>
                <TextInput
                  ref={inputQuantidadeRef}
                  style={[styles.input, { flex: 1, marginRight: 8 }]}
                  placeholder="Quantidade"
                  placeholderTextColor="#888"
                  value={quantidade}
                  onChangeText={setQuantidade}
                  keyboardType="numeric"
                  returnKeyType="next"
                  onSubmitEditing={() => inputPontoDestinoRef.current?.focus()}
                />
                <TextInput
                  ref={inputPontoDestinoRef}
                  style={[styles.input, { flex: 2, marginLeft: 8 }]}
                  placeholder="Ponto de destino"
                  placeholderTextColor="#888"
                  value={pontoDestino}
                  onChangeText={setPontoDestino}
                  returnKeyType="done"
                  onSubmitEditing={validarESalvar}
                />
              </View>

              {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

              <TouchableOpacity style={styles.botaoSalvar} onPress={validarESalvar}>
                <Text style={styles.textoBotao}>Registrar Doação</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <Text style={styles.listaTitle}>Pontos de Coleta Disponíveis</Text>
          </View>
        }
        renderItem={({ item }: { item: Ponto }) => (
          <TouchableOpacity 
            style={styles.item}
            activeOpacity={0.7}
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
  container: { flex: 1, padding: 16, backgroundColor: '#F4F6F8' },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },
  formTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  input: {
    height: 50,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  erro: { color: '#C62828', marginBottom: 12, fontSize: 14, fontWeight: '500' },
  botaoSalvar: {
    backgroundColor: '#2563EB',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotao: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 16 },
  listaTitle: { fontSize: 16, fontWeight: 'bold', color: '#6B7280', marginBottom: 12 },
  item: { 
    padding: 16, 
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1, 
    borderColor: '#E5E7EB',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1, 
  },
  titulo: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  subtitulo: { fontSize: 14, color: '#6B7280', marginTop: 4 }
});