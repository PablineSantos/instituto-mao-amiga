import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Doacao, listarDoacoes } from "./doacoesStorage";

export interface ItemDoacaoProps {
  doacao: Doacao;
  onPress?: () => void;
}

export const ItemDoacao = React.memo(function ItemDoacao({
  doacao,
  onPress,
}: ItemDoacaoProps) {
  const dataFormatada = doacao.criadoEm
    ? new Date(doacao.criadoEm).toLocaleString("pt-BR")
    : "Data não informada";

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.cardTitulo}>{doacao.tipoItem || "Doação"}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.cardLabel}>Quantidade: </Text>
        <Text style={styles.cardValor}>{doacao.quantidade ?? "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.cardLabel}>Destino: </Text>
        <Text style={styles.cardValor}>
          {doacao.pontoDestino || "Não especificado"}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.cardLabel}>Data: </Text>
        <Text style={styles.cardValor}>{dataFormatada}</Text>
      </View>
    </TouchableOpacity>
  );
});

export default function TelaMinhasDoacoes({ navigation }: any) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("");

  const carregarHistorico = useCallback(async () => {
    try {
      setCarregando(true);
      const lista = await listarDoacoes();
      setDoacoes(lista);
    } catch (error) {
      console.error("Erro ao carregar histórico de doações:", error);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarHistorico();
    }, [carregarHistorico]),
  );

  const doacoesFiltradas = useMemo(() => {
    if (!filtro.trim()) {
      return doacoes;
    }
    const termo = filtro.trim().toLowerCase();
    return doacoes.filter((d) =>
      (d.tipoItem || "").toLowerCase().includes(termo),
    );
  }, [doacoes, filtro]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por tipo de item..."
          placeholderTextColor="#9CA3AF"
          value={filtro}
          onChangeText={setFiltro}
          clearButtonMode="while-editing"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {filtro.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setFiltro("")}
            activeOpacity={0.7}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {carregando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={doacoesFiltradas}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ItemDoacao
              doacao={item}
              onPress={() =>
                navigation.navigate("DetalheDoacao", { doacao: item })
              }
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            doacoesFiltradas.length === 0 && styles.listContentEmpty,
          ]}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            filtro.trim() !== "" ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>
                  Nenhum resultado encontrado
                </Text>
                <Text style={styles.emptySubtitle}>
                  Nenhuma doação encontrada para &quot;{filtro.trim()}&quot;.
                </Text>
                <TouchableOpacity
                  style={styles.clearFilterButton}
                  onPress={() => setFiltro("")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.clearFilterButtonText}>Limpar busca</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>Nenhuma doação registrada</Text>
                <Text style={styles.emptySubtitle}>
                  Você ainda não possui histórico de doações salvas no aparelho.
                </Text>
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={() => navigation.navigate("Lista")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.emptyButtonText}>Registrar Doação</Text>
                </TouchableOpacity>
              </View>
            )
          }
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    minHeight: 48,
    fontSize: 15,
    color: "#1F2937",
    paddingVertical: 8,
  },
  clearButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 16,
    color: "#9CA3AF",
    fontWeight: "bold",
  },
  clearFilterButton: {
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearFilterButtonText: {
    color: "#3730A3",
    fontWeight: "600",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  cardValor: {
    fontSize: 14,
    color: "#1F2937",
    flexShrink: 1,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
});
