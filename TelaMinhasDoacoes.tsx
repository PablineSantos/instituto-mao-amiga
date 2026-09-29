import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
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

  return (
    <View style={styles.container}>
      {carregando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={doacoes}
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
            doacoes.length === 0 && styles.listContentEmpty,
          ]}
          ListEmptyComponent={
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
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
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
