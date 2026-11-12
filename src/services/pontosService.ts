import { del, get, post, put } from "./api";

export type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  horario: string;
  tipo: string;
};

export type PontoInput = Omit<Ponto, "id">;

export type Pagina<T> = {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

const BASE = "/api/v1/pontos";

export function listarPontos(): Promise<Ponto[]> {
  return get<Ponto[]>(BASE);
}

export function buscarPagina(
  filtro: string,
  page: number,
  size = 10,
): Promise<Pagina<Ponto>> {
  const q = encodeURIComponent(filtro);
  return get<Pagina<Ponto>>(
    `${BASE}/filtro?filtro=${q}&page=${page}&size=${size}`,
  );
}

export function buscarPonto(id: string): Promise<Ponto> {
  return get<Ponto>(`${BASE}/${id}`);
}

export function cadastrarPonto(dados: PontoInput): Promise<Ponto> {
  return post<Ponto>(BASE, dados);
}

export function editarPonto(id: string, dados: PontoInput): Promise<Ponto> {
  return put<Ponto>(`${BASE}/${id}`, dados);
}

export function excluirPonto(id: string): Promise<void> {
  return del(`${BASE}/${id}`);
}
