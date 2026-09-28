import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
  Keyboard,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { salvarDoacao, listarDoacoes } from './doacoesStorage';

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

export default function TelaListaPontos({
  navigation,
  pontos: pontosProps = pontosMock,
  onRegistrarDoacao,
}: any) {
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestino, setPontoDestino] = useState('');
  const [erro, setErro] = useState('');

  const [pontosLocais, setPontosLocais] = useState<Ponto[]>(pontosProps);
  const pontos = onRegistrarDoacao ? pontosProps : pontosLocais;

  useEffect(() => {
    if (!onRegistrarDoacao) {
      listarDoacoes().then((doacoes) => {
        if (doacoes && doacoes.length > 0) {
          setPontosLocais((atuais) =>
            atuais.map((p) => {
              const totalDoado = doacoes
                .filter((d) => d.pontoId === p.id)
                .reduce((acc, d) => acc + (Number(d.quantidade) || 0), 0);
              return totalDoado > 0
                ? { ...p, quantidadeAlimentos: p.quantidadeAlimentos + totalDoado }
                : p;
            })
          );
        }
      });
    }
  }, [onRegistrarDoacao]);

  const inputQuantidadeRef = useRef<TextInput>(null);
  const inputPontoDestinoRef = useRef<TextInput>(null);

  async function validarESalvar() {
    if (tipoItem.trim() === '') {
      setErro('O tipo do item não pode ficar vazio.');
      return;
    }

    if (tipoItem.trim().length < 2) {
      setErro('O tipo do item deve ter pelo menos 2 caracteres.');
      return;
    }

    if (quantidade.trim() === '') {
      setErro('A quantidade não pode ficar vazia.');
      return;
    }

    const quantidadeNumerica = Number(quantidade.trim());
    if (isNaN(quantidadeNumerica) || !/^\d+$/.test(quantidade.trim())) {
      setErro('A quantidade deve ser um número inteiro válido.');
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

    const busca = pontoDestino.trim().toLowerCase();
    const pontoEncontrado = pontos.find(
      (p: Ponto) =>
        p.nome.toLowerCase() === busca ||
        p.nome.toLowerCase().includes(busca) ||
        String(p.id) === busca
    );

    try {
      await salvarDoacao({
        tipoItem: tipoItem.trim(),
        quantidade: quantidadeNumerica,
        pontoDestino: pontoEncontrado ? pontoEncontrado.nome : pontoDestino.trim(),
        pontoId: pontoEncontrado ? pontoEncontrado.id : undefined,
      });
    } catch (e) {
      console.error('Erro ao salvar doação:', e);
    }

    if (pontoEncontrado) {
      if (onRegistrarDoacao) {
        onRegistrarDoacao(pontoEncontrado.id, quantidadeNumerica);
      } else {
        setPontosLocais((atuais) =>
          atuais.map((p) =>
            p.id === pontoEncontrado.id
              ? { ...p, quantidadeAlimentos: p.quantidadeAlimentos + quantidadeNumerica }
              : p
          )
        );
      }
    }

    Alert.alert(
      'Sucesso',
      `Doação de ${quantidadeNumerica} ${tipoItem}(s) para "${pontoDestino.trim()}" registrada com sucesso!`
    );

    setTipoItem('');
    setQuantidade('');
    setPontoDestino('');
    setErro('');
    Keyboard.dismiss();
  }

  return (
    <ScrollView
      style={[
        styles.scrollView,
        Platform.OS === 'web' && ({ height: '100%', maxHeight: '100%', overflowY: 'scroll' } as any),
      ]}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={true}
      persistentScrollbar={true}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
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
              style={[styles.input, styles.inputQuantidade]}
              placeholder="Quantidade"
              placeholderTextColor="#888"
              value={quantidade}
              onChangeText={(texto) => setQuantidade(texto.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              inputMode="numeric"
              returnKeyType="next"
              onSubmitEditing={() => inputPontoDestinoRef.current?.focus()}
            />
            <TextInput
              ref={inputPontoDestinoRef}
              style={[styles.input, styles.inputDestino]}
              placeholder="Ponto de destino"
              placeholderTextColor="#888"
              value={pontoDestino}
              onChangeText={setPontoDestino}
              returnKeyType="done"
              onSubmitEditing={validarESalvar}
            />
          </View>

          {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

          <TouchableOpacity
            style={styles.botaoSalvar}
            onPress={validarESalvar}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotao}>Registrar Doação</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoHistorico}
            onPress={() => navigation.navigate('MinhasDoacoes')}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotaoHistorico}>Ver Minhas Doações</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <View style={styles.divider} />

      <Text style={styles.listaTitle}>Pontos de Coleta Disponíveis</Text>

      {pontos.map((item: Ponto) => (
        <TouchableOpacity 
          key={item.id}
          style={styles.item}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Detalhe', { id: item.id })}
        >
          <Text style={styles.titulo}>{item.nome}</Text>
          <Text style={styles.subtitulo}>
            {item.tipo} • {item.quantidadeAlimentos} alimentos registrados
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    height: '100%',
    backgroundColor: '#F4F6F8',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
  },
  keyboardView: {
    width: '100%',
  },
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
    width: '100%',
  },
  formTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
  },
  input: {
    minHeight: 48,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: '100%',
    flexShrink: 1,
  },
  inputQuantidade: {
    flex: 1,
    minWidth: 100,
    width: undefined,
  },
  inputDestino: {
    flex: 2,
    minWidth: 130,
    width: undefined,
  },
  erro: { color: '#C62828', marginBottom: 12, fontSize: 14, fontWeight: '500' },
  botaoSalvar: {
    backgroundColor: '#2563EB',
    minHeight: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  textoBotao: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  botaoHistorico: {
    backgroundColor: '#EEF2FF',
    minHeight: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    width: '100%',
  },
  textoBotaoHistorico: { color: '#3730A3', fontSize: 16, fontWeight: 'bold' },
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
    minHeight: 48,
    justifyContent: 'center',
  },
  titulo: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  subtitulo: { fontSize: 14, color: '#6B7280', marginTop: 4 },
});