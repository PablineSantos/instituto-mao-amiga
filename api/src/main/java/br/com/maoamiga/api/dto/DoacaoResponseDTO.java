package br.com.maoamiga.api.dto;

import br.com.maoamiga.api.entity.Doacao;

import java.time.LocalDateTime;
import java.util.UUID;

public record DoacaoResponseDTO(
        UUID id,
        String tipoItem,
        Integer quantidade,
        String pontoDestino,
        LocalDateTime criadoEm) {

    public static DoacaoResponseDTO from(Doacao d) {
        return new DoacaoResponseDTO(d.getId(), d.getTipoItem(), d.getQuantidade(), d.getPontoDestino(), d.getCriadoEm());
    }
}

