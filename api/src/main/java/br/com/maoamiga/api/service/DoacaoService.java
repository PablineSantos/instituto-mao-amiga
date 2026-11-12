package br.com.maoamiga.api.service;

import br.com.maoamiga.api.dto.DoacaoRequestDTO;
import br.com.maoamiga.api.dto.DoacaoResponseDTO;
import br.com.maoamiga.api.entity.Doacao;
import br.com.maoamiga.api.repository.DoacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DoacaoService {

    private final DoacaoRepository repository;

    public Page<DoacaoResponseDTO> filtrar(String filtro, Pageable pageable) {
        return repository.buscar(filtro, pageable).map(DoacaoResponseDTO::from);
    }

    public DoacaoResponseDTO buscar(UUID id) {
        return DoacaoResponseDTO.from(obter(id));
    }

    public DoacaoResponseDTO criar(DoacaoRequestDTO dto) {
        Doacao doacao = new Doacao();
        aplicar(doacao, dto);
        doacao.setCriadoEm(LocalDateTime.now());
        return DoacaoResponseDTO.from(repository.save(doacao));
    }

    public DoacaoResponseDTO atualizar(UUID id, DoacaoRequestDTO dto) {
        Doacao doacao = obter(id);
        aplicar(doacao, dto);
        return DoacaoResponseDTO.from(repository.save(doacao));
    }

    public void excluir(UUID id) {
        repository.delete(obter(id));
    }

    private Doacao obter(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doacao nao encontrada"));
    }

    private void aplicar(Doacao doacao, DoacaoRequestDTO dto) {
        doacao.setTipoItem(dto.tipoItem());
        doacao.setQuantidade(dto.quantidade());
        doacao.setPontoDestino(dto.pontoDestino());
    }
}

