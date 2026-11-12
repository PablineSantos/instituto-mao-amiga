import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { mensagemDeErro } from "./src/services/api";
import {
  cadastrarDoacao,
  Doacao,
  editarDoacao,
} from "./src/services/doacoesService";
import { listarPontos, Ponto } from "./src/services/pontosService";

export default function TelaFormDoacao({ route, navigation }: any) {
  const doacao: Doacao | undefined = route?.params?.doacao;

  const [tipoItem, setTipoItem] = useState(doacao?.tipoItem ?? "");
  const [quantidade, setQuantidade] = useState(
    doacao ? String(doacao.quantidade) : "",
  );
  const [pontoDestino, setPontoDestino] = useState(doacao?.pontoDestino ?? "");
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [carregandoPontos, setCarregandoPontos] = useState(true);
  const [erroPontos, setErroPontos] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    listarPontos()
      .then(setPontos)
      .catch((e) => setErroPontos(mensagemDeErro(e, "Ponto")))
      .finally(() => setCarregandoPontos(false));
  }, []);

  async function salvar() {
    if (tipoItem.trim() === "") {
      setErro("O tipo do item não pode ficar vazio.");
      return;
    }
    if (!/^\d+$/.test(quantidade.trim()) || Number(quantidade) <= 0) {
      setErro("A quantidade deve ser um número inteiro maior que zero.");
      return;
    }
    if (pontoDestino === "") {
      setErro("Escolha um ponto de destino.");
      return;
    }

    const dados = {
      tipoItem: tipoItem.trim(),
      quantidade: Number(quantidade.trim()),
      pontoDestino,
    };

    setEnviando(true);
    try {
      if (doacao) {
        await editarDoacao(doacao.id, dados);
      } else {
        await cadastrarDoacao(dados);
      }
      navigation.goBack();
    } catch (e) {
      // Keep typed values and warn the user.
      setErro(mensagemDeErro(e, "Doação"));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Tipo do item (ex: Cesta Básica)"
            placeholderTextColor="#888"
            value={tipoItem}
            onChangeText={setTipoItem}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            placeholderTextColor="#888"
            value={quantidade}
            onChangeText={(t) => setQuantidade(t.replace(/[^0-9]/g, ""))}
            keyboardType="number-pad"
          />

          <Text style={styles.rotulo}>Ponto de destino</Text>
          {carregandoPontos ? (
            <ActivityIndicator color="#2563EB" />
          ) : erroPontos !== "" ? (
            <Text style={styles.erro}>{erroPontos}</Text>
          ) : (
            pontos.map((p) => {
              const escolhido = p.nome === pontoDestino;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.ponto, escolhido && styles.pontoEscolhido]}
                  onPress={() => setPontoDestino(p.nome)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.pontoTexto, escolhido && styles.pontoTextoEscolhido]}
                  >
                    {p.nome}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}

          {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

          <TouchableOpacity
            style={[styles.botao, enviando && styles.desabilitado]}
            onPress={salvar}
            disabled={enviando}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotao}>
              {doacao ? "Salvar alterações" : "Registrar doação"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 48 },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 12 },
  input: {
    minHeight: 48,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  rotulo: { fontSize: 14, fontWeight: "bold", color: "#6B7280", marginBottom: 8 },
  ponto: {
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    marginBottom: 8,
  },
  pontoEscolhido: { backgroundColor: "#DBEAFE", borderColor: "#2563EB" },
  pontoTexto: { fontSize: 15, color: "#374151" },
  pontoTextoEscolhido: { color: "#1D4ED8", fontWeight: "bold" },
  erro: { color: "#C62828", marginVertical: 8, fontSize: 14, fontWeight: "500" },
  botao: {
    backgroundColor: "#2563EB",
    minHeight: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  desabilitado: { opacity: 0.6 },
  textoBotao: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
