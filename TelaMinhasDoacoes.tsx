import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { mensagemDeErro } from "./src/services/api";
import { Doacao, listarPagina } from "./src/services/doacoesService";

const ItemDoacao = React.memo(function ItemDoacao({
  doacao,
  onPress,
}: {
  doacao: Doacao;
  onPress: () => void;
}) {
  const data = doacao.criadoEm
    ? new Date(doacao.criadoEm).toLocaleString("pt-BR")
    : "Data não informada";
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.cardTitulo}>{doacao.tipoItem}</Text>
      <Text style={styles.cardLinha}>Quantidade: {doacao.quantidade}</Text>
      <Text style={styles.cardLinha}>Destino: {doacao.pontoDestino}</Text>
      <Text style={styles.cardLinha}>Data: {data}</Text>
    </TouchableOpacity>
  );
});

export default function TelaMinhasDoacoes({ navigation }: any) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [filtro, setFiltro] = useState("");
  const [filtroAplicado, setFiltroAplicado] = useState("");
  const [proximaPagina, setProximaPagina] = useState(0);
  const [ultimaPagina, setUltimaPagina] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erro, setErro] = useState("");

  const emAndamento = useRef(false);
  const requisicao = useRef(0);

  const carregarPagina = useCallback(
    async (termo: string, pagina: number, reiniciar: boolean) => {
      if (emAndamento.current && !reiniciar) {
        return;
      }
      emAndamento.current = true;
      const id = ++requisicao.current;
      if (reiniciar) {
        setCarregando(true);
      } else {
        setCarregandoMais(true);
      }
      try {
        const resposta = await listarPagina(termo, pagina);
        if (id !== requisicao.current) {
          return;
        }
        setDoacoes((atuais) =>
          reiniciar ? resposta.content : [...atuais, ...resposta.content],
        );
        setProximaPagina(pagina + 1);
        setUltimaPagina(pagina + 1 >= resposta.page.totalPages);
        setErro("");
      } catch (e) {
        if (id === requisicao.current) {
          setErro(mensagemDeErro(e, "Doação"));
        }
      } finally {
        if (id === requisicao.current) {
          emAndamento.current = false;
          setCarregando(false);
          setCarregandoMais(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const t = setTimeout(() => setFiltroAplicado(filtro.trim()), 400);
    return () => clearTimeout(t);
  }, [filtro]);

  // Reloads on focus so a new donation shows at the top when coming back.
  useFocusEffect(
    useCallback(() => {
      setUltimaPagina(false);
      carregarPagina(filtroAplicado, 0, true);
    }, [filtroAplicado, carregarPagina]),
  );

  function carregarMais() {
    if (ultimaPagina || emAndamento.current || erro) {
      return;
    }
    carregarPagina(filtroAplicado, proximaPagina, false);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.botaoNova}
        onPress={() => navigation.navigate("FormDoacao")}
        activeOpacity={0.8}
      >
        <Text style={styles.textoBotao}>+ Nova doação</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.busca}
        placeholder="Buscar por tipo de item..."
        placeholderTextColor="#9CA3AF"
        value={filtro}
        onChangeText={setFiltro}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {carregando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : erro && doacoes.length === 0 ? (
        <View style={styles.centro}>
          <Text style={styles.erro}>{erro}</Text>
          <TouchableOpacity
            style={styles.botaoNova}
            onPress={() => carregarPagina(filtroAplicado, 0, true)}
          >
            <Text style={styles.textoBotao}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={doacoes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          onEndReached={carregarMais}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={
            <Text style={styles.vazio}>
              {filtroAplicado
                ? `Nenhuma doação encontrada para "${filtroAplicado}".`
                : "Nenhuma doação registrada ainda."}
            </Text>
          }
          ListFooterComponent={
            carregandoMais ? <ActivityIndicator color="#2563EB" /> : null
          }
          renderItem={({ item }) => (
            <ItemDoacao
              doacao={item}
              onPress={() =>
                navigation.navigate("DetalheDoacao", { id: item.id })
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  botaoNova: {
    backgroundColor: "#2563EB",
    minHeight: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  textoBotao: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  busca: {
    minHeight: 48,
    backgroundColor: "#FFFFFF",
    margin: 16,
    marginBottom: 0,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    fontSize: 15,
    color: "#1F2937",
  },
  centro: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  erro: { color: "#C62828", fontSize: 15, textAlign: "center", marginBottom: 12 },
  lista: { padding: 16, paddingBottom: 48 },
  vazio: { textAlign: "center", color: "#6B7280", marginTop: 32 },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 8,
  },
  cardTitulo: { fontSize: 17, fontWeight: "bold", color: "#1F2937", marginBottom: 4 },
  cardLinha: { fontSize: 14, color: "#4B5563", marginTop: 2 },
});
