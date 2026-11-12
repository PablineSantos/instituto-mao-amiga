package br.com.maoamiga.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DoacaoRequestDTO(
        @NotBlank String tipoItem,
        @NotNull @Min(1) Integer quantidade,
        @NotBlank String pontoDestino) {
}

