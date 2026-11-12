import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { buscarPagina, Ponto } from "./src/services/pontosService";

export default function TelaListaPontos({ navigation }: any) {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [filtro, setFiltro] = useState("");
  const [filtroAplicado, setFiltroAplicado] = useState("");
  const [proximaPagina, setProximaPagina] = useState(0);
  const [ultimaPagina, setUltimaPagina] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erro, setErro] = useState("");

  // Guards: avoid duplicate page requests and ignore stale responses.
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
        const resposta = await buscarPagina(termo, pagina);
        if (id !== requisicao.current) {
          return;
        }
        setPontos((atuais) =>
          reiniciar ? resposta.content : [...atuais, ...resposta.content],
        );
        setProximaPagina(pagina + 1);
        setUltimaPagina(pagina + 1 >= resposta.page.totalPages);
        setErro("");
      } catch (e) {
        if (id === requisicao.current) {
          setErro(mensagemDeErro(e, "Ponto"));
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

  // Every new search goes back to the first page.
  useEffect(() => {
    const t = setTimeout(() => setFiltroAplicado(filtro.trim()), 400);
    return () => clearTimeout(t);
  }, [filtro]);

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
      <TextInput
        style={styles.busca}
        placeholder="Buscar por nome ou bairro..."
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
      ) : erro && pontos.length === 0 ? (
        <View style={styles.centro}>
          <Text style={styles.erro}>{erro}</Text>
          <TouchableOpacity
            style={styles.botao}
            onPress={() => carregarPagina(filtroAplicado, 0, true)}
          >
            <Text style={styles.textoBotao}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pontos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          onEndReached={carregarMais}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={
            <Text style={styles.vazio}>Nenhum ponto encontrado.</Text>
          }
          ListFooterComponent={
            carregandoMais ? <ActivityIndicator color="#2563EB" /> : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("Detalhe", { id: item.id })}
            >
              <Text style={styles.titulo}>{item.nome}</Text>
              <Text style={styles.subtitulo}>
                {item.tipo} • {item.bairro}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
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
  botao: {
    backgroundColor: "#2563EB",
    minHeight: 48,
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  textoBotao: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  lista: { padding: 16, paddingBottom: 48 },
  vazio: { textAlign: "center", color: "#6B7280", marginTop: 32 },
  item: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 8,
    minHeight: 48,
    justifyContent: "center",
  },
  titulo: { fontSize: 18, fontWeight: "bold", color: "#1F2937" },
  subtitulo: { fontSize: 14, color: "#6B7280", marginTop: 4 },
});
