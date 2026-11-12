import { del, get, post, put } from "./api";
import { Pagina } from "./pontosService";

export type Doacao = {
  id: string;
  tipoItem: string;
  quantidade: number;
  pontoDestino: string;
  criadoEm: string;
};

export type DoacaoInput = {
  tipoItem: string;
  quantidade: number;
  pontoDestino: string;
};

const BASE = "/api/v1/doacoes";

export function listarPagina(
  filtro: string,
  page: number,
  size = 10,
): Promise<Pagina<Doacao>> {
  const q = encodeURIComponent(filtro);
  return get<Pagina<Doacao>>(
    `${BASE}/filtro?filtro=${q}&page=${page}&size=${size}`,
  );
}

export function buscarDoacao(id: string): Promise<Doacao> {
  return get<Doacao>(`${BASE}/${id}`);
}

export function cadastrarDoacao(dados: DoacaoInput): Promise<Doacao> {
  return post<Doacao>(BASE, dados);
}

export function editarDoacao(id: string, dados: DoacaoInput): Promise<Doacao> {
  return put<Doacao>(`${BASE}/${id}`, dados);
}

export function excluirDoacao(id: string): Promise<void> {
  return del(`${BASE}/${id}`);
}
