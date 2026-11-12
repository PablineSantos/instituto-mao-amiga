import { useState } from "react";
import {
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
  cadastrarPonto,
  editarPonto,
  Ponto,
  PontoInput,
} from "./src/services/pontosService";

const CAMPOS: { chave: keyof PontoInput; rotulo: string }[] = [
  { chave: "nome", rotulo: "Nome" },
  { chave: "endereco", rotulo: "Endereço" },
  { chave: "bairro", rotulo: "Bairro" },
  { chave: "horario", rotulo: "Horário (ex.: Seg a Sex, 8h às 17h)" },
  { chave: "tipo", rotulo: "Tipo (coleta ou distribuição)" },
];

export default function TelaFormPonto({ route, navigation }: any) {
  const ponto: Ponto | undefined = route?.params?.ponto;

  const [dados, setDados] = useState<PontoInput>({
    nome: ponto?.nome ?? "",
    endereco: ponto?.endereco ?? "",
    bairro: ponto?.bairro ?? "",
    horario: ponto?.horario ?? "",
    tipo: ponto?.tipo ?? "",
  });
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function salvar() {
    const vazio = CAMPOS.find((c) => dados[c.chave].trim() === "");
    if (vazio) {
      setErro("Preencha todos os campos.");
      return;
    }
    const limpo: PontoInput = {
      nome: dados.nome.trim(),
      endereco: dados.endereco.trim(),
      bairro: dados.bairro.trim(),
      horario: dados.horario.trim(),
      tipo: dados.tipo.trim(),
    };

    setEnviando(true);
    try {
      if (ponto) {
        await editarPonto(ponto.id, limpo);
      } else {
        await cadastrarPonto(limpo);
      }
      navigation.goBack();
    } catch (e) {
      // Keep what was typed and tell the user it did not work.
      setErro(mensagemDeErro(e, "Ponto"));
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
          {CAMPOS.map((c) => (
            <TextInput
              key={c.chave}
              style={styles.input}
              placeholder={c.rotulo}
              placeholderTextColor="#888"
              value={dados[c.chave]}
              onChangeText={(texto) =>
                setDados((atual) => ({ ...atual, [c.chave]: texto }))
              }
            />
          ))}

          {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

          <TouchableOpacity
            style={[styles.botao, enviando && styles.desabilitado]}
            onPress={salvar}
            disabled={enviando}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotao}>
              {ponto ? "Salvar alterações" : "Cadastrar ponto"}
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
  erro: { color: "#C62828", marginBottom: 12, fontSize: 14, fontWeight: "500" },
  botao: {
    backgroundColor: "#2563EB",
    minHeight: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  desabilitado: { opacity: 0.6 },
  textoBotao: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
