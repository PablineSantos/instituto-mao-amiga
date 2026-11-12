import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ApiError, mensagemDeErro } from "./src/services/api";
import {
  alternarFavorito,
  listarFavoritos,
} from "./src/services/favoritosStorage";
import { buscarPonto, Ponto } from "./src/services/pontosService";

export default function TelaMeusPontos({ navigation }: any) {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      async function carregar() {
        try {
          const ids = await listarFavoritos();
          // Fetch each favorite by id; deleted points (404) are skipped.
          const resultados = await Promise.all(
            ids.map((id) =>
              buscarPonto(id).catch((e) => {
                if (e instanceof ApiError && e.status === 404) {
                  return null;
                }
                throw e;
              }),
            ),
          );
          if (ativo) {
            setPontos(resultados.filter((p): p is Ponto => p !== null));
            setErro("");
          }
        } catch (e) {
          if (ativo) {
            setErro(mensagemDeErro(e, "Ponto"));
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
    }, []),
  );

  async function desmarcar(id: string) {
    // Remove from the screen right away, then persist.
    setPontos((atuais) => atuais.filter((p) => p.id !== id));
    await alternarFavorito(id);
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erro}>{erro}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={pontos}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.lista}
      ListEmptyComponent={
        <Text style={styles.vazio}>Você ainda não favoritou nenhum ponto.</Text>
      }
      renderItem={({ item }) => (
        <View style={styles.item}>
          <TouchableOpacity
            style={styles.info}
            onPress={() => navigation.navigate("Detalhe", { id: item.id })}
            activeOpacity={0.7}
          >
            <Text style={styles.titulo}>{item.nome}</Text>
            <Text style={styles.subtitulo}>
              {item.tipo} • {item.bairro}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.coracao}
            onPress={() => desmarcar(item.id)}
            accessibilityLabel="Desmarcar favorito"
          >
            <Text style={styles.coracaoTexto}>♥</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  centro: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  erro: { color: "#C62828", fontSize: 15, textAlign: "center" },
  lista: { padding: 16, paddingBottom: 48 },
  vazio: { textAlign: "center", color: "#6B7280", marginTop: 32 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 8,
  },
  info: { flex: 1, padding: 16 },
  titulo: { fontSize: 18, fontWeight: "bold", color: "#1F2937" },
  subtitulo: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  coracao: { width: 48, height: 48, justifyContent: "center", alignItems: "center" },
  coracaoTexto: { fontSize: 26, color: "#DC2626" },
});
