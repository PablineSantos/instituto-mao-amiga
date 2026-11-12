import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ApiError, mensagemDeErro } from "./src/services/api";
import { buscarPonto, excluirPonto, Ponto } from "./src/services/pontosService";

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.texto}>{valor}</Text>
    </View>
  );
}

export default function TelaDetalhePonto({ route, navigation }: any) {
  const id: string | undefined = route?.params?.id;
  const [ponto, setPonto] = useState<Ponto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [erroAcao, setErroAcao] = useState("");

  async function executarExclusao() {
    if (!ponto) {
      return;
    }
    try {
      await excluirPonto(ponto.id);
      navigation.goBack();
    } catch (e) {
      setErroAcao(mensagemDeErro(e, "Ponto"));
    }
  }

  function confirmarExclusao() {
    if (Platform.OS === "web") {
      if (window.confirm("Deseja realmente excluir este ponto?")) {
        executarExclusao();
      }
      return;
    }
    Alert.alert("Confirmar exclusão", "Deseja realmente excluir este ponto?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: executarExclusao },
    ]);
  }

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      async function carregar() {
        if (!id) {
          setErro("ponto não encontrado");
          setCarregando(false);
          return;
        }
        try {
          const resultado = await buscarPonto(id);
          if (ativo) {
            setPonto(resultado);
            setErro("");
          }
        } catch (e) {
          if (ativo) {
            setPonto(null);
            setErro(
              e instanceof ApiError && e.status === 404
                ? "ponto não encontrado"
                : mensagemDeErro(e, "Ponto"),
            );
          }
        } finally {
          if (ativo) {
            setCarregando(false);
          }
        }
      }
      carregar();
      return () => {
        ativo = false;
      };
    }, [id]),
  );

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!ponto) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erro}>{erro}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.card}>
        <Text style={styles.titulo}>{ponto.nome}</Text>
        <Campo label="Tipo" valor={ponto.tipo} />
        <Campo label="Endereço" valor={ponto.endereco} />
        <Campo label="Bairro" valor={ponto.bairro} />
        <Campo label="Horário" valor={ponto.horario} />

        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() => navigation.navigate("FormPonto", { ponto })}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotao}>Editar ponto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botaoExcluir}
          onPress={confirmarExclusao}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotao}>Excluir ponto</Text>
        </TouchableOpacity>
        {erroAcao !== "" && <Text style={styles.erro}>{erroAcao}</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  erro: { color: "#C62828", fontSize: 16, textAlign: "center" },
  scroll: { flexGrow: 1, padding: 16, backgroundColor: "#F4F6F8" },
  card: {
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  campo: { marginBottom: 16 },
  label: { fontSize: 14, color: "#888", fontWeight: "bold", textTransform: "uppercase" },
  texto: { fontSize: 16, color: "#444", marginTop: 4 },
  botaoEditar: {
    backgroundColor: "#2563EB",
    minHeight: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  botaoExcluir: {
    backgroundColor: "#C62828",
    minHeight: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  textoBotao: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
