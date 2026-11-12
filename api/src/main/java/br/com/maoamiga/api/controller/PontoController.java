package br.com.maoamiga.api.controller;

import br.com.maoamiga.api.dto.PontoRequestDTO;
import br.com.maoamiga.api.dto.PontoResponseDTO;
import br.com.maoamiga.api.service.PontoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/pontos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PontoController {

    private final PontoService service;

    @GetMapping
    public List<PontoResponseDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public PontoResponseDTO buscar(@PathVariable UUID id) {
        return service.buscar(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PontoResponseDTO criar(@Valid @RequestBody PontoRequestDTO dto) {
        return service.criar(dto);
    }

    @PutMapping("/{id}")
    public PontoResponseDTO atualizar(@PathVariable UUID id, @Valid @RequestBody PontoRequestDTO dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable UUID id) {
        service.excluir(id);
    }
}
