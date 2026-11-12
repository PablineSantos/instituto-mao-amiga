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
import {
  buscarDoacao,
  Doacao,
  excluirDoacao,
} from "./src/services/doacoesService";

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

export default function TelaDetalheDoacao({ route, navigation }: any) {
  const id: string | undefined = route?.params?.id;
  const [doacao, setDoacao] = useState<Doacao | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [erroAcao, setErroAcao] = useState("");

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      async function carregar() {
        if (!id) {
          setErro("doação não encontrada");
          setCarregando(false);
          return;
        }
        try {
          const resultado = await buscarDoacao(id);
          if (ativo) {
            setDoacao(resultado);
            setErro("");
          }
        } catch (e) {
          if (ativo) {
            setDoacao(null);
            setErro(
              e instanceof ApiError && e.status === 404
                ? "doação não encontrada"
                : mensagemDeErro(e, "Doação"),
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

  async function executarExclusao() {
    if (!doacao) {
      return;
    }
    try {
      await excluirDoacao(doacao.id);
      navigation.goBack();
    } catch (e) {
      setErroAcao(mensagemDeErro(e, "Doação"));
    }
  }

  function confirmarExclusao() {
    if (Platform.OS === "web") {
      if (window.confirm("Deseja realmente excluir esta doação?")) {
        executarExclusao();
      }
      return;
    }
    Alert.alert("Confirmar exclusão", "Deseja realmente excluir esta doação?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: executarExclusao },
    ]);
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!doacao) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erro}>{erro}</Text>
      </View>
    );
  }

  const data = doacao.criadoEm
    ? new Date(doacao.criadoEm).toLocaleString("pt-BR", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : "Data não informada";

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.card}>
        <Text style={styles.titulo}>{doacao.tipoItem}</Text>
        <Campo label="Quantidade" valor={String(doacao.quantidade)} />
        <Campo label="Ponto de destino" valor={doacao.pontoDestino} />
        <Campo label="Data do registro" valor={data} />

        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() => navigation.navigate("FormDoacao", { doacao })}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotao}>Editar doação</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botaoExcluir}
          onPress={confirmarExclusao}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotao}>Excluir doação</Text>
        </TouchableOpacity>
        {erroAcao !== "" && <Text style={styles.erro}>{erroAcao}</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  erro: { color: "#C62828", fontSize: 16, textAlign: "center", marginTop: 8 },
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
  valor: { fontSize: 16, color: "#444", marginTop: 4 },
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
