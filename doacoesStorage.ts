import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEY = '@instituto_mao_amiga:doacoes';

export interface Doacao {
  id: string;
  tipoItem?: string;
  quantidade?: number;
  pontoDestino?: string;
  pontoId?: number;
  criadoEm: string;
  [key: string]: any;
}

export type NovaDoacao = Partial<Doacao> & Record<string, any>;

let lastTimestamp = 0;

function gerarIdUnico(): string {
  let now = Date.now();
  if (now <= lastTimestamp) {
    now = lastTimestamp + 1;
  }
  lastTimestamp = now;
  return String(now);
}

/**
 * Returns all saved donations from AsyncStorage.
 * Always returns an array, even if empty or if an error occurs.
 */
export async function listarDoacoes(): Promise<Doacao[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) {
      return [];
    }
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    console.error('Erro ao listar doações do AsyncStorage:', error);
    return [];
  }
}

/**
 * Saves a new donation to AsyncStorage.
 * Appends the new donation to the existing array.
 * Ensures the donation has a unique `id` and `criadoEm` (timestamp).
 */
export async function salvarDoacao(doacao: NovaDoacao = {}): Promise<Doacao> {
  try {
    const doacoesExistentes = await listarDoacoes();

    const novaDoacao: Doacao = {
      ...doacao,
      id: doacao.id ? String(doacao.id) : gerarIdUnico(),
      criadoEm: doacao.criadoEm || new Date().toISOString(),
    };

    const listaAtualizada = [...doacoesExistentes, novaDoacao];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaAtualizada));

    return novaDoacao;
  } catch (error) {
    console.error('Erro ao salvar doação no AsyncStorage:', error);
    throw error;
  }
}

/**
 * Clears all donations from AsyncStorage (useful for tests or resets).
 */
export async function limparDoacoes(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao limpar doações do AsyncStorage:', error);
    throw error;
  }
}

/**
 * Removes a donation by its id from AsyncStorage.
 */
export async function excluirDoacao(id: string): Promise<void> {
  try {
    const doacoesExistentes = await listarDoacoes();
    const listaAtualizada = doacoesExistentes.filter((d) => String(d.id) !== String(id));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaAtualizada));
  } catch (error) {
    console.error('Erro ao excluir doação no AsyncStorage:', error);
    throw error;
  }
}

export default {
  STORAGE_KEY,
  listarDoacoes,
  salvarDoacao,
  limparDoacoes,
  excluirDoacao,
};
