const API_URL: string =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : {},
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Network failure (server offline / unreachable): status 0
    throw new ApiError(0, "Não foi possível conectar ao servidor.");
  }

  if (!response.ok) {
    throw new ApiError(response.status, `Erro ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export function get<T>(path: string): Promise<T> {
  return request<T>("GET", path);
}

export function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>("POST", path, body);
}

export function put<T>(path: string, body: unknown): Promise<T> {
  return request<T>("PUT", path, body);
}

export function del(path: string): Promise<void> {
  return request<void>("DELETE", path);
}

export function mensagemDeErro(error: unknown, entidade: string): string {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      return "Servidor indisponível. Verifique se a API está ligada.";
    }
    if (error.status === 404) {
      return `${entidade} não encontrado(a).`;
    }
    if (error.status === 400) {
      return "A API recusou os dados enviados. Revise os campos.";
    }
  }
  return "Ocorreu um erro inesperado. Tente novamente.";
}
