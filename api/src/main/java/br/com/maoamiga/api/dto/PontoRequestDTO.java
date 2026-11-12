package br.com.maoamiga.api.dto;

import jakarta.validation.constraints.NotBlank;

public record PontoRequestDTO(
        @NotBlank String nome,
        @NotBlank String endereco,
        @NotBlank String bairro,
        @NotBlank String horario,
        @NotBlank String tipo) {
}
