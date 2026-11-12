package br.com.maoamiga.api.service;

import br.com.maoamiga.api.dto.PontoRequestDTO;
import br.com.maoamiga.api.dto.PontoResponseDTO;
import br.com.maoamiga.api.entity.Ponto;
import br.com.maoamiga.api.repository.PontoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PontoService {

    private final PontoRepository repository;

    public List<PontoResponseDTO> listar() {
        return repository.findAll().stream().map(PontoResponseDTO::from).toList();
    }

    public Page<PontoResponseDTO> filtrar(String filtro, Pageable pageable) {
        return repository.buscar(filtro, pageable).map(PontoResponseDTO::from);
    }

    public PontoResponseDTO buscar(UUID id) {
        return PontoResponseDTO.from(obter(id));
    }

    public PontoResponseDTO criar(PontoRequestDTO dto) {
        Ponto ponto = new Ponto();
        aplicar(ponto, dto);
        return PontoResponseDTO.from(repository.save(ponto));
    }

    public PontoResponseDTO atualizar(UUID id, PontoRequestDTO dto) {
        Ponto ponto = obter(id);
        aplicar(ponto, dto);
        return PontoResponseDTO.from(repository.save(ponto));
    }

    public void excluir(UUID id) {
        repository.delete(obter(id));
    }

    private Ponto obter(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ponto nao encontrado"));
    }

    private void aplicar(Ponto ponto, PontoRequestDTO dto) {
        ponto.setNome(dto.nome());
        ponto.setEndereco(dto.endereco());
        ponto.setBairro(dto.bairro());
        ponto.setHorario(dto.horario());
        ponto.setTipo(dto.tipo());
    }
}
