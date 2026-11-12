import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE = "@mao-amiga/favoritos";

export async function listarFavoritos(): Promise<string[]> {
  const bruto = await AsyncStorage.getItem(CHAVE);
  if (!bruto) {
    return [];
  }
  try {
    const lista: unknown = JSON.parse(bruto);
    return Array.isArray(lista)
      ? lista.filter((i): i is string => typeof i === "string")
      : [];
  } catch {
    return [];
  }
}

/** Toggles the id and returns the updated list of favorite ids. */
export async function alternarFavorito(id: string): Promise<string[]> {
  const atuais = await listarFavoritos();
  const novos = atuais.includes(id)
    ? atuais.filter((i) => i !== id)
    : [...atuais, id];
  await AsyncStorage.setItem(CHAVE, JSON.stringify(novos));
  return novos;
}
