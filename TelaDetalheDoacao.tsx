import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Doacao, excluirDoacao, listarDoacoes } from "./doacoesStorage";

export default function TelaDetalheDoacao({ route, navigation }: any) {
  const [doacao, setDoacao] = useState<Doacao>(
    route?.params?.doacao || route?.params,
  );

  useFocusEffect(
    useCallback(() => {
      async function recarregar() {
        if (doacao?.id) {
          const lista = await listarDoacoes();
          const encontrada = lista.find(
            (d) => String(d.id) === String(doacao.id),
          );
          if (encontrada) {
            setDoacao(encontrada);
          }
        }
      }
      recarregar();
    }, [doacao?.id]),
  );

  if (!doacao || !doacao.id) {
    return (
      <View style={styles.containerVazio}>
        <Text style={styles.textoVazio}>Doação não encontrada.</Text>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotaoVoltar}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const dataFormatada = doacao.criadoEm
    ? new Date(doacao.criadoEm).toLocaleString("pt-BR", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : "Data não informada";

  async function executarExclusao() {
    try {
      await excluirDoacao(String(doacao.id));
      navigation.navigate("MinhasDoacoes", { timestamp: Date.now() });
    } catch (error) {
      if (Platform.OS === "web") {
        window.alert("Não foi possível excluir a doação.");
      } else {
        Alert.alert("Erro", "Não foi possível excluir a doação.");
      }
    }
  }

  function confirmarExclusao() {
    if (Platform.OS === "web") {
      const confirmou = window.confirm(
        "Deseja realmente excluir esta doação do histórico?",
      );
      if (confirmou) {
        executarExclusao();
      }
      return;
    }

    Alert.alert(
      "Confirmar exclusão",
      "Deseja realmente excluir esta doação do histórico?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: executarExclusao,
        },
      ],
      { cancelable: true },
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.card}>
        <Text style={styles.titulo}>{doacao.tipoItem || "Doação"}</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>ID da Doação:</Text>
          <Text style={styles.valor}>{doacao.id}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Tipo do Item:</Text>
          <Text style={styles.valor}>{doacao.tipoItem || "Não informado"}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Quantidade:</Text>
          <Text style={styles.valor}>{doacao.quantidade ?? "0"}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Ponto de Destino:</Text>
          <Text style={styles.valor}>
            {doacao.pontoDestino || "Não especificado"}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Data e Hora do Registro:</Text>
          <Text style={styles.valor}>{dataFormatada}</Text>
        </View>

        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() => navigation.navigate("Lista", { doacaoEdicao: doacao })}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotaoEditar}>Editar Doação</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoExcluir}
          onPress={confirmarExclusao}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotaoExcluir}>Excluir Doação</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 20,
    textAlign: "center",
  },
  infoContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  valor: {
    fontSize: 16,
    color: "#1F2937",
    marginTop: 4,
  },
  botaoEditar: {
    backgroundColor: "#2563EB",
    borderRadius: 8,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textoBotaoEditar: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  botaoExcluir: {
    backgroundColor: "#DC2626",
    borderRadius: 8,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textoBotaoExcluir: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  containerVazio: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  textoVazio: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 16,
  },
  botaoVoltar: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  textoBotaoVoltar: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
